// src/app/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:5000/api/graphql', // adjust as needed
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
})
