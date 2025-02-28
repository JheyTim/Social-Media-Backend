const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type AuthPayload {
    token: String!
    user: User
  }

  type Query {
    hello: String
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

module.exports = typeDefs;
