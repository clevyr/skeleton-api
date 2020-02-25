import Router from '@koa/router';

import isAuth from '../../middleware/isAuth';
import authController from './controller';

export class AuthRouter {
  public router: Router = new Router({ prefix: '/auth' });

  constructor() {
    this.router
      .get(
        '/',
        isAuth,
        authController.getAuthenticated.bind(authController),
      )
      .post(
        '/',
        authController.authenticate.bind(authController),
      )
      .delete(
        '/',
        isAuth,
        authController.logout.bind(authController),
      );
  }
}

export default new AuthRouter();
