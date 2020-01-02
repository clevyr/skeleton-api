import Router from '@koa/router';

import userController from './controller';
import isAuth from '../../middleware/isAuth';
import isResolvedUserMe from '../../middleware/isResolvedUserMe';

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
        isResolvedUserMe,
        userController.getUser.bind(userController)
      )
      .put(
        '/:userId',
        isAuth,
        isResolvedUserMe,
        userController.updateUser.bind(userController)
      )
      .delete(
        '/:userId',
        isAuth,
        isResolvedUserMe,
        userController.deleteUser.bind(userController)
      );
  }
}

export default new UserRouter();
