import isAuth from '../../middleware/isAuth';
import { Logger } from '../../utils/logger';
import userModel from './model';
import userService from './service';
import { CreateUserInput } from './types';

const logger = new Logger('UserResolvers');

export default {
  Query: {
    listUsers: async (_: any, args: any, request: any) => {
      logger.verbose('listUsers()');

      await isAuth(request.ctx);

      return userService.listUsers({
        auth: request.ctx.state.auth,
      });
    },

    getUser: (_: any, { id }: { id: string }) => userModel.getUser(id),
  },

  Mutation: {
    createUser: (_: any, { createUserInput }: { createUserInput: CreateUserInput }) => userModel.createUser(createUserInput),
  }
};
