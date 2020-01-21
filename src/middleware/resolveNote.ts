import { Context as Ctx } from 'koa';

import noteModel from '../api/note/model';
import { NotFoundError, ErrorCode } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('Middleware');

export default async function resolveNote(noteId: string, ctx: Ctx, next?: Function) {
  logger.verbose('resolveNote(', noteId, ')');
  const note = await noteModel.getNote(noteId);
  if (!note) throw new NotFoundError({ errorCode: ErrorCode.E_40403, message: 'Note not found' });

  ctx.state.note = note;

  return next();
}
