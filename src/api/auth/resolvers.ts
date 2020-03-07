import isAuth from '../../middleware/isAuth';
import { Logger } from '../../utils/logger';
import authService from './service';
import { LoginInput } from './types';
import { setAuthCookie } from './utils';

const logger = new Logger('AuthResolvers');

export default {
  Query: {
    getAuthenticated: async (_: any, args: any, request: any) => {
      logger.verbose('getAuthenticated()');

      await isAuth(request.ctx);

      const user = authService.getAuthenticated({
        auth: request.ctx.state.auth,
      });

      return user;
    },
  },

  Mutation: {
    login: async (_: any, { loginInput }: { loginInput: LoginInput }, request: any) => {
      logger.verbose('login(', loginInput, ')');

      const user = await authService.login({
        input: loginInput,
      });

      setAuthCookie(request.ctx, user);

      return user;
    },

    logout: async (_: any, args: any, request: any) => {
      logger.verbose('logout()');

      await isAuth(request.ctx);

      request.ctx.cookies.set('auth-cookie');
    }
  }
};
