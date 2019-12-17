import { Context } from 'koa';

export class NoteController {
  public getNotes(ctx: Context) {
    ctx.throw(501);
  }

  public createNote(ctx: Context) {
    ctx.throw(501);
  }

  public getNote(ctx: Context) {
    ctx.throw(501);
  }

  public updateNote(ctx: Context) {
    ctx.throw(501);
  }

  public deleteNote(ctx: Context) {
    ctx.throw(501);
  }
}

export default new NoteController();
