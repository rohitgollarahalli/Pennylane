// src/app/providers.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/app/lib/apolloClient';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthenticatedSync } from '@/app/features/auth/AuthenticatedSync';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        redirect_uri: process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI,
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
    >
      <ApolloProvider client={apolloClient}>
        <ChakraProvider>
          {/* Sets the token into apollo after login */}
          <AuthenticatedSync />
          {children}
        </ChakraProvider>
      </ApolloProvider>
    </Auth0Provider>
  );
}
