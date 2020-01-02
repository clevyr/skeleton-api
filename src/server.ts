import Koa from 'koa';
import config from 'config';
import cors from '@koa/cors';
import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';

import apiRouter from './api/router';
import httpLogger from './middleware/httpLogger';
import handleError from './middleware/handleError';
import jsend from './middleware/jsend';
import logger from './utils/logger';

export class Server {
  koa: Koa = new Koa();

  constructor() {
    this.initializeMiddleware();

    this.koa.use(apiRouter.router.routes());
  }

  public async start(): Promise<void> {
    const port: number = config.get('port');
    const env: string = config.get('env');
    await new Promise((resolve) => this.koa.listen(port, resolve));

    logger.info(`Server started for ${env} on port ${port}`);
  }

  private initializeMiddleware() {
    this.koa
      .use(httpLogger)
      .use(handleError)
      .use(jsend)
      .use(helmet())
      .use(cors())
      .use(bodyParser())
      .use(compress())
      .use(conditional())
      .use(etag());
  }
}

export default new Server();
