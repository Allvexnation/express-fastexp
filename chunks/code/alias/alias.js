const fs = require('fs-extra');
const path = require('path');

async function updatePackageJson(projectPath, language, packageManager, aliasStyle) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const pkg = await fs.readJson(packageJsonPath);

  if (language === 'javascript') {
    pkg.scripts = {
      dev: 'nodemon',
      start: packageManager === 'bun' ? 'bun index.js' : 'node index.js'
    };

    if (aliasStyle === '@') {
      pkg._moduleAliases = { '@': '.' };
      delete pkg.type;
    } else if (aliasStyle === '/') {
      pkg._moduleAliases = { '/': '.' };
      delete pkg.type;
    }
  } else {
    pkg.scripts = {
      dev: 'nodemon',
      start: 'tsx index.ts',
      build: 'tsc'
    };
  }

  await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
}

async function createTsConfig(projectPath, aliasStyle) {
  let compilerOptions = {
    target: 'ES2020',
    module: 'CommonJS',
    moduleResolution: 'Node',
    esModuleInterop: true,
    strict: true,
    skipLibCheck: true,
    outDir: './dist',
    baseUrl: '.'
  };

  if (aliasStyle === '@') {
    compilerOptions.paths = {
      '@/*': ['./*']
    };
  } else if (aliasStyle === '/') {
    compilerOptions.paths = {
      '/*': ['./*']
    };
  }

  const tsConfig = {
    compilerOptions,
    include: ['**/*.ts'],
    exclude: ['node_modules', 'dist']
  };

  await fs.writeFile(path.join(projectPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));
}

module.exports = {
  updatePackageJson,
  createTsConfig
};
