// src/app/lib/apolloClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => { accessToken = t; };
export const getAccessToken = () => accessToken;

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API
    || process.env.NEXT_PUBLIC_GRAPHQL_API_URL
    || process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT
    || 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default apolloClient;
