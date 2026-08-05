const fs = require('fs-extra');
const path = require('path');

async function createGitignore(projectPath) {
  const content = `### Node.js / Express ###
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock
pnpm-lock.yaml

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
out/
.next/
.nuxt/
.vuepress/dist/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS files
.DS_Store
Thumbs.db
*.swp
*.swo
*~

# IDE
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Testing
coverage/
.nyc_output/
*.lcov

# Temporary files
tmp/
temp/
.cache/

# Misc
*.pid
*.seed
*.pid.lock
`;
  await fs.writeFile(path.join(projectPath, '.gitignore'), content);
}

module.exports = {
  createGitignore
};
