
module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    user: 'root',
    password: '',
    database: 'circle_test',
  },
  logLevels: {
    default: 'error',
    HTTP: 'error',
    Database: 'error',
  },
};
