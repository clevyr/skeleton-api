import { Context } from 'koa';

import { ErrorCode, NotFoundError, UserError } from '../utils/errors';
import logger from '../utils/logger';

export default async function handleError(ctx: Context, next: Function) {
  try {
    await next();

    if (ctx.status === 404) throw new NotFoundError({ errorCode: ErrorCode.E_40401 });
  } catch (error) {
    if (error instanceof UserError) {
      logger.verbose(error.message, error);
      ctx.fail(error);
    } else {
      logger.error(error.message, error);
      ctx.error(error);
    }
  }
}
