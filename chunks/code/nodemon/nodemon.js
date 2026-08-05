const fs = require('fs-extra');
const path = require('path');

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

module.exports = {
  createNodemonJson
};
