import Chance from 'chance';
import _ from 'lodash';
import uuid from 'uuid/v4';

import { SerializedUser, User, UserStatus } from './model';

const chance = new Chance();

export function serializeUser(user: User): SerializedUser {
  return _.pick(user, ['id', 'name', 'email', 'status']);
}

export function randomUser(overrides = {}): User {
  return Object.assign({
    id: uuid(),
    name: chance.word({ length: 6 }),
    email: chance.email(),
    password: chance.word({ length: 8 }),
    status: UserStatus.active,
    createdAt: new Date(),
    updatedAt: new Date(),
  }, overrides);
}
