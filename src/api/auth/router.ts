import Router from 'koa-router';
import authController from './controller';

export class AuthRouter {
  public router: Router = new Router({ prefix: '/auth' });

  constructor() {
    this.router
      .get( '/', authController.getAuthenticated.bind(authController))
      .post('/', authController.authenticate.bind(authController));
  }
}

export default new AuthRouter();
