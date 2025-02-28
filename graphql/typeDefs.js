const { gql } = require('apollo-server-express');

const typeDefs = gql`
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

  type FollowResult {
    success: Boolean!
  }

  input UpdateProfileInput {
    name: String
    bio: String
    profilePicture: String
    website: String
    location: String
  }

  type Query {
    getUserProfile(userId: ID!): User
    getCurrentUserProfile: User
    getFollowers(userId: ID!): [User]
    getFollowing(userId: ID!): [User]
  }

  type Mutation {
    signup(email: String!, password: String!, name: String): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(input: UpdateProfileInput!): User
    followUser(userToFollowId: ID!): FollowResult
    unfollowUser(userToUnfollowId: ID!): FollowResult
  }
`;

module.exports = typeDefs;
