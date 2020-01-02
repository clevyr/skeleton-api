import Joi from 'joi';
import { Context } from 'koa';

import isAuth from '../../middleware/isAuth';
import { UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from '../user/model';
import { serializeUser } from '../user/utils';
import { comparePassword, createAuthToken } from './utils';

export class AuthController {
  private logger = new Logger('AuthController');

  async authenticate(ctx: Context, next: any) {
    this.logger.verbose('authenticate(', ctx.request.body, ')');
    await this.validateAuthenticate(ctx);

    const { email } = ctx.request.body;
    const user = await userModel.getUserByEmail(email);

    const authToken = createAuthToken(user);
    return ctx.success({ data: authToken });
  }

  async getAuthenticated(ctx: Context) {
    this.logger.verbose('getAuthenticated()');
    await isAuth(ctx);

    const serializedUser = serializeUser(ctx.state.user);

    return ctx.success({ data: serializedUser });
  }

  private async validateAuthenticate(ctx: Context) {
    const { error } = Joi.validate(ctx.request.body, {
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    if (error) throw new UserError({ errorCode: 40003, message: 'Validation Error', data: error });

    const { email, password } = ctx.request.body;

    const user = await userModel.getUserByEmail(email);
    if (!user) throw new UserError({ errorCode: 40004, message: 'Invalid auth credentials' });

    if (!await comparePassword(password, user.password)) {
      throw new UserError({ errorCode: 40005, message: 'Invalid auth credentials' });
    }
  }
}

export default new AuthController();
