const { gql } = require('apollo-server-express');

exports.postTypeDefs = gql`
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

  type DeleteResponse {
    success: Boolean!
  }

  type Query {
    getPost(postId: ID!): Post
    getAllPosts: [Post]
    getPostsPaginated(limit: Int, offset: Int): [Post]
  }

  type Mutation {
    createPost(content: String!, mediaURLs: [String]): Post
    editPost(postId: ID!, content: String!): Post
    deletePost(postId: ID!): DeleteResponse
    likePost(postId: ID!): Post
    unlikePost(postId: ID!): Post
  }
`;
