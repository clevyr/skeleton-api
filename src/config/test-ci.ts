
module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    host: '127.0.0.1',
    user: 'user',
    password: 'password',
    database: 'skeletontest',
  },
  logLevels: {
    default: 'error',
    HTTP: 'error',
    Database: 'error',
  },
};
