const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync, spawn } = require('child_process');
const open = require('open');
const { showCreateHeader, showExpressProjectHeader, showProjectCreatedHeader, showStartingServerHeader } = require('./headers/CreateHeader');
const { initializeGitRepository } = require('./code/github/git');
const { createGitignore } = require('./code/github/gitignore');
const { createEnvFiles } = require('./code/env/env');
const { createNodemonJson } = require('./code/nodemon/nodemon');
const { updatePackageJson, createTsConfig } = require('./code/alias/alias');
const { createProjectFolders, createTemplatesFolder } = require('./code/functions/create-folders/CreateFolders');
const { createProjectFiles, createTemplateFile, createServerFile } = require('./code/functions/create-files/CreateFiles');

async function createNewProject(config = {}) {
  const { projectName: initialProjectName, language: cliLanguage } = config;
  let cliProjectName = initialProjectName;
  
  showCreateHeader();

  let projectName;
  let projectPath;
  let pathValid = false;

  while (!pathValid) {
    if (cliProjectName) {
      projectName = cliProjectName;
      console.log(chalk.green(`Project name: ${projectName}`));
      console.log();
    } else {
      const result = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Enter your project name:',
          validate: (input) => input.trim() !== '' || 'Project name cannot be empty'
        }
      ]);
      projectName = result.projectName;
    }

    const nameSpinner = ora({
      text: chalk.cyan('Validating project name...'),
      color: 'cyan'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));
    nameSpinner.succeed(chalk.green('Project name validated!'));
    console.log();

    projectPath = path.join(process.cwd(), projectName);

    if (await fs.pathExists(projectPath)) {
      console.log(chalk.red(`A folder named "${projectName}" already exists.`));
      console.log(chalk.yellow('Please enter a different project name.'));
      console.log();
    } else {
      pathValid = true;
    }
  }

  const pathSpinner = ora({
    text: chalk.yellow('Checking project path...'),
    color: 'yellow'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 400));
  pathSpinner.succeed(chalk.green('Project path is available!'));
  console.log();

  const { installExpress } = await inquirer.prompt([
    {
      type: 'list',
      name: 'installExpress',
      message: 'Do you want to install Express?',
      choices: [
        { name: chalk.green('Yes') + chalk.gray(' - Install Express and dependencies'), value: true },
        { name: chalk.red('No') + chalk.gray(' - Skip Express installation'), value: false }
      ],
      default: 'Yes'
    }
  ]);

  const expressSpinner = ora({
    text: chalk.magenta('Processing Express installation choice...'),
    color: 'magenta'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 500));
  expressSpinner.succeed(chalk.green(installExpress ? 'Express installation enabled!' : 'Express installation skipped!'));
  console.log();

  let language;
  if (cliLanguage) {
    language = cliLanguage;
    console.log(chalk.green(`Language: ${language.charAt(0).toUpperCase() + language.slice(1)}`));
    console.log();
  } else {
    const { languageChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'languageChoice',
        message: 'Select your language:',
        choices: [
          { name: chalk.yellow('JavaScript') + chalk.gray(' - Fast and flexible'), value: '1' },
          { name: chalk.blue('TypeScript') + chalk.gray(' - Type-safe development'), value: '2' }
        ]
      }
    ]);

    language = languageChoice === '1' ? 'javascript' : 'typescript';
  }
  
  const langSpinner = ora({
    text: chalk.blue(`Setting up ${language} environment...`),
    color: 'blue'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 600));
  langSpinner.succeed(chalk.green(`${language.charAt(0).toUpperCase() + language.slice(1)} configured!`));
  console.log();

  let aliasStyle = 'none';
  let packageManager = 'npm';

  if (installExpress) {
    const { aliasChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'aliasChoice',
        message: 'Select your path alias style:',
        choices: [
          { name: chalk.green('@') + chalk.gray(' - Clean imports'), value: '1' },
          { name: chalk.blue('/') + chalk.gray(' - Clean imports'), value: '2' },
          { name: chalk.gray('None') + chalk.gray(' - No alias'), value: '3' }
        ]
      }
    ]);

    aliasStyle = aliasChoice === '1' ? '@' : aliasChoice === '2' ? '/' : 'none';
    const aliasSpinner = ora({
      text: chalk.cyan('Configuring path aliases...'),
      color: 'cyan'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));
    aliasSpinner.succeed(chalk.green(`Path alias style set to: ${aliasStyle === 'none' ? 'None' : aliasStyle}`));
    console.log();

    const { packageChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'packageChoice',
        message: 'Select your package manager:',
        choices: [
          { name: chalk.yellow('Bun') + chalk.gray(' - Lightning fast'), value: '1' },
          { name: chalk.red('npm') + chalk.gray(' - Standard'), value: '2' }
        ]
      }
    ]);

    packageManager = packageChoice === '1' ? 'bun' : 'npm';
    const pkgSpinner = ora({
      text: chalk.yellow('Selecting package manager...'),
      color: 'yellow'
    }).start();
    await new Promise(resolve => setTimeout(resolve, 500));
    pkgSpinner.succeed(chalk.green(`${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)} selected!`));
    console.log();
  }

  const { databaseChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'databaseChoice',
      message: 'Select your database:',
      choices: [
        { name: chalk.yellow('SQL (MySQL)') + chalk.gray(' - Popular relational'), value: '1' },
        { name: chalk.cyan('SQLite') + chalk.gray(' - Lightweight file-based'), value: '2' },
        { name: chalk.green('MongoDB') + chalk.gray(' - Flexible NoSQL'), value: '3' },
        { name: chalk.green('Supabase') + chalk.gray(' - Open-source Firebase'), value: '4' },
        { name: chalk.gray('None') + chalk.gray(' - No database'), value: '5' }
      ]
    }
  ]);

  const databaseMap = { '1': 'sql', '2': 'sqlite', '3': 'mongodb', '4': 'supabase', '5': 'none' };
  const database = databaseMap[databaseChoice];
  const dbSpinner = ora({
    text: chalk.green('Configuring database...'),
    color: 'green'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 600));
  dbSpinner.succeed(chalk.green(`Database set to: ${database.charAt(0).toUpperCase() + database.slice(1)}`));
  console.log();

  const { storageChoice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'storageChoice',
      message: 'Select your storage:',
      choices: [
        { name: chalk.blue('Cloudinary') + chalk.gray(' - Cloud image storage'), value: '1' },
        { name: chalk.gray('None') + chalk.gray(' - No storage'), value: '2' }
      ]
    }
  ]);

  const storage = storageChoice === '1' ? 'cloudinary' : 'none';
  const storageSpinner = ora({
    text: chalk.blue('Configuring storage...'),
    color: 'blue'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 500));
  storageSpinner.succeed(chalk.green(`Storage set to: ${storage.charAt(0).toUpperCase() + storage.slice(1)}`));
  console.log();

  await createExpressProject({
    projectName,
    projectPath,
    language,
    aliasStyle,
    database,
    storage,
    packageManager,
    installExpress
  });
}

async function createBasicProject(projectName, projectPath) {
  console.log();
  console.log('Creating basic project folder...');

  await fs.ensureDir(projectPath);

  console.log(chalk.green('Project folder created successfully!'));
  console.log();
}

async function createExpressProject(config) {
  const { projectName, projectPath, language, aliasStyle, database, storage, packageManager, installExpress } = config;

  showExpressProjectHeader();

  const spinner = ora({
    text: chalk.cyan.bold('⚡ Creating project structure...'),
    color: 'cyan',
    spinner: 'dots'
  }).start();

  try {
    // Create directories
    await createProjectFolders(projectPath);

    spinner.succeed(chalk.green.bold('✓ Project structure created'));

    // Initialize package.json
    spinner.text = chalk.yellow.bold('⚙️  Initializing package.json...');
    spinner.color = 'yellow';
    spinner.start();

    const initCommand = packageManager === 'bun' ? 'bun init -y' : 'npm init -y';
    execSync(initCommand, { cwd: projectPath, stdio: 'inherit' });

    spinner.succeed(chalk.green.bold('✓ Package.json initialized'));

    if (installExpress) {
      // Install core dependencies
      spinner.text = chalk.magenta.bold('📦 Installing Express, dotenv, and nodemon...');
      spinner.color = 'magenta';
      spinner.start();

      const installCmd = packageManager === 'bun' ? 'bun add' : 'npm install';
      const devCmd = packageManager === 'bun' ? 'bun add -d' : 'npm install -D';

      execSync(`${installCmd} express dotenv`, { cwd: projectPath, stdio: 'inherit' });
      execSync(`${devCmd} nodemon`, { cwd: projectPath, stdio: 'inherit' });

      spinner.succeed(chalk.green.bold('✓ Core dependencies installed'));

      // Install language-specific packages
      if (language === 'javascript' && (aliasStyle === '@' || aliasStyle === '/')) {
        spinner.text = chalk.blue.bold('🔗 Installing module-alias for path aliases...');
        spinner.color = 'blue';
        spinner.start();
        execSync(`${installCmd} module-alias`, { cwd: projectPath, stdio: 'inherit' });
        spinner.succeed(chalk.green.bold('✓ Module-alias installed'));
      }

      if (language === 'typescript') {
        spinner.text = chalk.blue.bold('📘 Installing TypeScript packages...');
        spinner.color = 'blue';
        spinner.start();
        execSync(`${devCmd} typescript tsx @types/node @types/express`, { cwd: projectPath, stdio: 'inherit' });
        spinner.succeed(chalk.green.bold('✓ TypeScript packages installed'));
      }

      // Install database packages
      await installDatabasePackages(projectPath, database, packageManager, spinner, language);

      // Install storage packages
      await installStoragePackages(projectPath, storage, packageManager, spinner, language);

      // Install additional packages
      spinner.text = chalk.magenta.bold('🔒 Installing cors, bcrypt, and jsonwebtoken...');
      spinner.color = 'magenta';
      spinner.start();
      execSync(`${installCmd} cors bcrypt jsonwebtoken`, { cwd: projectPath, stdio: 'inherit' });
      
      // Install @types for additional packages if TypeScript
      if (language === 'typescript') {
        execSync(`${devCmd} @types/cors @types/bcrypt @types/jsonwebtoken`, { cwd: projectPath, stdio: 'inherit' });
      }
      spinner.succeed(chalk.green.bold('✓ Additional packages installed'));
    }

    // Update package.json scripts
    await updatePackageJson(projectPath, language, packageManager, aliasStyle);

    // Create environment files
    await createEnvFiles(projectPath, database, storage);

    // Create .gitignore
    await createGitignore(projectPath);

    // Initialize git repository
    await initializeGitRepository(projectPath, spinner);

    // Create nodemon.json
    await createNodemonJson(projectPath, language);

    // Create project files
    await createProjectFiles(projectPath, language, database, storage, aliasStyle);

    // Create template file with start page
    if (installExpress) {
      await createTemplatesFolder(projectPath);
      await createTemplateFile(projectPath, language, aliasStyle);
    }

    // Create main server file
    await createServerFile(projectPath, language, aliasStyle, installExpress);

    // Create tsconfig.json for TypeScript
    if (language === 'typescript') {
      await createTsConfig(projectPath, aliasStyle);
    }

    spinner.succeed(chalk.green.bold('🎉 Project created successfully!'));

    // Generate README.md with project structure
    await generateReadme(projectPath, projectName, language, database, storage, packageManager, installExpress);

    showProjectCreatedHeader();
    console.log(`Project Name: ${projectName}`);
    console.log(`Language: ${language}`);
    console.log(`Database: ${database}`);
    console.log(`Storage: ${storage}`);

    // Calculate and display folder size
    const folderSize = await getFolderSize(projectPath);
    const formattedSize = formatSize(folderSize);
    console.log(`Project Folder Size: ${formattedSize}`);
    
    if (installExpress) {
      console.log(`Package Manager: ${packageManager}`);
      console.log();
      console.log('Included packages: cors, bcrypt, jsonwebtoken');
      console.log();
      console.log('Open the project:');
      console.log(chalk.cyan(`cd ${projectName}`));
      console.log();
      console.log('Start development mode:');
      console.log(chalk.cyan(`${packageManager} run dev`));
      console.log();
      console.log('Open in your browser:');
      console.log(chalk.cyan('http://localhost:3000'));
      console.log();

      // Ask if user wants to start the server now
      const { startNow } = await inquirer.prompt([
        {
          type: 'list',
          name: 'startNow',
          message: 'Do you want to start the server now?',
          choices: [
            { name: chalk.green('Yes'), value: true },
            { name: chalk.red('No'), value: false }
          ],
          default: 0
        }
      ]);

      if (startNow) {
        await startServerWithBrowser(projectPath, packageManager);
      } else {
        console.log();
        console.log(chalk.cyan('To change to the project directory, run:'));
        console.log(chalk.green(`cd ${projectName}`));
        console.log();
      }
    } else {
      console.log();
      console.log('Project structure created with folders and files.');
      console.log('No packages were installed.');
      console.log();
      console.log('Open the project:');
      console.log(chalk.cyan(`cd ${projectName}`));
    }
    console.log();

  } catch (error) {
    spinner.fail(chalk.red.bold('✗ Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}

async function installDatabasePackages(projectPath, database, packageManager, spinner, language) {
  const installCmd = packageManager === 'bun' ? 'bun add' : 'npm install';
  const devCmd = packageManager === 'bun' ? 'bun add -d' : 'npm install -D';

  if (database === 'sql') {
    spinner.text = chalk.yellow.bold('🗄️  Installing MySQL package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} mysql2`, { cwd: projectPath, stdio: 'inherit' });
    if (language === 'typescript') {
      execSync(`${devCmd} @types/mysql2`, { cwd: projectPath, stdio: 'inherit' });
    }
    spinner.succeed(chalk.green.bold('✓ MySQL package installed'));
  } else if (database === 'sqlite') {
    spinner.text = chalk.yellow.bold('🗄️  Installing SQLite package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} better-sqlite3`, { cwd: projectPath, stdio: 'inherit' });
    if (language === 'typescript') {
      execSync(`${devCmd} @types/better-sqlite3`, { cwd: projectPath, stdio: 'inherit' });
    }
    spinner.succeed(chalk.green.bold('✓ SQLite package installed'));
  } else if (database === 'mongodb') {
    spinner.text = chalk.yellow.bold('🗄️  Installing MongoDB package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} mongoose`, { cwd: projectPath, stdio: 'inherit' });
    if (language === 'typescript') {
      execSync(`${devCmd} @types/mongoose`, { cwd: projectPath, stdio: 'inherit' });
    }
    spinner.succeed(chalk.green.bold('✓ MongoDB package installed'));
  } else if (database === 'supabase') {
    spinner.text = chalk.yellow.bold('🗄️  Installing Supabase package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} @supabase/supabase-js`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ Supabase package installed'));
  }
}

async function installStoragePackages(projectPath, storage, packageManager, spinner, language) {
  const installCmd = packageManager === 'bun' ? 'bun add' : 'npm install';
  const devCmd = packageManager === 'bun' ? 'bun add -d' : 'npm install -D';

  if (storage === 'cloudinary') {
    spinner.text = chalk.blue.bold('☁️  Installing Cloudinary packages...');
    spinner.color = 'blue';
    spinner.start();
    execSync(`${installCmd} cloudinary multer`, { cwd: projectPath, stdio: 'inherit' });
    if (language === 'typescript') {
      execSync(`${devCmd} @types/multer`, { cwd: projectPath, stdio: 'inherit' });
    }
    spinner.succeed(chalk.green.bold('✓ Cloudinary packages installed'));
  }
}




async function getDirectoryTree(dirPath, prefix = '', excludeDirs = ['node_modules', '.git']) {
  try {
    const items = await fs.readdir(dirPath);
    const filteredItems = items.filter(item => !excludeDirs.includes(item));
    
    let tree = '';
    
    for (let i = 0; i < filteredItems.length; i++) {
      const item = filteredItems[i];
      const itemPath = path.join(dirPath, item);
      
      try {
        const stats = await fs.stat(itemPath);
        const isDirectory = stats.isDirectory();
        const isLastItem = i === filteredItems.length - 1;
        
        const connector = isLastItem ? '└── ' : '├── ';
        tree += prefix + connector + item + '\n';
        
        if (isDirectory) {
          const newPrefix = prefix + (isLastItem ? '    ' : '│   ');
          tree += await getDirectoryTree(itemPath, newPrefix, excludeDirs);
        }
      } catch (statError) {
        // Skip files that can't be accessed
        continue;
      }
    }
    
    return tree;
  } catch (readError) {
    // Return empty string if directory can't be read
    return '';
  }
}

async function getFolderSize(dirPath) {
  let totalSize = 0;

  async function calculateSize(currentPath) {
    try {
      const items = await fs.readdir(currentPath);
      
      for (const item of items) {
        const itemPath = path.join(currentPath, item);
        
        try {
          const stats = await fs.stat(itemPath);
          
          if (stats.isDirectory()) {
            await calculateSize(itemPath);
          } else {
            totalSize += stats.size;
          }
        } catch (statError) {
          // Skip files that can't be accessed
          continue;
        }
      }
    } catch (readError) {
      // Skip directories that can't be read
      return;
    }
  }

  await calculateSize(dirPath);
  return totalSize;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function generateReadme(projectPath, projectName, language, database, storage, packageManager, installExpress) {
  const treeStructure = await getDirectoryTree(projectPath);
  
  const readmeContent = `# ${projectName}

## Project Structure

\`\`\`
${treeStructure}
\`\`\`

## Project Details

- **Language**: ${language.charAt(0).toUpperCase() + language.slice(1)}
- **Database**: ${database.charAt(0).toUpperCase() + database.slice(1)}
- **Storage**: ${storage.charAt(0).toUpperCase() + storage.slice(1)}
${installExpress ? `- **Package Manager**: ${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)}
- **Express**: Installed` : `- **Express**: Not installed`}

## Getting Started

${installExpress ? `### Installation

Dependencies are already installed.

### Running the Project

\`\`\`bash
${packageManager} run dev
\`\`\`

The server will start on \`http://localhost:3000\`.` : `### Installation

\`\`\`bash
npm install
\`\`\`

### Running the Project

\`\`\`bash
node index.js
\`\`\``}

## Project Structure Overview

This project includes the following directories:

- **config**: Configuration files for database, JWT, and other services
- **models**: Database models and schemas
- **middleware**: Custom middleware functions
- **controllers**: Business logic and request handlers
- **routes**: API route definitions
${installExpress ? `- **templates**: Template files for views` : ''}

## License

MIT
`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}

async function startServerWithBrowser(projectPath, packageManager) {
  showStartingServerHeader();

  const runCommand = packageManager === 'bun' ? 'bun run dev' : 'npm run dev';
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
    });

  } catch (error) {
    console.log();
    console.log('Server stopped.');
  }
}

module.exports = {
  createNewProject,
  createBasicProject,
  createExpressProject,
  installDatabasePackages,
  installStoragePackages,
  getDirectoryTree,
  getFolderSize,
  formatSize,
  generateReadme,
  startServerWithBrowser
};
