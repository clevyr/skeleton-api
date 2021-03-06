import Joi from '@hapi/joi';
import { Context } from 'koa';
import _ from 'lodash';

import { ErrorCode, UserError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import noteModel from './model';

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
    try {
      Joi.assert(ctx.request.body, Joi.object({
        title: Joi.string().required(),
        content: Joi.string(),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40006, message: 'Validation Error', data: error });
    }
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
    try {
      Joi.assert(ctx.request.body, Joi.object({
        title: Joi.string().required(),
        content: Joi.string(),
      }), {
        abortEarly: false,
        errors: {
          label: false,
        },
      });
    } catch (error) {
      throw new UserError({ errorCode: ErrorCode.E_40007, message: 'Validation Error', data: error });
    }
  }

  public async deleteNote(ctx: Context) {
    this.logger.verbose('deleteNote(', ctx.params.noteId, ')');
    ctx.throw(501);
  }
}

export default new NoteController();
