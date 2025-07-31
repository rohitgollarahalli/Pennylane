'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { client } from '@/app/lib/apolloClient'
import { AuthenticatedSync } from '@/app/features/auth/AuthenticatedSync'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
      }}
    >
      <ApolloProvider client={client}>
        <ChakraProvider>
          {children}
          <AuthenticatedSync />
        </ChakraProvider>
      </ApolloProvider>
    </Auth0Provider>
  )
}
