const fs = require('fs-extra');
const path = require('path');

async function createProjectFiles(projectPath, language, database, storage, aliasStyle) {
  const extension = language === 'typescript' ? 'ts' : 'js';

  // Create empty files
  await fs.writeFile(path.join(projectPath, 'controllers', `controller.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'config', `jwt.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'middleware', `middleware.${extension}`), '');
  await fs.writeFile(path.join(projectPath, 'routes', `route.${extension}`), '');

  if (database === 'mongodb') {
    await fs.writeFile(path.join(projectPath, 'models', `model.${extension}`), '');
  }

  if (database === 'sql') {
    await fs.writeFile(path.join(projectPath, 'config', `sql.${extension}`), '');
  }

  if (database === 'sqlite') {
    await fs.writeFile(path.join(projectPath, 'config', `sqlite.${extension}`), '');
  }

  if (database === 'mongodb') {
    await fs.writeFile(path.join(projectPath, 'config', `mongodb.${extension}`), '');
  }

  if (database === 'supabase') {
    await fs.writeFile(path.join(projectPath, 'config', `supabase.${extension}`), '');
  }

  if (storage === 'cloudinary') {
    await fs.writeFile(path.join(projectPath, 'config', `cloudinary.${extension}`), '');
  }
}

async function createTemplateFile(projectPath, language, aliasStyle) {
  const extension = language === 'typescript' ? 'ts' : 'js';
  
  // Read from the template file based on language
  const templatePath = path.join(__dirname, '..', '..', '..', 'code', 'templates', language, `start.${extension}`);
  const content = await fs.readFile(templatePath, 'utf-8');

  await fs.writeFile(path.join(projectPath, 'templates', `start.${extension}`), content);
}

async function createServerFile(projectPath, language, aliasStyle, installExpress) {
  // Determine import path based on alias style
  let importPath;
  if (aliasStyle === '@') {
    importPath = `${aliasStyle}/templates/start`;
  } else if (aliasStyle === '/') {
    importPath = `${aliasStyle}templates/start`;
  } else {
    importPath = './templates/start';
  }

  // Determine which template file to use
  let templateFile;
  if (language === 'javascript') {
    if (installExpress) {
      if (aliasStyle === '@' || aliasStyle === '/') {
        templateFile = 'index.js';
      } else {
        templateFile = 'index-no-alias.js';
      }
    } else {
      if (aliasStyle === '@' || aliasStyle === '/') {
        templateFile = 'index-no-express-alias.js';
      } else {
        templateFile = 'index-no-express-no-alias.js';
      }
    }
  } else {
    if (installExpress) {
      templateFile = 'index.ts';
    } else {
      templateFile = 'index-no-express.ts';
    }
  }

  // Read from the template file
  const templatePath = path.join(__dirname, '..', '..', '..', 'code', 'server', language, templateFile);
  let content = await fs.readFile(templatePath, 'utf-8');

  // Replace the importPath placeholder
  content = content.replace('{{importPath}}', importPath);

  const filename = language === 'typescript' ? 'index.ts' : 'index.js';
  await fs.writeFile(path.join(projectPath, filename), content);
}

module.exports = {
  createProjectFiles,
  createTemplateFile,
  createServerFile
};
