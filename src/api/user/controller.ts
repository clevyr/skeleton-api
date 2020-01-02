import { Context } from 'koa';
import _ from 'lodash';
import Joi from 'joi';

import userModel from './model';
import { serializeUser } from './utils';
import { Logger } from '../../utils/logger';
import { UserError, ErrorCode, ConflictError, UnauthorizedError } from '../../utils/errors';

export class UserController {
  private logger = new Logger('UserController');

  public async listUsers(ctx: Context) {
    this.logger.verbose('listUsers()');
    const users = await userModel.listUsers();
    const serializedUsers = users.map(serializeUser);

    return ctx.success({ data: serializedUsers });
  }

  public async createUser(ctx: Context) {
    this.logger.verbose('createUser(', ctx.request.body, ')');
    await this.validateCreateUser(ctx);

    const payload = _.pick(ctx.request.body, ['name', 'email', 'password']);
    const user = await userModel.createUser(payload);
    const serializedUser = serializeUser(user);

    return ctx.success({ data: serializedUser, httpStatus: 201 });
  }

  private async validateCreateUser(ctx: Context) {
    const { error } = Joi.validate(ctx.request.body, {
      name: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });
    if (error) throw new UserError({ errorCode: ErrorCode.E_40001, message: 'Validation Error', data: error });

    const { email } = ctx.request.body;
    const existingEmail = await userModel.getUserByEmail(email);
    if (existingEmail) throw new ConflictError({ errorCode: ErrorCode.E_40901, message: 'Email already in use' });
  }

  public async getUser(ctx: Context) {
    this.logger.verbose('getUser(', ctx.params.userId, ')');
    await this.validateGetUser(ctx);

    const serializedUser = serializeUser(ctx.state.user);

    return ctx.success({ data: serializedUser });
  }

  private async validateGetUser(ctx: Context) {
    if (ctx.state.user.id !== ctx.state.auth.id) throw new UnauthorizedError({ errorCode: ErrorCode.E_40105 });
  }

  public updateUser(ctx: Context) {
    ctx.throw(501);
  }

  public deleteUser(ctx: Context) {
    ctx.throw(501);
  }
}

export default new UserController();
