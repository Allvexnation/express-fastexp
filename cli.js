#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const { execSync, spawn } = require('child_process');
const open = require('open');
const { mainMenu } = require('./chunks/MainMenu');

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





// Start the CLI
mainMenu(cliConfig).catch(error => {
  console.error(error);
  process.exit(1);
});
