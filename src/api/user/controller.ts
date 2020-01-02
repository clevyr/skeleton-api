import { Context } from 'koa';

import userModel from './model';
import { serializeUser } from './utils';
import { Logger } from '../../utils/logger';

export class UserController {
  private logger = new Logger('UserController');

  public async listUsers(ctx: Context) {
    this.logger.verbose('listUsers()');
    const users = await userModel.listUsers();
    const serializedUsers = users.map(serializeUser);

    return ctx.success({ data: serializedUsers });
  }

  public createUser(ctx: Context) {
    ctx.throw(501);
  }

  public getUser(ctx: Context) {
    ctx.throw(501);
  }

  public updateUser(ctx: Context) {
    ctx.throw(501);
  }

  public deleteUser(ctx: Context) {
    ctx.throw(501);
  }
}

export default new UserController();
