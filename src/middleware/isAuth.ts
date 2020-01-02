import config from 'config';
import { verify } from 'jsonwebtoken';
import { Context as Ctx } from 'koa';

import userModel from '../api/user/model';
import { UnauthorizedError } from '../utils/errors';

function getToken(ctx: Ctx) {
  const header = ctx.request.header.authorization;
  if (!header) throw new UnauthorizedError({ errorCode: 40101 });

  const parts = header.split(' ');
  if (parts.length !== 2) throw new UnauthorizedError({ errorCode: 40102 });

  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) throw new UnauthorizedError({ errorCode: 40102 });

  return token;
}

export default async function isAuth(ctx: Ctx, next?: Function) {
  const token = getToken(ctx);
  let decoded: { id: string };

  try {
    decoded = verify(token, config.get('jwtSecret')) as { id: string };
  } catch (error) {
    throw new UnauthorizedError({ errorCode: 40103 });
  }

  const user = await userModel.getUser(decoded.id);
  if (!user) throw new UnauthorizedError({ errorCode: 40104 });

  ctx.state.user = user;

  return next ? next() : Promise.resolve();
}
