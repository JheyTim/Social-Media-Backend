const { gql } = require('apollo-server-express');

exports.notificationTypeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    bio: String
    profilePicture: String
    website: String
    location: String
  }

  type Post {
    id: ID!
    author: User!
    content: String!
    mediaURLs: [String]
    likes: [User]
    likeCount: Int
    createdAt: String
    updatedAt: String
  }

  type Notification {
    id: ID!
    type: String!
    sender: User!
    receiver: User!
    post: Post
    read: Boolean
    createdAt: String
  }

  type Subscription {
    newNotification: Notification
  }

  type Query {
    getUserNotifications: [Notification]
  }

  type Mutation {
    markNotificationRead(notificationId: ID!): Notification
  }
`;
