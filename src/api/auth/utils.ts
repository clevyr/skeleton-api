import * as bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

import { User } from '../user/model';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function createAuthToken(user: User): string {
  return jwt.sign({ id: user.id }, config.get('jwtSecret'), {
    expiresIn: '1d',
  });
}
