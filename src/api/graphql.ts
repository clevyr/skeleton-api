import { ApolloServer, gql } from 'apollo-server-koa';
import config from 'config';
import { defaultsDeep } from 'lodash';

import userResolvers from './user/resolvers';

/* * * * * Schema * * * * */
const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(createUserInput: CreateUserInput!): User!
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
    status: UserStatus
  }

  input CreateUserInput {
    name: String
    email: String!
    password: String!
  }
`;
/* * * * * * * * * * * * */

const resolvers = defaultsDeep({}, userResolvers);

export class GraphQL {
  public apolloServer: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    playground: config.get('graphqlPlayground'),
  });
}

export default new GraphQL();
