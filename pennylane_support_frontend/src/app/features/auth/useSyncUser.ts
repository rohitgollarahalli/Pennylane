import { gql, useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

const SYNC_USER = gql`
  mutation SyncUser($email: String!, $username: String!, $auth0Id: String!) {
    syncUser(email: $email, username: $username, auth0Id: $auth0Id) {
      ok
    }
  }
`;


export const useSyncUser = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [syncUser, { error }] = useMutation(SYNC_USER);

 useEffect(() => {
  const run = async () => {
    if (isAuthenticated && !isLoading && user) {
      try {
        const res = await syncUser({
          variables: {
            email: user.email,
            username: user.name || '',
            auth0Id: user.sub,
          },
        });
        console.log('User synced successfully:', res);
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    }
  };
  run();
}, [user, isAuthenticated, isLoading]);


  if (error) {
    console.error('[SyncUser] GraphQL error:', error);
  }
};
