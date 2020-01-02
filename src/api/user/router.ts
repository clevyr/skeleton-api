import Router from '@koa/router';
import userController from './controller';
import isAuth from '../../middleware/isAuth';

export class UserRouter {
  public router: Router = new Router({ prefix: '/users' });

  constructor() {
    this.router
      .get(
        '/',
        isAuth,
        userController.listUsers.bind(userController)
      )
      .post(
        '/',
        userController.createUser.bind(userController)
      )
      .get(
        '/:userId',
        isAuth,
        userController.getUser.bind(userController)
      )
      .put(
        '/:userId',
        isAuth,
        userController.updateUser.bind(userController)
      )
      .delete(
        '/:userId',
        isAuth,
        userController.deleteUser.bind(userController)
      );
  }
}

export default new UserRouter();
