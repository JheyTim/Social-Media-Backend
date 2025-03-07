const { gql } = require('apollo-server-express');

exports.adminTypeDefs = gql`
  type AdminMutationResponse {
    success: Boolean!
  }

  type Mutation {
    banUser(userId: ID!): AdminMutationResponse
    unbanUser(userId: ID!): AdminMutationResponse
    deletePostAsAdmin(postId: ID!): AdminMutationResponse
  }
`;
