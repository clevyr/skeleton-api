import { Context as Ctx } from 'koa';

import { UnauthorizedError, ErrorCode, BaseError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

export default async function isResolvedUserMe(ctx: Ctx, next?: Function) {
  logger.verbose('isResolvedUserMe()');
  if (!ctx.state.user) throw new BaseError({ errorCode: ErrorCode.E_50001, message: 'User not resolved, ensure resolveUser middleware is first' });
  if (!ctx.state.auth) throw new BaseError({ errorCode: ErrorCode.E_50002, message: 'Not authenticated, ensure isAuth middleware is first' });
  if (ctx.state.user.id !== ctx.state.auth.id) throw new UnauthorizedError({ errorCode: ErrorCode.E_40105 });

  return next ? next() : Promise.resolve();
}
