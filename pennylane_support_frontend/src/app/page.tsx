// src/app/page.tsx
'use client'

import { useAuth0 } from '@auth0/auth0-react'
import { Box, Button, Heading, Text } from '@chakra-ui/react'

export default function HomePage() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()

  if (isLoading) return <Text>Loading...</Text>

  return (
    <Box p={10}>
      <Heading mb={4}>Welcome to PennyLane Support</Heading>
      {isAuthenticated ? (
        <>
          <Text mb={4}>Hello, {user?.name}</Text>
          <Button colorScheme="red" onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </Button>
        </>
      ) : (
        <Button colorScheme="blue" onClick={() => loginWithRedirect()}>
          Login
        </Button>
      )}
    </Box>
  )
}
