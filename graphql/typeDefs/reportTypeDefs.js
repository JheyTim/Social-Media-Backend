const { gql } = require('apollo-server-express');

exports.reportTypeDefs = gql`
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

  type Report {
    id: ID!
    reporter: User!
    reportedUser: User
    reportedPost: Post
    reason: String!
    status: String!
    createdAt: String
    updatedAt: String
  }

  type Mutation {
    reportUser(reportedUserId: ID!, reason: String!): Report
    reportPost(reportedPostId: ID!, reason: String!): Report
  }

  type Query {
    getAllReports: [Report]
    getOpenReports: [Report]
  }

  type Mutation {
    resolveReport(reportId: ID!): Report
    rejectReport(reportId: ID!): Report
  }
`;
