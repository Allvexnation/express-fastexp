const fs = require('fs-extra');
const path = require('path');

async function createProjectFolders(projectPath) {
  const dirs = ['config', 'models', 'middleware', 'controllers', 'routes'];
  for (const dir of dirs) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

async function createTemplatesFolder(projectPath) {
  await fs.ensureDir(path.join(projectPath, 'templates'));
}

module.exports = {
  createProjectFolders,
  createTemplatesFolder
};
