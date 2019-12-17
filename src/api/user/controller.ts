import { Context } from 'koa';

export class UserController {
  public getUsers(ctx: Context) {
    ctx.throw(501);
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
