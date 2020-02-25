import Joi from '@hapi/joi';
import { Context } from 'koa';

import { ErrorCode, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from '../user/model';
import { serializeUser } from '../user/utils';
import { comparePassword, setAuthCookie } from './utils';

export class AuthController {
  private logger = new Logger('AuthController');

  async authenticate(ctx: Context) {
    this.logger.verbose('authenticate(', ctx.request.body, ')');
    await this.validateAuthenticate(ctx);

    const { email } = ctx.request.body;
    const user = await userModel.getUserByEmail(email);
    const serializedUser = serializeUser(user);

    setAuthCookie(ctx, user);

    return ctx.success({ data: serializedUser });
  }

  private async validateAuthenticate(ctx: Context) {
    try {
      Joi.assert(ctx.request.body, Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40002, message: 'Validation Error', data: error });
    }

    const { email, password } = ctx.request.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) throw new UserError({ errorCode: ErrorCode.E_40003, message: 'Invalid auth credentials' });

    if (!await comparePassword(password, user.password)) {
      throw new UserError({ errorCode: ErrorCode.E_40004, message: 'Invalid auth credentials' });
    }
  }

  async getAuthenticated(ctx: Context) {
    this.logger.verbose('getAuthenticated()');

    const serializedUser = serializeUser(ctx.state.auth);

    return ctx.success({ data: serializedUser });
  }

  async logout(ctx: Context) {
    this.logger.verbose('logout()');

    ctx.cookies.set('auth-cookie');

    return ctx.success();
  }
}

export default new AuthController();
