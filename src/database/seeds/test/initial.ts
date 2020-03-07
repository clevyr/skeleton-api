import Knex from 'knex';

import { createAuthToken, hashPassword } from '../../../api/auth/utils';
import { User } from '../../../api/user/types';
import { randomUser } from '../../../api/user/utils';

interface UserWithToken extends User {
  authToken?: string;
}

export const users: { [index: string]: UserWithToken } = {
  'UserController.listUsers.1': randomUser(),
  'UserController.createUser.1': randomUser(),
  'UserController.getUser.1': randomUser(),
  'UserController.getUser.2': randomUser(),
  'UserController.updateUser.1': randomUser(),
  'UserController.updateUser.2': randomUser(),
  'UserController.updateUser.3': randomUser(),
  'UserController.updateUser.4': randomUser(),
  'UserController.updateUser.5': randomUser(),
  'UserController.updateUser.6': randomUser(),
  'UserController.deleteUser.1': randomUser(),

  'AuthController.authenticate.1': randomUser(),
  'AuthController.authenticate.2': randomUser(),
  'AuthController.getAuthenticated.1': randomUser(),
  'AuthController.logout.1': randomUser(),

  'middleware.isAuth.1': randomUser(),
};

export async function seed(knex: Knex) {
  await knex('user').del();

  const usersToInsert = await Promise.all(Object.keys(users).map(async (userIndex) => {
    const user = Object.assign({}, users[userIndex]);

    user.password = await hashPassword(user.password);
    users[userIndex].authToken = await createAuthToken(user);

    return user;
  }));

  await knex('user').insert(usersToInsert);
}
