import Router from '@koa/router';

import resolveNote from '../middleware/resolveNote';
import resolveUser from '../middleware/resolveUser';
import authRouter from './auth/router';
import noteRouter from './note/router';
import userRouter from './user/router';

export class ApiRouter {
  public router: Router = new Router();

  constructor() {
    this.router
      .param('userId', resolveUser)
      .param('noteId', resolveNote)
      .use(authRouter.router.routes())
      .use(userRouter.router.routes())
      .use(noteRouter.router.routes());
  }
}

export default new ApiRouter();
