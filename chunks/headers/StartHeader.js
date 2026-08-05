const chalk = require('chalk');

function showStartHeader() {
  console.clear();
  console.log();
  console.log(chalk.cyan('========================================='));
  console.log('\x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;96;40m▀\x1b[0;36;40m█▀▀\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▄\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀▄\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;96;40m▀\x1b[0;36;40m█▀▀\x1b[0m');
  console.log('\x1b[0;96;40m▀\x1b[0;36;40m▀▀▀█\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m█\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀▀█\x1b[0;37;40m \x1b[0;36;40m█▀▀▀▄\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m█\x1b[0;96;40m  \x1b[0m');
  console.log('\x1b[0;96;40m▀\x1b[0;36;40m▀▀▀\x1b[0;96;40m \x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m▀\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m▀\x1b[0;96;40m  \x1b[0m');
  console.log(chalk.cyan('========================================='));
  console.log();
}

function showExecutingCommandHeader() {
  console.log();
  console.log('=========================================');
  console.log('      EXECUTING COMMAND');
  console.log('=========================================');
  console.log();
}

module.exports = { showStartHeader, showExecutingCommandHeader };