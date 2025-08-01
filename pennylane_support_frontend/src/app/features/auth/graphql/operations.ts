// src/app/graphql/operations.ts
import { gql } from '@apollo/client';

export const LIST_CHALLENGES = gql`
  query ListChallenges($search: String, $tag: String) {
    challenges(search: $search, tag: $tag) {
      id
      publicId
      title
      description
      category
      difficulty
      points
      tags { name }
      learningObjectives { text }
      hints { text }
    }
  }
`;

export const GET_CHALLENGE = gql`
  query GetChallenge($publicId: String!) {
    challenge(publicId: $publicId) {
      id
      publicId
      title
      description
      category
      difficulty
      points
      tags { name }
      hints { text }
      learningObjectives { text }
      conversations {
        id
        identifier
        topic
        category
        status
        posts {
          id
          authorDisplayName
          content
          createdAt
        }
      }
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation(
    $challengePublicId: String!
    $topic: String!
    $category: String!
    $firstPost: String
    $authorDisplayName: String
  ) {
    createConversation(
      challengePublicId: $challengePublicId
      topic: $topic
      category: $category
      firstPost: $firstPost
      authorDisplayName: $authorDisplayName
    ) {
      ok
      conversation { id identifier topic status }
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($conversationId: Int!, $content: String!, $authorDisplayName: String) {
    addPost(conversationId: $conversationId, content: $content, authorDisplayName: $authorDisplayName) {
      ok
      post { id content createdAt authorDisplayName }
    }
  }
`;

export const SUPPORT_CONVERSATIONS = gql`
  query SupportConversations($search: String, $status: String, $category: String, $assignedTo: Int, $limit: Int, $offset: Int) {
    supportConversations(search: $search, status: $status, category: $category, assignedTo: $assignedTo, limit: $limit, offset: $offset) {
      id
      identifier
      topic
      category
      status
      createdAt
      challenge { publicId title }
      posts { id }
    }
  }
`;
