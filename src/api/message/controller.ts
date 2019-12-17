import { Context } from 'koa';

export class MessageController {
  public getMessages(ctx: Context) {
    ctx.throw(501);
  }

  public createMessage(ctx: Context) {
    ctx.throw(501);
  }

  public getMessage(ctx: Context) {
    ctx.throw(501);
  }

  public updateMessage(ctx: Context) {
    ctx.throw(501);
  }

  public deleteMessage(ctx: Context) {
    ctx.throw(501);
  }
}

export default new MessageController();
