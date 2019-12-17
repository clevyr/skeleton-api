import Koa from 'koa';

export class Server {
  koa: Koa = new Koa();

  async start(): Promise<void> {
    await new Promise((resolve) => this.koa.listen(9000, resolve));

    console.log('Listening on 9000');
  }
}

export default new Server();
