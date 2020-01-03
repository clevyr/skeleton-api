import Knex from 'knex';

import { hashPassword } from '../../../api/auth/utils';
import { User } from '../../../api/user/model';
import { randomUser } from '../../../api/user/utils';

const users: User[] = [
  randomUser({
    name: 'Garrett Cox',
    email: 'garrett@clevyr.com',
    password: 'password',
  }),
];

export async function seed(knex: Knex) {
  await knex('user').del();

  const usersToInsert = await Promise.all(users.map(async (user) => {
    user.password = await hashPassword(user.password);

    return user;
  }));

  await knex('user').insert(usersToInsert);
}
