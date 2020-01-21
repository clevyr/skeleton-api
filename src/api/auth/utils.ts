import * as bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';

import { User } from '../user/model';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createAuthToken(user: User): string {
  return jwt.sign({}, config.get('jwtSecret'), {
    expiresIn: config.get('jwtExpiration'),
    subject: user.id,
  });
}

export function setAuthCookie(ctx: Context, user: User) {
  const authToken = createAuthToken(user);

  ctx.cookies.set('auth-cookie', authToken, {
    maxAge: config.get('jwtExpiration'),
    expires: new Date(Date.now() + (config.get('jwtExpiration') as number)),
    // secure: true,
    httpOnly: true,
    overwrite: true,
    // domain: 'http://localhost:3000',
    // sameSite: 'strict',
    signed: true,
  });
}
