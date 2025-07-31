import { gql } from '@apollo/client';

const SYNC_USER = gql`
  mutation SyncUser($email: String!, $name: String!, $auth0Id: String!) {
    syncUser(email: $email, name: $name, auth0Id: $auth0Id) {
      ok
    }
  }
`