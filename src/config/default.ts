module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 9000,
  jwtSecret: 'Configure locally',
  exposeErrors: true,

  database: {
    host: 'localhost',
    port: 3306,
    user: 'Configure locally',
    password: 'Configure locally',
    database: 'skeleton',
  },

  logLevels: {
    default: 'verbose',
    HTTP: 'verbose',
    Database: 'verbose',
  },
};
