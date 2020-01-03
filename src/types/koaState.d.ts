import koa from 'koa';
import { User } from '../api/user/model';
import { Note } from '../api/note/model';

declare module 'koa' {
  interface DefaultState extends DefaultStateExtends {
    auth: User;
    user: User;
    note: Note;
  }
}
