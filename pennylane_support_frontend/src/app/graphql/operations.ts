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

export const LIST_CHALLENGES_PAGED = gql`
  query ListChallengesPaged($search: String, $tag: String, $page: Int!, $pageSize: Int!) {
    challengesPaged(search: $search, tag: $tag, page: $page, pageSize: $pageSize) {
      total
      items {
        id
        publicId
        title
        description
        category
        difficulty
        points
        tags { name }
      }
    }
    tags { name }
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
        posts { id authorDisplayName createdAt content }
      }
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($challengePublicId: String!, $topic: String!, $category: String!) {
    createConversation(challengePublicId: $challengePublicId, topic: $topic, category: $category) {
      ok
      conversation { id topic status }
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($conversationId: Int!, $content: String!, $authorDisplayName: String) {
    addPost(conversationId: $conversationId, content: $content, authorDisplayName: $authorDisplayName) {
      ok
      post { id content createdAt }
    }
  }
`;

export const SYNC_USER = gql`
  mutation SyncUser($email: String!, $username: String!, $auth0Id: String!) {
    syncUser(email: $email, username: $username, auth0Id: $auth0Id) { ok }
  }
`;
