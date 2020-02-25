import cors from '@koa/cors';
import config from 'config';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import helmet from 'koa-helmet';

import apiRouter from './api/router';
import handleError from './middleware/handleError';
import httpLogger from './middleware/httpLogger';
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
    this.koa.keys = [config.get('key')];

    this.koa
      .use(httpLogger)
      .use(handleError)
      .use(jsend)
      .use(helmet())
      .use(cors({
        credentials: true,
      }))
      .use(bodyParser())
      .use(compress())
      .use(conditional())
      .use(etag());
  }
}

export default new Server();
