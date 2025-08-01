'use client';
import Link from 'next/link';
import { Box, Flex, HStack, Button, Heading, Spacer } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

export const AppNav = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <Box as="nav" borderBottomWidth="1px" py={3}>
      <Flex align="center" px={{ base: 4, md: 0 }}>
        <Heading size="md"><Link href="/">PennyLane</Link></Heading>
        <HStack spacing={6} ml={8}>
          <Link href="/challenges">Challenges</Link>
          <Link href="/conversations">Conversations</Link>
        </HStack>
        <Spacer />
        {isAuthenticated ? (
          <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</Button>
        ) : (
          <Button onClick={() => loginWithRedirect()}>Login</Button>
        )}
      </Flex>
    </Box>
  );
};
