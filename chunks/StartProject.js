const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const open = require('open');
const { showStartHeader, showExecutingCommandHeader } = require('./headers/StartHeader');

async function findProjectFolder(folderName) {
  const searchSpinner = ora({
    text: chalk.yellow(`Searching for folder "${folderName}"...`),
    color: 'yellow'
  }).start();

  try {
    const { exec } = require('child_process');
    const os = require('os');
    
    // Extract the last folder name if it's a path
    const searchName = folderName.split(/[/\\]/).pop();
    
    // Search in the user's home directory only
    const userHome = os.homedir();
    
    const command = process.platform === 'win32' 
      ? `where /R "${userHome}" "${searchName}" 2>nul`
      : `find "${userHome}" -type d -name "${searchName}" 2>/dev/null`;
    
    const result = await Promise.race([
      new Promise((resolve) => {
        exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
          if (error || !stdout) {
            resolve([]);
          } else {
            const paths = stdout.trim().split('\n').filter(p => p.trim());
            resolve(paths);
          }
        });
      }),
      new Promise((resolve) => setTimeout(() => resolve([]), 5000)) // 5 second timeout
    ]);

    searchSpinner.stop();
    
    if (result.length === 0) {
      return null;
    }

    // Remove duplicates
    const uniquePaths = [...new Set(result)];
    return uniquePaths;
  } catch (error) {
    searchSpinner.stop();
    return null;
  }
}

async function browseFolders(startPath = null, originalInput = null) {
  const os = require('os');
  let currentPath = startPath || process.cwd();
  
  // If original input has path parts, try to navigate to the parent folder
  if (originalInput && (/[/\\]/).test(originalInput)) {
    const parts = originalInput.split(/[/\\]/);
    const parentFolder = parts[0];
    const parentPath = path.join(os.homedir(), parentFolder);
    
    if (await fs.pathExists(parentPath)) {
      currentPath = parentPath;
    }
  }
  
  while (true) {
    const items = await fs.readdir(currentPath);
    const folders = [];
    
    for (const item of items) {
      // Skip folders that start with a dot
      if (item.startsWith('.')) continue;
      
      const itemPath = path.join(currentPath, item);
      if ((await fs.stat(itemPath)).isDirectory()) {
        folders.push({
          name: item,
          path: itemPath
        });
      }
    }

    // Sort folders alphabetically
    folders.sort((a, b) => a.name.localeCompare(b.name));

    const choices = [];

    // Add select current directory option (only if not at home directory)
    if (currentPath !== os.homedir()) {
      choices.push({
        name: '✅ Select this directory',
        value: 'SELECT_CURRENT',
        short: 'Select'
      });
    }

    // Add parent directory option
    if (currentPath !== os.homedir()) {
      choices.push({
        name: '⬆️ .. (Go back)',
        value: path.dirname(currentPath),
        short: '..'
      });
    }

    // Add folders
    folders.forEach(f => {
      choices.push({
        name: `📁 ${f.name}`,
        value: f.path,
        short: f.name
      });
    });

    const { selectedPath } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedPath',
        message: `Browse folders - Current: ${currentPath}`,
        choices: choices,
        pageSize: 15,
        loop: false
      }
    ]);

    if (selectedPath === 'SELECT_CURRENT') {
      return currentPath;
    }

    // Navigate to selected folder
    currentPath = selectedPath;
  }
}

async function getFolderSize(folderPath) {
  let totalSize = 0;
  
  try {
    const items = await fs.readdir(folderPath);
    
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isDirectory()) {
        totalSize += await getFolderSize(itemPath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Skip folders we can't read
  }
  
  return totalSize;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function verifyExpressProject(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  if (!(await fs.pathExists(packageJsonPath))) {
    return { valid: false, reason: 'No package.json found in the project folder' };
  }

  try {
    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    let hasExpressInPackageJson = dependencies.express;
    
    // Also check raw package.json content for express string
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const hasExpressInContent = /express/i.test(packageJsonContent);
    
    // Check for express imports in source code files
    const commonEntryFiles = ['index.js', 'server.js', 'app.js', 'main.js', 'index.ts', 'server.ts', 'app.ts', 'main.ts'];
    let hasExpressImport = false;
    
    for (const file of commonEntryFiles) {
      const filePath = path.join(projectPath, file);
      if (await fs.pathExists(filePath)) {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check for various express import patterns
        const expressPatterns = [
          /require\s*\(\s*['"]express['"]\s*\)/,
          /require\s*\(\s*['"]express['"]\s*\/\s*['"]/,
          /import\s+.*\s+from\s+['"]express['"]/,
          /import\s+['"]express['"]/,
          /const\s+express\s*=\s*require\s*\(\s*['"]express['"]\s*\)/
        ];
        
        for (const pattern of expressPatterns) {
          if (pattern.test(content)) {
            hasExpressImport = true;
            break;
          }
        }
        
        if (hasExpressImport) break;
      }
    }
    
    // Also check in src folder if it exists
    const srcPath = path.join(projectPath, 'src');
    if (await fs.pathExists(srcPath)) {
      const srcFiles = ['index.js', 'server.js', 'app.js', 'main.js', 'index.ts', 'server.ts', 'app.ts', 'main.ts'];
      for (const file of srcFiles) {
        const filePath = path.join(srcPath, file);
        if (await fs.pathExists(filePath)) {
          const content = await fs.readFile(filePath, 'utf8');
          
          const expressPatterns = [
            /require\s*\(\s*['"]express['"]\s*\)/,
            /require\s*\(\s*['"]express['"]\s*\/\s*['"]/,
            /import\s+.*\s+from\s+['"]express['"]/,
            /import\s+['"]express['"]/,
            /const\s+express\s*=\s*require\s*\(\s*['"]express['"]\s*\)/
          ];
          
          for (const pattern of expressPatterns) {
            if (pattern.test(content)) {
              hasExpressImport = true;
              break;
            }
          }
          
          if (hasExpressImport) break;
        }
      }
    }
    
    if (hasExpressInPackageJson || hasExpressInContent || hasExpressImport) {
      return { valid: true };
    } else {
      return { valid: false, reason: 'Express is not found in package.json dependencies or source code imports' };
    }
  } catch (error) {
    return { valid: false, reason: 'Failed to read package.json' };
  }
}

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

    const expressSpinner = ora({
      text: chalk.yellow('Verifying Express project...'),
      color: 'yellow'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));

    const expressCheck = await verifyExpressProject(projectPath);
    if (!expressCheck.valid) {
      expressSpinner.fail(chalk.red('Not a valid Express project'));
      console.log(chalk.red(expressCheck.reason));
      if (mainMenuCallback) mainMenuCallback();
      return;
    }
    expressSpinner.succeed(chalk.green('Express project verified!'));
    console.log();
  } else {
    while (!pathValid) {
      const { inputMethod } = await inquirer.prompt([
        {
          type: 'list',
          name: 'inputMethod',
          message: 'How would you like to select your project?',
          choices: [
            { name: 'Enter project path manually', value: 'manual' },
            { name: 'Browse folders', value: 'browse' }
          ],
          default: 0,
          loop: false
        }
      ]);

      if (inputMethod === 'manual') {
        const result = await inquirer.prompt([
          {
            type: 'input',
            name: 'projectPath',
            message: 'Enter the project path or folder name:',
            validate: (input) => input.trim() !== '' || 'Project path cannot be empty'
          }
        ]);
        projectPath = result.projectPath;
      } else {
        console.log(chalk.cyan('Opening folder browser...'));
        const selectedPath = await browseFolders();
        projectPath = selectedPath;
        console.log(chalk.green(`Selected: ${projectPath}`));
      }

      let resolvedPath = projectPath;
      
      // Convert backslashes to forward slashes and resolve relative paths
      resolvedPath = resolvedPath.replace(/\\/g, '/');
      if (!path.isAbsolute(resolvedPath)) {
        resolvedPath = path.resolve(process.cwd(), resolvedPath);
      }

      const pathSpinner = ora({
        text: chalk.yellow('Validating project path...'),
        color: 'yellow'
      }).start();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!(await fs.pathExists(resolvedPath))) {
        pathSpinner.fail(chalk.red('Project path does not exist'));
        console.log(chalk.yellow(`Path "${projectPath}" does not exist. Searching for folder...`));
        
        const foundPaths = await findProjectFolder(projectPath);
        
        if (!foundPaths || foundPaths.length === 0) {
          console.log(chalk.red(`Could not find folder "${projectPath}" anywhere on the system.`));
          
          const { browseChoice } = await inquirer.prompt([
            {
              type: 'list',
              name: 'browseChoice',
              message: 'Would you like to browse folders to find your project?',
              choices: [
                { name: 'Yes', value: true },
                { name: 'No', value: false }
              ],
              default: 0,
              loop: false
            }
          ]);

          if (browseChoice) {
            console.log(chalk.cyan('Opening folder browser...'));
            const selectedBasePath = await browseFolders(null, projectPath);
            
            // Append original input path to selected directory
            const pathParts = projectPath.replace(/\\/g, '/').split('/');
            resolvedPath = selectedBasePath;
            
            for (const part of pathParts) {
              resolvedPath = path.join(resolvedPath, part);
              if (!(await fs.pathExists(resolvedPath))) {
                break;
              }
            }
            
            console.log(chalk.green(`Selected: ${resolvedPath}`));
          } else {
            console.log();
            continue;
          }
        } else if (foundPaths.length === 1) {
          resolvedPath = foundPaths[0];
          console.log(chalk.green(`Found folder at: ${resolvedPath}`));
        } else {
          const { selectedPath } = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedPath',
              message: 'Multiple folders found. Select one:',
              choices: foundPaths
            }
          ]);
          resolvedPath = selectedPath;
        }
      } else {
        pathSpinner.succeed(chalk.green('Project path validated!'));
      }

      const expressSpinner = ora({
        text: chalk.yellow('Verifying Express project...'),
        color: 'yellow'
      }).start();
      await new Promise(resolve => setTimeout(resolve, 500));

      const expressCheck = await verifyExpressProject(resolvedPath);
      if (!expressCheck.valid) {
        expressSpinner.fail(chalk.red('Not a valid Express project'));
        console.log(chalk.red(expressCheck.reason));
        console.log();
        continue;
      }

      expressSpinner.succeed(chalk.green('Express project verified!'));
      
      // Display folder size
      const sizeSpinner = ora({
        text: chalk.yellow('Calculating folder size...'),
        color: 'yellow'
      }).start();
      const folderSize = await getFolderSize(resolvedPath);
      sizeSpinner.succeed(chalk.green(`Folder size: ${formatSize(folderSize)}`));
      console.log();
      
      projectPath = resolvedPath;
      pathValid = true;
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
