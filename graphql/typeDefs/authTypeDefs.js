const { gql } = require('apollo-server-express');

exports.authTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    bio: String
    profilePicture: String
    website: String
    location: String
  }

  type AuthPayload {
    token: String!
    user: User
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;
