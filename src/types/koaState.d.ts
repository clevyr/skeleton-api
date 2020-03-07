import { Note } from '../api/note/model';
import { User } from '../api/user/types';

declare module 'koa' {
  interface DefaultState extends DefaultStateExtends {
    auth: User;
    user: User;
    note: Note;
  }
}
