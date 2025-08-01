// src/app/features/auth/AuthenticatedSync.tsx
'use client';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAccessToken } from '@/app/lib/apolloClient';
import { useMutation } from '@apollo/client';
import { SYNC_USER } from '@/app/graphql/operations';

export const AuthenticatedSync = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [syncUser] = useMutation(SYNC_USER);

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !user) return;
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      await syncUser({
        variables: {
          email: user.email,
          username: user.nickname || user.name,
          auth0Id: user.sub,
        },
      });
    };
    run();
  }, [isAuthenticated, user, getAccessTokenSilently, syncUser]);

  return null;
};
