import { ServiceArg } from '../../types/service';
import { UnauthorizedError } from '../../utils/errors';
import { Logger } from '../../utils/logger';
import userModel from './model';
import { serializeUser } from './utils';

export class UserService {
  private logger = new Logger('UserService');

  public async listUsers({ auth }: ServiceArg) {
    this.logger.verbose('listUsers()');
    if (!auth) throw new UnauthorizedError();

    const users = await userModel.listUsers();
    return users.map(serializeUser);
  }

  public async createUser() {

  }

  public async getUser() {

  }

  public async updateUser() {

  }

  public async deleteUser() {

  }
}

export default new UserService();
