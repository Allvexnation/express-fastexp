const chalk = require('chalk');

function showCreateHeader() {
  console.clear();
  console.log();
  console.log(chalk.cyan('========================================='));
  console.log('\x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀▄\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▄\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;96;40m▀\x1b[0;36;40m█▀▀\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m     \x1b[0m');
  console.log('\x1b[0;36;47m▄\x1b[0;96;40m   ▄\x1b[0;37;40m \x1b[0;36;40m█▀▀▀▄\x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀\x1b[0;96;40m ▄\x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀▀█\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m█\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀\x1b[0;96;40m ▄\x1b[0;37;40m     \x1b[0m');
  console.log('\x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m▀\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m     \x1b[0m');
  console.log(chalk.cyan('========================================='));
  console.log();
}

function showExpressProjectHeader() {
  console.log();
  console.log('=========================================');
  console.log('Creating your Express project...');
  console.log('=========================================');
  console.log();
}

function showProjectCreatedHeader() {
  console.log();
  console.log('=========================================');
  console.log('      PROJECT CREATED SUCCESSFULLY!');
  console.log('=========================================');
  console.log();
}

function showStartingServerHeader() {
  console.log();
  console.log('=========================================');
  console.log('      STARTING SERVER');
  console.log('=========================================');
  console.log();
}

module.exports = { showCreateHeader, showExpressProjectHeader, showProjectCreatedHeader, showStartingServerHeader };