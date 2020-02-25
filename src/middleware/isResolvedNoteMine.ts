import { Context as Ctx } from 'koa';

import { BaseError, ErrorCode, UnauthorizedError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

export default async function isResolvedNoteMine(ctx: Ctx, next?: Function) {
  logger.verbose('isResolvedNoteMine()');
  if (!ctx.state.note) throw new BaseError({ errorCode: ErrorCode.E_50003, message: 'Note not resolved, ensure resolveNote middleware is first' });
  if (!ctx.state.auth) throw new BaseError({ errorCode: ErrorCode.E_50004, message: 'Not authenticated, ensure isAuth middleware is first' });
  if (ctx.state.note.authorId !== ctx.state.auth.id) throw new UnauthorizedError({ errorCode: ErrorCode.E_40106 });

  return next ? next() : Promise.resolve();
}
