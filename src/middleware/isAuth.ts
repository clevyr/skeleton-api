import config from 'config';
import { verify } from 'jsonwebtoken';
import { Context as Ctx } from 'koa';

import { setAuthCookie } from '../api/auth/utils';
import userModel from '../api/user/model';
import { ErrorCode, UnauthorizedError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

function getToken(ctx: Ctx) {
  // Header takes priority over cookie
  if (ctx.request.header.authorization) {
    const header = ctx.request.header.authorization;

    const parts = header.split(' ');
    if (parts.length !== 2) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme)) throw new UnauthorizedError({ errorCode: ErrorCode.E_40102 });

    return token;
  } else if (!!ctx.cookies.get('auth-cookie')) {
    return ctx.cookies.get('auth-cookie');
  }

  throw new UnauthorizedError({ errorCode: ErrorCode.E_40101 });
}

export default async function isAuth(ctx: Ctx, next?: Function) {
  logger.verbose('isAuth()');
  const token = getToken(ctx);
  let decoded: { sub: string };

  try {
    decoded = verify(token, config.get('jwtSecret')) as { sub: string };
  } catch (error) {
    throw new UnauthorizedError({ errorCode: ErrorCode.E_40103 });
  }

  const user = await userModel.getUser(decoded.sub);
  if (!user) throw new UnauthorizedError({ errorCode: ErrorCode.E_40104 });

  ctx.state.auth = user;

  // Refresh cookie
  if (!!ctx.cookies.get('auth-cookie')) {
    setAuthCookie(ctx, user);
  }

  return next ? next() : Promise.resolve();
}
