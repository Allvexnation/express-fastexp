const { execSync } = require('child_process');
const ora = require('ora');
const chalk = require('chalk');

async function initializeGitRepository(projectPath, spinner) {
  spinner.text = chalk.cyan.bold('🔧 Initializing git repository...');
  spinner.color = 'cyan';
  spinner.start();
  try {
    execSync('git init', { cwd: projectPath, stdio: 'inherit' });
    spinner.succeed(chalk.green.bold('✓ Git repository initialized'));
  } catch (error) {
    spinner.warn(chalk.yellow('Git initialization failed (git may not be installed)'));
  }
}

module.exports = {
  initializeGitRepository
};
