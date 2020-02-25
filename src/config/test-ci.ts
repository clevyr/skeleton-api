module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    port: process.env.DB_PORT || 3306,
    user: 'user',
    password: 'password',
    database: 'skeletontest',
  },
  logLevels: {
    default: 'silent',
    HTTP: 'silent',
    Database: 'silent',
  },
};
