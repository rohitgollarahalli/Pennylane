// src/app/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Keep token in memory (frontend only)
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API, // e.g. http://localhost:5000/graphql
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  },
}));

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// export both named and default to avoid import mismatches
export default apolloClient;
