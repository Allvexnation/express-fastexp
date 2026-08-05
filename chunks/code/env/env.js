const fs = require('fs-extra');
const path = require('path');
const { mysqlEnvTemplate } = require('./mysql');
const { sqliteEnvTemplate } = require('./sqlite');
const { mongodbEnvTemplate } = require('./mongodb');
const { supabaseEnvTemplate } = require('./supabase');
const { cloudinaryEnvTemplate } = require('./cloudinary');

async function createEnvFiles(projectPath, database, storage) {
  let envContent = 'PORT=3000\nNODE_ENV=development\n';
  let envExampleContent = 'PORT=3000\nNODE_ENV=development\n';

  if (database === 'sql') {
    const template = mysqlEnvTemplate();
    envContent += template;
    envExampleContent += template;
  } else if (database === 'sqlite') {
    const template = sqliteEnvTemplate();
    envContent += template;
    envExampleContent += template;
  } else if (database === 'mongodb') {
    const template = mongodbEnvTemplate();
    envContent += template;
    envExampleContent += template;
  } else if (database === 'supabase') {
    const template = supabaseEnvTemplate();
    envContent += template;
    envExampleContent += template;
  }

  if (storage === 'cloudinary') {
    const template = cloudinaryEnvTemplate();
    envContent += template;
    envExampleContent += template;
  }

  await fs.writeFile(path.join(projectPath, '.env'), envContent);
  await fs.writeFile(path.join(projectPath, '.env.example'), envExampleContent);
}

module.exports = {
  createEnvFiles
};
