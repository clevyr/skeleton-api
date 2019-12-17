import Koa from 'koa';
import apiRouter from './api/router';

export class Server {
  koa: Koa = new Koa();

  constructor() {
    this.koa.use(apiRouter.router.routes());
  }

  public async start(): Promise<void> {
    await new Promise((resolve) => this.koa.listen(9000, resolve));

    console.log('Listening on 9000');
  }
}

export default new Server();
