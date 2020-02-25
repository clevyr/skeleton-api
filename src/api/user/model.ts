import _ from 'lodash';
import uuid from 'uuid/v4';

import database from '../../database';
import { Logger } from '../../utils/logger';
import { hashPassword } from '../auth/utils';

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializedUser {
  id: string;
  name?: string;
  email: string;
  status: string;
}

export interface CreateUserInput {
  name?: string;
  email: string;
  password: string;
}

export class UserModel {
  private logger = new Logger('UserModel');

  async listUsers(): Promise<User[]> {
    this.logger.verbose('listUsers()');
    const users: User[] = await database('user').select();

    return users;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    this.logger.verbose('createUser(', input, ')');
    const newUserProps = _.defaults(_.pick(input, ['name', 'email']), {
      id: uuid(),
      password: await hashPassword(input.password),
      status: UserStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await database('user').insert(newUserProps);

    return this.getUser(newUserProps.id);
  }

  async getUser(userId: string): Promise<User | undefined> {
    this.logger.verbose('getUser(', userId, ')');
    const [user]: User[] = await database('user').select().where({ id: userId });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    this.logger.verbose('getUserByEmail(', email, ')');
    const [user]: User[] = await database('user').select().where({ email });

    return user;
  }

  async updateUser(userId: string, payload: { name?: string; email?: string; password?: string; status?: UserStatus }): Promise<User> {
    this.logger.verbose('updateUser(', userId, payload, ')');
    const updateUserProps = _.defaults(_.pick(payload, ['name', 'email', 'status']), {
      updatedAt: new Date(),
    });

    if (payload.password) updateUserProps.password = await hashPassword(payload.password);

    await database('user').where({ id: userId }).update(updateUserProps);

    return this.getUser(userId);
  }
}

export default new UserModel();
