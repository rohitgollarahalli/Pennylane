// src/app/layout.tsx
import type { Metadata } from 'next';
import Providers from './providers';
import { Box, Container } from '@chakra-ui/react';
import { AppNav } from '@/app/components/nav/AppNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'PennyLane Support',
  description: 'Coding challenges and support conversations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Box minH="100dvh" bg="chakra-body-bg">
            <AppNav />
            <Container maxW="7xl" py={8}>
              {children}
            </Container>
          </Box>
        </Providers>
      </body>
    </html>
  );
}
