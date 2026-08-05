const mysqlEnvTemplate = () => {
  return 'DB_HOST=localhost\nDB_PORT=3306\nDB_NAME=your_database\nDB_USER=root\nDB_PASSWORD=\n';
};

module.exports = {
  mysqlEnvTemplate
};
