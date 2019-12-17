import Router from 'koa-router';
import userController from './controller';

export class UserRouter {
  public router: Router = new Router({ prefix: '/users' });

  constructor() {
    this.router
      .get(   '/',        userController.getUsers.bind(userController))
      .post(  '/',        userController.createUser.bind(userController))
      .get(   '/:userId', userController.getUser.bind(userController))
      .put(   '/:userId', userController.updateUser.bind(userController))
      .delete('/:userId', userController.deleteUser.bind(userController));
  }
}

export default new UserRouter();
