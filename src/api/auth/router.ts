import Router from '@koa/router';

import authController from './controller';
import isAuth from '../../middleware/isAuth';

export class AuthRouter {
  public router: Router = new Router({ prefix: '/auth' });

  constructor() {
    this.router
      .get(
        '/',
        isAuth,
        authController.getAuthenticated.bind(authController)
      )
      .post(
        '/',
        authController.authenticate.bind(authController)
      );
  }
}

export default new AuthRouter();
