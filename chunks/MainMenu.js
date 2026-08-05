const inquirer = require('inquirer');
const chalk = require('chalk');
const { createNewProject } = require('./CreateProject');
const { startProject } = require('./StartProject');
const { showCredits } = require('./Credits');
const { exitApp } = require('./exit');
const { showMainHeader } = require('./headers/MainHeader');

async function mainMenu(cliConfig) {
  // If CLI arguments are provided, handle accordingly
  if (cliConfig && cliConfig.command === 'start') {
    await startProject(cliConfig, mainMenu);
    return;
  }
  
  if (cliConfig && cliConfig.command === 'create') {
    await createNewProject(cliConfig);
    return;
  }

  showMainHeader();

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'Select an option:',
      choices: [
        { name: chalk.cyan('Create new project') + chalk.gray(' - Generate a new Express project'), value: '1' },
        { name: chalk.cyan('Start a project') + chalk.gray(' - Run an existing project'), value: '2' },
        { name: chalk.cyan('Credits') + chalk.gray(' - View creator info'), value: '3' },
        { name: chalk.cyan('Exit') + chalk.gray(' - Close the application'), value: '4' }
      ]
    }
  ]);

  switch (choice) {
    case '1':
      await createNewProject();
      break;
    case '2':
      await startProject({}, mainMenu);
      break;
    case '3':
      await showCredits(mainMenu);
      break;
    case '4':
      exitApp();
  }
}

module.exports = {
  mainMenu
};
