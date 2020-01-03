import _ from 'lodash';
import uuid from 'uuid/v4';

import { Logger } from '../../utils/logger';
import database from '../../database';

export interface Note {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NoteModel {
  private logger = new Logger('NoteModel');

  async listNotes(query: { authorId?: string } = {}): Promise<Note[]> {
    this.logger.verbose('listNotes(', query, ')');
    const notes: Note[] = await database('note').select().where(query);

    return notes;
  }

  async createNote(payload: { title: string; content: string; authorId: string }): Promise<Note> {
    this.logger.verbose('createNote(', payload, ')');
    const newNoteProps = _.defaults(_.pick(payload, ['title', 'content', 'authorId']), {
      id: uuid(),
      content: '',
      title: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await database('note').insert(newNoteProps);

    return this.getNote(newNoteProps.id);
  }

  async getNote(noteId: string): Promise<Note | undefined> {
    this.logger.verbose('getNote(', noteId, ')');
    const [note]: Note[] = await database('note').select().where({ id: noteId });

    return note;
  }

  async updateNote(noteId: string, payload: { title: string; content: string }): Promise<Note> {
    this.logger.verbose('updateNote(', noteId, payload, ')');
    const updateNoteProps = _.defaults(_.pick(payload, ['title', 'content']), {
      updatedAt: new Date(),
    });

    await database('note').where({ id: noteId }).update(updateNoteProps);

    return this.getNote(noteId);
  }

  async deleteNote(noteId: string): Promise<Note> {
    this.logger.verbose('deleteNote(', noteId, ')');
    const note = this.getNote(noteId);

    await database('note').where({ id: noteId }).delete();

    return note;
  }
}

export default new NoteModel();
