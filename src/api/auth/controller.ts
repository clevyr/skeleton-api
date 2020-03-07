import { Context } from 'koa';

import { Logger } from '../../utils/logger';
import authService from './service';
import { setAuthCookie } from './utils';

export class AuthController {
  private logger = new Logger('AuthController');

  async login(ctx: Context) {
    this.logger.verbose('login(', ctx.request.body, ')');

    const user = await authService.login({
      input: ctx.request.body,
    });

    setAuthCookie(ctx, user);

    return ctx.success({ data: user });
  }

  getAuthenticated(ctx: Context) {
    this.logger.verbose('getAuthenticated()');

    const user = authService.getAuthenticated({
      auth: ctx.state.auth,
    });

    return ctx.success({ data: user });
  }

  logout(ctx: Context) {
    this.logger.verbose('logout()');

    ctx.cookies.set('auth-cookie');

    return ctx.success();
  }
}

export default new AuthController();
