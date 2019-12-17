import { Context } from 'koa';

export class AuthController {
  public authenticate(ctx: Context) {
    ctx.throw(501);
  }

  public getAuthenticated(ctx: Context) {
    ctx.throw(501);
  }
}

export default new AuthController();
