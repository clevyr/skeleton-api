module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    database: 'skeletontest',
  },
  logLevels: {
    default: 'error',
    HTTP: 'error',
    Database: 'error',
  },
};
