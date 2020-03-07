import { ApolloServer, gql } from 'apollo-server-koa';
import { defaultsDeep } from 'lodash';

import authResolvers from './auth/resolvers';
import userResolvers from './user/resolvers';

/* * * * * Schema * * * * */
const typeDefs = gql`
  type Query {
    # Auth
    getAuthenticated: User!

    # User
    listUsers: [User!]!
    getUser(userId: ID!): User
  }

  type Mutation {
    # Auth
    login(loginInput: LoginInput!): User!
    logout: User!

    # User
    createUser(createUserInput: CreateUserInput!): User!
    updateUser(updateUserInput: UpdateUserInput!): User!
    deleteUser(userId: ID!): User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  enum UserStatus {
    PENDING
    ACTIVE
    DISABLED
  }

  type User {
    id: String!
    name: String
    email: String!
    status: UserStatus!
  }

  input CreateUserInput {
    name: String
    email: String!
    password: String!
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
  }
`;
/* * * * * * * * * * * * */

const resolvers = defaultsDeep({},
  userResolvers,
  authResolvers,
);

export class GraphQL {
  public apolloServer: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {
      settings: {
        'request.credentials': 'include'
      }
    },
    context: (ctx) => (ctx),
  });
}

export default new GraphQL();
