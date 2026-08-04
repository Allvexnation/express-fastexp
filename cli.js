#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync, spawn } = require('child_process');
const open = require('open');

const packageJson = require('./package.json');

// Parse command-line arguments
const args = process.argv.slice(2);
const cliConfig = {
  command: null,
  projectName: null,
  language: null,
  projectPath: null,
  packageManager: null,
  runCommand: null
};

// Check if 'start' subcommand is used
if (args[0] === 'start') {
  cliConfig.command = 'start';
  cliConfig.projectPath = args[1] || null;
  
  if (args[2]) {
    const pkgArg = args[2].toLowerCase();
    if (pkgArg === 'bun' || pkgArg === '1') {
      cliConfig.packageManager = 'bun';
    } else if (pkgArg === 'npm' || pkgArg === '2') {
      cliConfig.packageManager = 'npm';
    }
  }
  
  if (args[3]) {
    cliConfig.runCommand = args[3];
  }
} else if (args[0] === 'create') {
  // Handle project creation with 'create' subcommand
  cliConfig.command = 'create';
  cliConfig.projectName = args[1] || null;
  
  if (args[2]) {
    const langArg = args[2].toLowerCase();
    if (langArg === 'ts' || langArg === 'typescript') {
      cliConfig.language = 'typescript';
    } else if (langArg === 'js' || langArg === 'javascript') {
      cliConfig.language = 'javascript';
    }
  }
}

function printHeader() {
  console.log(chalk.cyan('========================================='));
  console.log(chalk.yellow('  EXPRESS INSTANT PROJECT GENERATOR'));
  console.log(chalk.green('  Created by Jhon Ladines'));
  console.log(chalk.cyan('========================================='));
  console.log();
}

async function mainMenu() {
  // If CLI arguments are provided, handle accordingly
  if (cliConfig.command === 'start') {
    await startProject(cliConfig);
    return;
  }
  
  if (cliConfig.command === 'create') {
    await createNewProject(cliConfig);
    return;
  }

  printHeader();
  
  console.log(chalk.cyan('[1] ') + 'Create new project');
  console.log(chalk.cyan('[2] ') + 'Start a project');
  console.log(chalk.cyan('[3] ') + 'Credits');
  console.log(chalk.cyan('[4] ') + 'Exit');
  console.log();

  const { choice } = await inquirer.prompt([
    {
      type: 'input',
      name: 'choice',
      message: 'Enter your choice (1-4):',
      validate: (input) => {
        const valid = ['1', '2', '3', '4'].includes(input);
        return valid || 'Invalid choice. Please select 1-4.';
      }
    }
  ]);

  switch (choice) {
    case '1':
      await createNewProject();
      break;
    case '2':
      await startProject();
      break;
    case '3':
      await showCredits();
      break;
    case '4':
      console.log();
      console.log(chalk.green('Thank you for using Express Instant!'));
      console.log();
      process.exit(0);
  }
}

async function createNewProject(config = {}) {
  const { projectName: cliProjectName, language: cliLanguage } = config;
  
  console.clear();
  console.log();
  console.log(chalk.cyan('========================================='));
  console.log(chalk.yellow('  CREATE NEW PROJECT'));
  console.log(chalk.cyan('========================================='));
  console.log();

  let projectName;
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

  const projectPath = path.join(process.cwd(), projectName);

  if (await fs.pathExists(projectPath)) {
    console.log(chalk.red(`A folder named "${projectName}" already exists.`));
    await mainMenu();
    return;
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
      type: 'confirm',
      name: 'installExpress',
      message: 'Do you want to install Express?',
      default: true
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
    console.log('Select your language:');
    console.log(chalk.yellow('[1] ') + 'JavaScript');
    console.log(chalk.blue('[2] ') + 'TypeScript');
    console.log();
    
    const { languageChoice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'languageChoice',
        message: 'Enter your choice (1 or 2):',
        validate: (input) => {
          const valid = ['1', '2'].includes(input);
          return valid || 'Invalid choice. Please select 1 or 2.';
        }
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
    console.log('Select your path alias style:');
    console.log('[1] @ (e.g., @/controllers, @/models)');
    console.log('[2] / (e.g., /controllers, /models)');
    console.log('[3] None');
    console.log();
    
    const { aliasChoice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'aliasChoice',
        message: 'Enter your choice (1-3):',
        validate: (input) => {
          const valid = ['1', '2', '3'].includes(input);
          return valid || 'Invalid choice. Please select a number from 1 to 3.';
        }
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

    console.log('Select your package manager:');
    console.log(chalk.yellow('[1] ') + 'Bun');
    console.log(chalk.red('[2] ') + 'npm');
    console.log();
    
    const { packageChoice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'packageChoice',
        message: 'Enter your choice (1 or 2):',
        validate: (input) => {
          const valid = ['1', '2'].includes(input);
          return valid || 'Invalid choice. Please select 1 or 2.';
        }
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

  console.log('Select your database:');
  console.log(chalk.yellow('[1] ') + 'SQL (MySQL)');
  console.log(chalk.cyan('[2] ') + 'SQLite');
  console.log(chalk.green('[3] ') + 'MongoDB');
  console.log(chalk.green('[4] ') + 'Supabase');
  console.log(chalk.gray('[5] ') + 'None');
  console.log();
  
  const { databaseChoice } = await inquirer.prompt([
    {
      type: 'input',
      name: 'databaseChoice',
      message: 'Enter your choice (1-5):',
      validate: (input) => {
        const valid = ['1', '2', '3', '4', '5'].includes(input);
        return valid || 'Invalid choice. Please select a number from 1 to 5.';
      }
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

  console.log('Select your storage:');
  console.log(chalk.blue('[1] ') + 'Cloudinary');
  console.log(chalk.gray('[2] ') + 'None');
  console.log();
  
  const { storageChoice } = await inquirer.prompt([
    {
      type: 'input',
      name: 'storageChoice',
      message: 'Enter your choice (1 or 2):',
      validate: (input) => {
        const valid = ['1', '2'].includes(input);
        return valid || 'Invalid choice. Please select 1 or 2.';
      }
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
  await mainMenu();
}

async function createExpressProject(config) {
  const { projectName, projectPath, language, aliasStyle, database, storage, packageManager, installExpress } = config;

  console.log();
  console.log('=========================================');
  console.log('Creating your Express project...');
  console.log('=========================================');
  console.log();

  const spinner = ora({
    text: chalk.cyan.bold('⚡ Creating project structure...'),
    color: 'cyan',
    spinner: 'dots'
  }).start();

  try {
    // Create directories
    const dirs = ['config', 'models', 'middleware', 'controllers', 'routes'];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(projectPath, dir));
    }

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
      await installDatabasePackages(projectPath, database, packageManager, spinner);

      // Install storage packages
      await installStoragePackages(projectPath, storage, packageManager, spinner);

      // Install additional packages
      spinner.text = chalk.magenta.bold('🔒 Installing cors, bcrypt, and jsonwebtoken...');
      spinner.color = 'magenta';
      spinner.start();
      execSync(`${installCmd} cors bcrypt jsonwebtoken`, { cwd: projectPath, stdio: 'inherit' });
      spinner.succeed(chalk.green.bold('✓ Additional packages installed'));
    }

    // Update package.json scripts
    await updatePackageJson(projectPath, language, packageManager, aliasStyle);

    // Create environment files
    await createEnvFiles(projectPath, database, storage);

    // Create .gitignore
    await createGitignore(projectPath);

    // Initialize git repository
    spinner.text = chalk.cyan.bold('🔧 Initializing git repository...');
    spinner.color = 'cyan';
    spinner.start();
    try {
      execSync('git init', { cwd: projectPath, stdio: 'inherit' });
      spinner.succeed(chalk.green.bold('✓ Git repository initialized'));
    } catch (error) {
      spinner.warn(chalk.yellow('Git initialization failed (git may not be installed)'));
    }

    // Create nodemon.json
    await createNodemonJson(projectPath, language);

    // Create project files
    await createProjectFiles(projectPath, language, database, storage, aliasStyle);

    // Create template file with start page
    if (installExpress) {
      await createTemplateFile(projectPath, language, aliasStyle);
    }

    // Create main server file
    await createServerFile(projectPath, language, aliasStyle, installExpress);

    // Create tsconfig.json for TypeScript
    if (language === 'typescript') {
      await createTsConfig(projectPath, aliasStyle);
    }

    spinner.succeed(chalk.green.bold('🎉 Project created successfully!'));

    console.log();
    console.log('=========================================');
    console.log('      PROJECT CREATED SUCCESSFULLY!');
    console.log('=========================================');
    console.log();
    console.log(`Project Name: ${projectName}`);
    console.log(`Language: ${language}`);
    console.log(`Database: ${database}`);
    console.log(`Storage: ${storage}`);
    
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
          type: 'confirm',
          name: 'startNow',
          message: 'Do you want to start the server now?',
          default: true
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

async function updatePackageJson(projectPath, language, packageManager, aliasStyle) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(packageJsonPath);

  if (language === 'javascript') {
    pkg.scripts = {
      dev: 'nodemon',
      start: packageManager === 'bun' ? 'bun index.js' : 'node index.js'
    };

    if (aliasStyle === '@') {
      pkg._moduleAliases = { '@': '.' };
      delete pkg.type;
    } else if (aliasStyle === '/') {
      pkg._moduleAliases = { '/': '.' };
      delete pkg.type;
    }
  } else {
    pkg.scripts = {
      dev: 'nodemon',
      start: 'tsx index.ts',
      build: 'tsc'
    };
  }

  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
}

async function installDatabasePackages(projectPath, database, packageManager, spinner) {
  const installCmd = packageManager === 'bun' ? 'bun add' : 'npm install';

  if (database === 'sql') {
    spinner.text = chalk.yellow.bold('🗄️  Installing MySQL package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} mysql2`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ MySQL package installed'));
  } else if (database === 'sqlite') {
    spinner.text = chalk.yellow.bold('🗄️  Installing SQLite package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} better-sqlite3`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ SQLite package installed'));
  } else if (database === 'mongodb') {
    spinner.text = chalk.yellow.bold('🗄️  Installing MongoDB package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} mongoose`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ MongoDB package installed'));
  } else if (database === 'supabase') {
    spinner.text = chalk.yellow.bold('🗄️  Installing Supabase package...');
    spinner.color = 'yellow';
    spinner.start();
    execSync(`${installCmd} @supabase/supabase-js`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ Supabase package installed'));
  }
}

async function installStoragePackages(projectPath, storage, packageManager, spinner) {
  const installCmd = packageManager === 'bun' ? 'bun add' : 'npm install';

  if (storage === 'cloudinary') {
    spinner.text = chalk.blue.bold('☁️  Installing Cloudinary packages...');
    spinner.color = 'blue';
    spinner.start();
    execSync(`${installCmd} cloudinary multer`, { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ Cloudinary packages installed'));
  }
}

async function createEnvFiles(projectPath, database, storage) {
  let envContent = 'PORT=3000\nNODE_ENV=development\n';
  let envExampleContent = 'PORT=3000\nNODE_ENV=development\n';

  if (database === 'sql') {
    envContent += 'DB_HOST=localhost\nDB_PORT=3306\nDB_NAME=your_database\nDB_USER=root\nDB_PASSWORD=\n';
    envExampleContent += 'DB_HOST=localhost\nDB_PORT=3306\nDB_NAME=your_database\nDB_USER=root\nDB_PASSWORD=\n';
  } else if (database === 'sqlite') {
    envContent += 'SQLITE_PATH=./database.sqlite\n';
    envExampleContent += 'SQLITE_PATH=./database.sqlite\n';
  } else if (database === 'mongodb') {
    envContent += 'MONGODB_URI=mongodb://127.0.0.1:27017/your_database\n';
    envExampleContent += 'MONGODB_URI=mongodb://127.0.0.1:27017/your_database\n';
  } else if (database === 'supabase') {
    envContent += 'SUPABASE_URL=your_supabase_url\nSUPABASE_ANON_KEY=your_supabase_anon_key\n';
    envExampleContent += 'SUPABASE_URL=your_supabase_url\nSUPABASE_ANON_KEY=your_supabase_anon_key\n';
  }

  if (storage === 'cloudinary') {
    envContent += 'CLOUDINARY_CLOUD_NAME=your_cloud_name\nCLOUDINARY_API_KEY=your_api_key\nCLOUDINARY_API_SECRET=your_api_secret\n';
    envExampleContent += 'CLOUDINARY_CLOUD_NAME=your_cloud_name\nCLOUDINARY_API_KEY=your_api_key\nCLOUDINARY_API_SECRET=your_api_secret\n';
  }

  await fs.writeFile(path.join(projectPath, '.env'), envContent);
  await fs.writeFile(path.join(projectPath, '.env.example'), envExampleContent);
}

async function createGitignore(projectPath) {
  const content = `### Node.js / Express ###
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
out/
.next/
.nuxt/
.vuepress/dist/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Testing
coverage/
.nyc_output/
*.lcov

# Temporary files
tmp/
temp/
.cache/

# Misc
*.pid
*.seed
*.pid.lock
`;
  await fs.writeFile(path.join(projectPath, '.gitignore'), content);
}

async function createNodemonJson(projectPath, language) {
  let content;
  if (language === 'typescript') {
    content = JSON.stringify({
      watch: ['.'],
      ext: 'ts,json',
      ignore: ['node_modules', 'dist'],
      exec: 'tsx index.ts',
      delay: '500'
    }, null, 2);
  } else {
    content = JSON.stringify({
      watch: ['.'],
      ext: 'js,json',
      ignore: ['node_modules', 'dist'],
      exec: 'node index.js',
      delay: '500'
    }, null, 2);
  }
  await fs.writeFile(path.join(projectPath, 'nodemon.json'), content);
}

async function createProjectFiles(projectPath, language, database, storage, aliasStyle) {
  const extension = language === 'typescript' ? 'ts' : 'js';

  // Create empty files
  await fs.writeFile(path.join(projectPath, 'controllers', `controller.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'config', `jwt.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'middleware', `middleware.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'routes', `route.${extension}`), '');

  if (database === 'mongodb') {
    await fs.writeFile(path.join(projectPath, 'models', `model.${extension}`), '');
  }

  if (database === 'sql') {
    await fs.writeFile(path.join(projectPath, 'config', `sql.${extension}`), '');
  }

  if (database === 'sqlite') {
    await fs.writeFile(path.join(projectPath, 'config', `sqlite.${extension}`), '');
  }

  if (database === 'mongodb') {
    await fs.writeFile(path.join(projectPath, 'config', `mongodb.${extension}`), '');
  }

  if (database === 'supabase') {
    await fs.writeFile(path.join(projectPath, 'config', `supabase.${extension}`), '');
  }

  if (storage === 'cloudinary') {
    await fs.writeFile(path.join(projectPath, 'config', `cloudinary.${extension}`), '');
  }
}

async function createTemplateFile(projectPath, language, aliasStyle) {
  const extension = language === 'typescript' ? 'ts' : 'js';
  
  // Create templates directory
  await fs.ensureDir(path.join(projectPath, 'templates'));
  
  // Create start.js or start.ts with the HTML template
  const startPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to fastexp</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://fastexp-init.netlify.app/animation.js"></script>
    <link rel="stylesheet" href="https://fastexp-init.netlify.app/animation.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-black text-white min-h-screen">
    <div class="grid-bg"></div>
    <div id="config-message-source" class="hidden">
        <span class="bg-zinc-800 text-gray-300 text-xs px-3 py-1.5 rounded-full">You can configure and remove this in <span class="bg-white text-black px-1.5 py-0.5 rounded font-semibold">index.${extension}</span></span>
    </div>
    <div id="app"></div>
    <script src="https://fastexp-init.netlify.app/script.js"></script>
</body>
</html>`;

  let content;
  if (language === 'typescript') {
    content = `export const startPage = \`${startPage}\`;
`;
  } else {
    content = `module.exports.startPage = \`${startPage}\`;
`;
  }

  await fs.writeFile(path.join(projectPath, 'templates', `start.${extension}`), content);
}

async function createServerFile(projectPath, language, aliasStyle, installExpress) {
  let content;

  // Determine import path based on alias style
  let importPath;
  if (aliasStyle === '@') {
    importPath = `${aliasStyle}/templates/start`;
  } else if (aliasStyle === '/') {
    importPath = `${aliasStyle}templates/start`;
  } else {
    importPath = './templates/start';
  }

  if (language === 'javascript') {
    if (installExpress) {
      if (aliasStyle === '@' || aliasStyle === '/') {
        content = `require("module-alias/register");
require("dotenv").config();

const express = require("express");
const { startPage } = require("${importPath}");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // you can remove this
    res.status(200).send(startPage);
});

app.listen(PORT, () => {
    console.log(\`Server is running at http://localhost:\${PORT}\`);
});
`;
      } else {
        content = `require("dotenv").config();

const express = require("express");
const { startPage } = require("${importPath}");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // you can remove this
    res.status(200).send(startPage);
});

app.listen(PORT, () => {
    console.log(\`Server is running at http://localhost:\${PORT}\`);
});
`;
      }
    } else {
      if (aliasStyle === '@' || aliasStyle === '/') {
        content = `require("module-alias/register");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

console.log("Project structure created successfully!");
console.log(\`Port configured: \${PORT}\`);
console.log("Install Express manually if needed.");
`;
      } else {
        content = `require("dotenv").config();

const PORT = process.env.PORT || 3000;

console.log("Project structure created successfully!");
console.log(\`Port configured: \${PORT}\`);
console.log("Install Express manually if needed.");
`;
      }
    }
  } else {
    if (installExpress) {
      content = `import "dotenv/config";
import express from "express";
import { startPage } from "${importPath}";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // you can remove this
    res.status(200).send(startPage);
});

app.listen(PORT, () => {
    console.log(\`Server is running at http://localhost:\${PORT}\`);
});
`;
    } else {
      content = `import "dotenv/config";

const PORT = Number(process.env.PORT) || 3000;

console.log("Project structure created successfully!");
console.log(\`Port configured: \${PORT}\`);
console.log("Install Express manually if needed.");
`;
    }
  }

  const filename = language === 'typescript' ? 'index.ts' : 'index.js';
  await fs.writeFile(path.join(projectPath, filename), content);
}

async function createTsConfig(projectPath, aliasStyle) {
  let compilerOptions = {
    target: 'ES2020',
    module: 'CommonJS',
    moduleResolution: 'Node',
    esModuleInterop: true,
    strict: true,
    skipLibCheck: true,
    outDir: './dist',
    baseUrl: '.'
  };

  if (aliasStyle === '@') {
    compilerOptions.paths = {
      '@/*': ['./*']
    };
  } else if (aliasStyle === '/') {
    compilerOptions.paths = {
      '/*': ['./*']
    };
  }

  const tsConfig = {
    compilerOptions,
    include: ['**/*.ts'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
}

async function startServerWithBrowser(projectPath, packageManager) {
  console.log();
  console.log('=========================================');
  console.log('      STARTING SERVER');
  console.log('=========================================');
  console.log();

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
      mainMenu();
    });

  } catch (error) {
    console.log();
    console.log('Server stopped.');
    await mainMenu();
  }
}

async function startProject(config = {}) {
  const { projectPath: cliProjectPath, packageManager: cliPackageManager, runCommand: cliRunCommand } = config;
  
  console.clear();
  console.log();
  console.log(chalk.cyan('========================================='));
  console.log(chalk.yellow('  START A PROJECT'));
  console.log(chalk.cyan('========================================='));
  console.log();

  let projectPath;
  if (cliProjectPath) {
    projectPath = cliProjectPath;
    console.log(chalk.green(`Project path: ${projectPath}`));
    console.log();
  } else {
    const result = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: 'Enter the project path:',
        validate: (input) => input.trim() !== '' || 'Project path cannot be empty'
      }
    ]);
    projectPath = result.projectPath;
  }

  const pathSpinner = ora({
    text: chalk.yellow('Validating project path...'),
    color: 'yellow'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!(await fs.pathExists(projectPath))) {
    pathSpinner.fail(chalk.red('Project path does not exist'));
    console.log(chalk.red(`The path "${projectPath}" does not exist.`));
    await mainMenu();
    return;
  }
  pathSpinner.succeed(chalk.green('Project path validated!'));
  console.log();

  let packageManager;
  let runCommand;
  
  if (cliPackageManager && cliRunCommand) {
    packageManager = cliPackageManager;
    runCommand = cliRunCommand;
    console.log(chalk.green(`Package Manager: ${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)}`));
    console.log(chalk.green(`Command: ${runCommand}`));
    console.log();
  } else {
    console.log('Select your package manager:');
    console.log(chalk.cyan('[1] ') + chalk.yellow('Bun'));
    console.log(chalk.cyan('[2] ') + chalk.red('npm'));
    console.log();
    
    const { packageManagerChoice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'packageManagerChoice',
        message: 'Enter your choice (1 or 2):',
        validate: (input) => {
          const valid = ['1', '2'].includes(input);
          return valid || 'Invalid choice. Please select 1 or 2.';
        }
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

  console.log();
  console.log('=========================================');
  console.log('      EXECUTING COMMAND');
  console.log('=========================================');
  console.log();
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
      mainMenu();
    });

  } catch (error) {
    console.log();
    console.log('Server stopped.');
    await mainMenu();
  }
}

async function showCredits() {
  console.clear();
  console.log();
  
  const creditsSpinner = ora({
    text: chalk.magenta('Loading credits...'),
    color: 'magenta'
  }).start();
  await new Promise(resolve => setTimeout(resolve, 600));
  creditsSpinner.succeed(chalk.green('Credits loaded!'));
  console.log();
  
  console.log(chalk.cyan('========================================='));
  console.log(chalk.yellow('              CREDITS'));
  console.log(chalk.cyan('========================================='));
  console.log();
  console.log('  Created by: ' + chalk.green('Jhon Ladines'));
  console.log();
  console.log(chalk.cyan('  ========================================'));
  console.log(chalk.magenta('  EXPRESS INSTANT'));
  console.log(chalk.cyan('  ========================================'));
  console.log();
  console.log(chalk.white('  A powerful tool designed to make backend'));
  console.log(chalk.white('  development easier by automating the'));
  console.log(chalk.white('  creation of Express.js projects.'));
  console.log();
  console.log(chalk.cyan('  Features:'));
  console.log(chalk.gray('    - Auto-generate project structure'));
  console.log(chalk.gray('    - Support for JavaScript & TypeScript'));
  console.log(chalk.gray('    - Multiple database options'));
  console.log(chalk.gray('    - Cloud storage integration'));
  console.log(chalk.gray('    - Path alias configuration'));
  console.log(chalk.gray('    - Pre-configured middleware & auth'));
  console.log();
  console.log(chalk.yellow('  No more manually creating folders,'));
  console.log(chalk.yellow('  files, and packages!'));
  console.log();
  console.log(chalk.cyan('  ========================================'));
  console.log(chalk.magenta('  CONTACT & LINKS'));
  console.log(chalk.cyan('  ========================================'));
  console.log();
  console.log('  Website: ' + chalk.blue('https://www.jhonladines.top/'));
  console.log();
  console.log('  Repository: ' + chalk.blue('https://github.com/Allvexnation/express-instant'));
  console.log();
  console.log(chalk.cyan('  ========================================'));
  console.log(chalk.green('  Thank you for using Express Instant!'));
  console.log(chalk.cyan('  ========================================'));
  console.log();

  inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]).then(() => {
    mainMenu();
  });
}

// Start the CLI
mainMenu().catch(error => {
  console.error(error);
  process.exit(1);
});
