import Router from '@koa/router';
import noteController from './controller';

export class NoteRouter {
  public router: Router = new Router({ prefix: '/notes' });

  constructor() {
    this.router
      .get(   '/',        noteController.getNotes.bind(noteController))
      .post(  '/',        noteController.createNote.bind(noteController))
      .get(   '/:noteId', noteController.getNote.bind(noteController))
      .put(   '/:noteId', noteController.updateNote.bind(noteController))
      .delete('/:noteId', noteController.deleteNote.bind(noteController));
  }
}

export default new NoteRouter();
