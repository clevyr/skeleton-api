module.exports = {
  env: process.env.NODE_ENV || 'test',
  database: {
    database: 'skeletontest',
  },
  logLevels: {
    default: 'silent',
    HTTP: 'silent',
    Database: 'silent',
  },
};
