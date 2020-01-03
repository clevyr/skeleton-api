module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    database: 'skeleton-test',
  },
  logLevels: {
    default: 'error',
    HTTP: 'error',
    Database: 'error',
  },
};
