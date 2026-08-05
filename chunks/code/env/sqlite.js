const sqliteEnvTemplate = () => {
  return 'SQLITE_PATH=./database.sqlite\n';
};

module.exports = {
  sqliteEnvTemplate
};
