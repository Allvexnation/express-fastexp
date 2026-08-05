const chalk = require('chalk');

function showMainHeader() {
  console.log(chalk.cyan('========================================='));
  console.log('\x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▄\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀\x1b[0;37;40m \x1b[0;97;40m▀\x1b[0;96;40m▀\x1b[0;36;40m█▀▀\x1b[0;37;40m \x1b[0;97;40m▄▀\x1b[0;96;40m▀\x1b[0;36;40m▀█\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m   \x1b[0;36;47m▄\x1b[0;37;40m \x1b[0;97;47m▀\x1b[0;96;40m▀\x1b[0;36;40m▀▀▄\x1b[0m');
  console.log('\x1b[0;36;47m▄\x1b[0;36;40m▀▀\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀▀█\x1b[0;37;40m \x1b[0;96;40m▀\x1b[0;36;40m▀▀▀█\x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m█\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;36;47m▄\x1b[0;36;40m▀▀\x1b[0;96;40m ▄\x1b[0;37;40m \x1b[0;36;40m▄▀▀▀▄\x1b[0;37;40m \x1b[0;36;40m█▀▀▀\x1b[0;96;40m \x1b[0m');
  console.log('\x1b[0;36;40m▀\x1b[0;96;40m    \x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;96;40m▀\x1b[0;36;40m▀▀▀\x1b[0;96;40m \x1b[0;37;40m \x1b[0;96;40m  \x1b[0;36;40m▀\x1b[0;96;40m  \x1b[0;37;40m \x1b[0;96;40m \x1b[0;36;40m▀▀▀▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m   \x1b[0;36;40m▀\x1b[0;37;40m \x1b[0;36;40m▀\x1b[0;96;40m    \x1b[0m');
  console.log(chalk.green('  Created by Jhon Ladines'));
  console.log(chalk.cyan('========================================='));
  console.log();
}

module.exports = { showMainHeader };