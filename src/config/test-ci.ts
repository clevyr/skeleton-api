
module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    user: 'root',
    password: 'password',
    database: 'skeletontest',
  },
  logLevels: {
    default: 'error',
    HTTP: 'error',
    Database: 'error',
  },
};
