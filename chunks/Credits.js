const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

async function showCredits(mainMenuCallback) {
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
  console.log('\x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀▄\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀▄\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;36;47m▄\x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;96;40m▀\x1b[0;36;40m█▀▀\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀\x1b[0m');
  console.log('\x1b[0;36;47m▄\x1b[0;96;40m   ▄\x1b[0;37;40m \x1b[0;36;40m█▀▀▀▄\x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀\x1b[0;96;40m ▄\x1b[0;37;40m \x1b[0;36;40m█\x1b[0;96;40m   \x1b[0;36;40m█\x1b[0;37;40m \x1b[0;96;40m \x1b[0;36;40m█\x1b[0;96;40m \x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m█\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;96;40m▀\x1b[0;36;40m▀▀▀█\x1b[0m');
  console.log('\x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m \x1b[0;36;40m▀▀▀▀\x1b[0;96;40m \x1b[0;37;40m \x1b[0;36;40m▀▀▀\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m▀\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;96;40m▀\x1b[0;36;40m▀▀▀\x1b[0;96;40m \x1b[0m');
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
  console.log('  Repository: ' + chalk.blue('https://github.com/Allvexnation/express-fastexp'));
  console.log();
  console.log(chalk.cyan('  ========================================'));
  console.log(chalk.green('  Thank you for using Express Instant!'));
  console.log(chalk.cyan('  ========================================'));
  console.log();

  inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]).then(() => {
    if (mainMenuCallback) mainMenuCallback();
  });
}

module.exports = {
  showCredits
};
