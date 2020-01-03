import { Context } from 'koa';
import Joi from 'joi';
import _ from 'lodash';

import { Logger } from '../../utils/logger';
import noteModel from './model';
import { UserError, ErrorCode } from '../../utils/errors';

export class NoteController {
  private logger = new Logger('NoteController');

  public async listNotes(ctx: Context) {
    this.logger.verbose('listNotes()');
    const notes = await noteModel.listNotes({ authorId: ctx.state.auth.id });

    return ctx.success({ data: notes });
  }

  public async createNote(ctx: Context) {
    this.logger.verbose('createNote(', ctx.request.body, ')');
    await this.validateCreateNote(ctx);

    const payload = _.defaults(_.pick(ctx.request.body, ['title', 'content']), {
      authorId: ctx.state.auth.id,
    });
    const note = await noteModel.createNote(payload as { title: string; content: string; authorId: string });

    return ctx.success({ data: note, httpStatus: 201 });
  }

  private async validateCreateNote(ctx: Context) {
    const { error } = Joi.validate(ctx.request.body, {
      title: Joi.string().required(),
      content: Joi.string(),
    });
    if (error) throw new UserError({ errorCode: ErrorCode.E_40006, message: 'Validation Error', data: error });
  }

  public async getNote(ctx: Context) {
    this.logger.verbose('getNote(', ctx.params.noteId, ')');

    return ctx.success({ data: ctx.state.note });
  }

  public async updateNote(ctx: Context) {
    this.logger.verbose('updateNote(', ctx.params.noteId, ctx.request.body, ')');
    await this.validateUpdateNote(ctx);

    const payload = _.pick(ctx.request.body, ['title', 'content']);
    const note = await noteModel.updateNote(ctx.params.noteId, payload);

    return ctx.success({ data: note });
  }

  private async validateUpdateNote(ctx: Context) {
    const { error } = Joi.validate(ctx.request.body, {
      title: Joi.string().required(),
      content: Joi.string(),
    });
    if (error) throw new UserError({ errorCode: ErrorCode.E_40007, message: 'Validation Error', data: error });
  }

  public async deleteNote(ctx: Context) {
    this.logger.verbose('deleteNote(', ctx.params.noteId, ')');
    ctx.throw(501);
  }
}

export default new NoteController();
