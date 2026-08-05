const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const open = require('open');
const { showStartHeader, showExecutingCommandHeader } = require('./headers/StartHeader');

async function startProject(config = {}, mainMenuCallback) {
  const { projectPath: cliProjectPath, packageManager: cliPackageManager, runCommand: cliRunCommand } = config;
  
  showStartHeader();

  let projectPath;
  let pathValid = false;

  if (cliProjectPath) {
    projectPath = cliProjectPath;
    console.log(chalk.green(`Project path: ${projectPath}`));
    console.log();

    const pathSpinner = ora({
      text: chalk.yellow('Validating project path...'),
      color: 'yellow'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!(await fs.pathExists(projectPath))) {
      pathSpinner.fail(chalk.red('Project path does not exist'));
      console.log(chalk.red(`The path "${projectPath}" does not exist.`));
      if (mainMenuCallback) mainMenuCallback();
      return;
    }
    pathSpinner.succeed(chalk.green('Project path validated!'));
    console.log();
  } else {
    while (!pathValid) {
      const result = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectPath',
          message: 'Enter the project path:',
          validate: (input) => input.trim() !== '' || 'Project path cannot be empty'
        }
      ]);
      projectPath = result.projectPath;

      const pathSpinner = ora({
        text: chalk.yellow('Validating project path...'),
        color: 'yellow'
      }).start();
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!(await fs.pathExists(projectPath))) {
        pathSpinner.fail(chalk.red('Project path does not exist'));
        console.log(chalk.red(`The path "${projectPath}" does not exist.`));
        console.log();
      } else {
        pathSpinner.succeed(chalk.green('Project path validated!'));
        console.log();
        pathValid = true;
      }
    }
  }

  let packageManager;
  let runCommand;
  
  if (cliPackageManager && cliRunCommand) {
    packageManager = cliPackageManager;
    runCommand = cliRunCommand;
    console.log(chalk.green(`Package Manager: ${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)}`));
    console.log(chalk.green(`Command: ${runCommand}`));
    console.log();
  } else {
    const { packageManagerChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageManagerChoice',
        message: 'Select your package manager:',
        choices: [
          { name: chalk.yellow('Bun') + chalk.gray(' - Lightning fast'), value: '1' },
          { name: chalk.red('npm') + chalk.gray(' - Standard'), value: '2' }
        ]
      }
    ]);

    packageManager = packageManagerChoice === '1' ? 'bun' : 'npm';
    
    const pkgSpinner = ora({
      text: chalk.magenta('Processing package manager choice...'),
      color: 'magenta'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));
    pkgSpinner.succeed(chalk.green(`${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)} selected!`));
    console.log();

    const result = await inquirer.prompt([
      {
        type: 'input',
        name: 'runCommand',
        message: 'Enter the command to run (e.g., bun nodemon or npm run dev):',
        validate: (input) => input.trim() !== '' || 'Command cannot be empty'
      }
    ]);
    runCommand = result.runCommand;
    
    const cmdSpinner = ora({
      text: chalk.blue('Validating command...'),
      color: 'blue'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));
    cmdSpinner.succeed(chalk.green('Command validated!'));
    console.log();
  }

  showExecutingCommandHeader();
  console.log(`Path: ${projectPath}`);
  console.log(`Command: ${runCommand}`);
  console.log();
  console.log(chalk.cyan('========================================='));
  console.log();

  let browserOpened = false;

  try {
    const commandParts = runCommand.split(' ');
    const cmd = commandParts[0];
    const args = commandParts.slice(1);

    const child = spawn(cmd, args, {
      cwd: projectPath,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe']
    });

    // Pipe stdout to console while also checking for server startup
    child.stdout.on('data', (data) => {
      const output = data.toString();
      process.stdout.write(output);
      
      // Detect when server starts and open browser
      if (!browserOpened && (output.includes('Server is running') || output.includes('listening'))) {
        const portMatch = output.match(/:(\d+)/);
        const port = portMatch ? portMatch[1] : '3000';
        const url = `http://localhost:${port}`;
        
        console.log();
        console.log(chalk.green(`Opening browser at ${url}...`));
        open(url).catch(err => console.log(chalk.yellow('Could not open browser automatically:', err.message)));
        browserOpened = true;
      }
    });

    // Pipe stderr to console
    child.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    child.on('error', (error) => {
      console.log();
      console.log(chalk.red('Error starting server:'), error.message);
    });

    child.on('close', (code) => {
      console.log();
      console.log('Server stopped.');
      if (mainMenuCallback) mainMenuCallback();
    });

  } catch (error) {
    console.log();
    console.log('Server stopped.');
    if (mainMenuCallback) await mainMenuCallback();
  }
}

module.exports = {
  startProject
};
