import config from 'config';
import { verify } from 'jsonwebtoken';
import { Context as Ctx } from 'koa';

import userModel from '../api/user/model';
import { UnauthorizedError, ErrorCode } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

function getToken(ctx: Ctx) {
  const header = ctx.request.header.authorization;
  if (!header) throw new UnauthorizedError({ errorCode: ErrorCode.E_40101 });

  const parts = header.split(' ');
  if (parts.length !== 2) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

  return token;
}

export default async function isAuth(ctx: Ctx, next?: Function) {
  logger.verbose('isAuth()');
  const token = getToken(ctx);
  let decoded: { id: string };

  try {
    decoded = verify(token, config.get('jwtSecret')) as { id: string };
  } catch (error) {
    throw new UnauthorizedError({ errorCode: ErrorCode.E_40103 });
  }

  const user = await userModel.getUser(decoded.id);
  if (!user) throw new UnauthorizedError({ errorCode: ErrorCode.E_40104 });

  ctx.state.auth = user;

  return next ? next() : Promise.resolve();
}
