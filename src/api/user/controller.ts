import Joi from '@hapi/joi';
import { Context } from 'koa';
import _ from 'lodash';

import { ConflictError, ErrorCode, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel, { UserStatus } from './model';
import { serializeUser } from './utils';

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

    const createUserInput = _.pick(ctx.request.body, ['name', 'email', 'password']);
    const user = await userModel.createUser(createUserInput);
    const serializedUser = serializeUser(user);

    return ctx.success({ data: serializedUser, httpStatus: 201 });
  }

  private async validateCreateUser(ctx: Context) {
    try {
      Joi.assert(ctx.request.body, Joi.object({
        name: Joi.string(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40001, message: 'Validation Error', data: error });
    }

    const { email } = ctx.request.body;
    const existingEmail = await userModel.getUserByEmail(email);
    if (existingEmail) throw new ConflictError({ errorCode: ErrorCode.E_40901, message: 'Email already in use' });
  }

  public async getUser(ctx: Context) {
    this.logger.verbose('getUser(', ctx.params.userId, ')');

    const serializedUser = serializeUser(ctx.state.user);

    return ctx.success({ data: serializedUser });
  }

  public async updateUser(ctx: Context) {
    this.logger.verbose('updateUser(', ctx.params.userId, ctx.request.body, ')');
    await this.validateUpdateUser(ctx);

    const payload: { name?: string; email?: string; password?: string; status?: UserStatus } = _.pick(ctx.request.body, ['name', 'email', 'password']);
    if (payload.email && payload.email !== ctx.state.user.email) {
      payload.status = UserStatus.PENDING;
    }

    const user = await userModel.updateUser(ctx.params.userId, payload);
    const serializedUser = serializeUser(user);

    return ctx.success({ data: serializedUser });
  }

  private async validateUpdateUser(ctx: Context) {
    try {
      Joi.assert(ctx.request.body, Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(8),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40005, message: 'Validation Error', data: error });
    }

    const { email } = ctx.request.body;
    if (email && email !== ctx.state.user.email) {
      const existingEmail = await userModel.getUserByEmail(email);
      if (existingEmail) throw new ConflictError({ errorCode: ErrorCode.E_40902, message: 'Email already in use' });
    }
  }

  public deleteUser(ctx: Context) {
    this.logger.verbose('deleteUser(', ctx.params.userId, ')');
    ctx.throw(501);
  }
}

export default new UserController();
