import chalk from 'chalk';
import { Context } from 'koa';

import { Logger } from '../utils/logger';

const logger = new Logger(chalk.yellow('HTTP'));

export default async function httpLogger(ctx: Context, next: Function) {
  const { method, originalUrl } = ctx;
  logger.verbose(`--in-> ${method} ${originalUrl}`);

  const start = Date.now();
  await next();
  const { status } = ctx;
  const time = `${Date.now() - start}ms`;

  logger.verbose(`<-out- ${method} ${originalUrl} ${status} ${time}`);
}
