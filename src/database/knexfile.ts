import chalk from 'chalk';
import config from 'config';
import { pick } from 'lodash';
import { resolve } from 'path';

import { Logger } from './../utils/logger';

const logger = new Logger(chalk.cyan('Database'));

const knexConfig = {
  client: 'mysql2',
  connection: config.get('database'),
  migrations: {
    tableName: 'knex_migrations',
    directory: resolve(__dirname, 'migrations'),
  },
  seeds: {
    directory: resolve(__dirname, 'seeds', config.get('env')),
  },
  log: {
    warn: (message: any) => logger.info(pick(message, ['method', 'bindings', 'sql'])),
    error: (message: any) => logger.error(pick(message, ['method', 'bindings', 'sql'])),
    deprecate: (message: any) => logger.verbose(pick(message, ['method', 'bindings', 'sql'])),
    debug: (message: any) => logger.verbose(pick(message, ['method', 'bindings', 'sql'])),
  },
  debug: config.get('env') === 'development',
};

export default knexConfig;
export {
  knexConfig as development,
  knexConfig as production,
  knexConfig as test,
};
