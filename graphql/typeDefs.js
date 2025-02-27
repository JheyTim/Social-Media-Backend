const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Query {
    hello: String
  }

  type Mutation {
    createTestUser(email: String!, name: String!): User
  }
`;

module.exports = typeDefs;
