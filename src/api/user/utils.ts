import _ from 'lodash';

import { SerializedUser, User } from './model';

export function serializeUser(user: User): SerializedUser {
  return _.pick(user, ['id', 'username', 'email', 'status']);
}
