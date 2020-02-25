import userModel, { CreateUserInput } from './model';

export default {
  Query: {
    users: () => userModel.listUsers(),
    user: (_: any, { id }: { id: string }) => userModel.getUser(id),
  },

  Mutation: {
    createUser: (_: any, { createUserInput }: { createUserInput: CreateUserInput }) => userModel.createUser(createUserInput),
  }
};
