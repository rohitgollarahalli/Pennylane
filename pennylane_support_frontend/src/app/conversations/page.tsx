'use client';

import { useQuery } from '@apollo/client';
import { LIST_CONVERSATIONS_PAGED } from '@/app/graphql/operations';
import {
  Box, Heading, HStack, Input, Select, Button, SimpleGrid, Text, Tag, Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 12;

export default function ConversationsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery(LIST_CONVERSATIONS_PAGED, {
    variables: { search, status, category, page, pageSize: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  // refetch when filters change
  useEffect(() => {
    refetch({ search, status, category, page: 1, pageSize: PAGE_SIZE });
    setPage(1);
  }, [search, status, category, refetch]);

  const total = data?.conversationsPaged?.total ?? 0;
  const items = data?.conversationsPaged?.items ?? [];
  const hasPrev = page > 1;
  const hasNext = page * PAGE_SIZE < total;

  return (
    <Box>
      <Heading mb={6}>All Conversations</Heading>

      <HStack spacing={4} mb={6} wrap="wrap">
        <Input
          placeholder="Search topic…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="320px"
        />
        <Select placeholder="Status" value={status ?? ''} onChange={(e) => setStatus(e.target.value || undefined)} width="220px">
          <option value="OPEN">OPEN</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </Select>
        <Select placeholder="Category" value={category ?? ''} onChange={(e) => setCategory(e.target.value || undefined)} width="220px">
          <option value="PennyLane Help">PennyLane Help</option>
          <option value="Bug">Bug</option>
          <option value="Other">Other</option>
        </Select>
        <Button onClick={() => { setSearch(''); setStatus(undefined); setCategory(undefined); }} variant="outline">
          Reset
        </Button>
      </HStack>

      {loading && <Spinner />}

      {!loading && (
        <>
          <SimpleGrid minChildWidth="320px" spacing={4}>
            {items.map((c: any) => (
              <Box key={c.id} p={4} borderWidth="1px" rounded="md">
                <Heading size="sm">{c.topic}</Heading>
                <Text fontSize="sm" color="gray.500">
                  {c.category} • {c.status}
                </Text>
                {c.challenge && (
                  <HStack mt={2}>
                    <Tag>{c.challenge.title}</Tag>
                  </HStack>
                )}
                <Text mt={2} fontSize="xs" color="gray.500">
                  {new Date(c.createdAt).toLocaleString()}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          <HStack mt={6} spacing={3}>
            <Button onClick={() => { if (hasPrev) { const p = page - 1; setPage(p); refetch({ search, status, category, page: p, pageSize: PAGE_SIZE }); } }} isDisabled={!hasPrev}>
              Prev
            </Button>
            <Button variant="outline" isDisabled>{page}</Button>
            <Button onClick={() => { if (hasNext) { const p = page + 1; setPage(p); refetch({ search, status, category, page: p, pageSize: PAGE_SIZE }); } }} isDisabled={!hasNext}>
              Next
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
}
