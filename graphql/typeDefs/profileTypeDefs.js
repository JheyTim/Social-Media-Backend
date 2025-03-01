const { gql } = require('apollo-server-express');

exports.profileTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    bio: String
    profilePicture: String
    website: String
    location: String
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
    updateProfile(input: UpdateProfileInput!): User
    followUser(userToFollowId: ID!): FollowResult
    unfollowUser(userToUnfollowId: ID!): FollowResult
  }
`;
