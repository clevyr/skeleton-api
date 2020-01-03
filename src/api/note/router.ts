import Router from '@koa/router';
import noteController from './controller';
import isAuth from '../../middleware/isAuth';
import isResolvedNoteMine from '../../middleware/isResolvedNoteMine';

export class NoteRouter {
  public router: Router = new Router({ prefix: '/notes' });

  constructor() {
    this.router
      .get(
        '/',
        isAuth,
        noteController.listNotes.bind(noteController)
      )
      .post(
        '/',
        isAuth,
        noteController.createNote.bind(noteController)
      )
      .get(
        '/:noteId',
        isAuth,
        isResolvedNoteMine,
        noteController.getNote.bind(noteController)
      )
      .put(
        '/:noteId',
        isAuth,
        isResolvedNoteMine,
        noteController.updateNote.bind(noteController)
      )
      .delete(
        '/:noteId',
        isAuth,
        isResolvedNoteMine,
        noteController.deleteNote.bind(noteController)
      );
  }
}

export default new NoteRouter();
