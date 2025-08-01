// src/app/page.tsx
import { Heading, Text, Button, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <VStack align="start" spacing={3}>
      <Heading>Welcome to PennyLane Support</Heading>
      <Text>Browse coding challenges and open support conversations.</Text>
      <Button as={Link} href="/challenges">Explore Challenges</Button>
    </VStack>
  );
}
