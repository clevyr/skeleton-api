import config from 'config';
import { STATUS_CODES } from 'http';
import { Context } from 'koa';

interface JsendOpts {
  data?: any;
  httpStatus?: number;
  message?: string;
  stack?: string;
  errorCode?: number;
}

export default async function jsend(ctx: Context, next: Function) {
  ctx.success = ({ data, httpStatus }: JsendOpts = {}) => {
    ctx.status = httpStatus || 200;
    ctx.body = {
      data,
      status: 'success',
    };
  };

  ctx.fail = ({ message, data, stack, errorCode, httpStatus }: JsendOpts = {}) => {
    ctx.status = httpStatus || 400;
    ctx.body = {
      data,
      errorCode,
      message: message || STATUS_CODES[ctx.status],
      status: 'fail',
    };

    if (stack && config.get('exposeErrors')) ctx.body.stack = stack;
  };

  ctx.error = ({ message, data, stack, errorCode, httpStatus }: JsendOpts = {}) => {
    if (config.get('exposeErrors')) {
      ctx.status = httpStatus || 500;
      ctx.body = {
        data,
        stack,
        errorCode,
        message: message || STATUS_CODES[ctx.status],
        status: 'error',
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        errorCode,
        message: STATUS_CODES[500],
        status: 'error',
      };
    }
  };

  return next();
}
