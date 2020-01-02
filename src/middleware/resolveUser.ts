import { Context as Ctx } from 'koa';

import userModel from '../api/user/model';
import { NotFoundError, ErrorCode } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

export default async function resolveUser(userId: string, ctx: Ctx, next?: Function) {
  logger.verbose('resolveUser(', userId, ')');
  const user = await userModel.getUser(userId);
  if (!user) throw new NotFoundError({ errorCode: ErrorCode.E_40402, message: 'User not found' });

  ctx.state.user = user;

  return next ? next() : Promise.resolve();
}
