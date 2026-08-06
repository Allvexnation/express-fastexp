const { execSync } = require('child_process');
const chalk = require('chalk');

function checkForUpdates(packageJson) {
  try {
    const latestVersion = execSync('npm view express-fastexp version', { encoding: 'utf-8' }).trim();
    const currentVersion = packageJson.version;
    
    if (latestVersion !== currentVersion) {
      console.log(chalk.red.bold('\n⚠️  OUTDATED VERSION DETECTED'));
      console.log(chalk.yellow(`\nYour version: ${currentVersion}`));
      console.log(chalk.green(`Latest version: ${latestVersion}`));
      process.exit(1);
    }
  } catch (error) {
    // If version check fails (offline, etc.), allow the CLI to run
    console.log(chalk.yellow('Warning: Could not check for updates. Continuing...\n'));
  }
}

module.exports = { checkForUpdates };
