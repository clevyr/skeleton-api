import Router from '@koa/router';
import authRouter from './auth/router';
import userRouter from './user/router';
import noteRouter from './note/router';
import resolveUser from '../middleware/resolveUser';

export class ApiRouter {
  public router: Router = new Router({ prefix: '/api' });

  constructor() {
    this.router
      .param('userId', resolveUser)
      .use(authRouter.router.routes())
      .use(userRouter.router.routes())
      .use(noteRouter.router.routes());
  }
}

export default new ApiRouter();
