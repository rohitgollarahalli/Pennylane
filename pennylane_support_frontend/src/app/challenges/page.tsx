'use client';

import { useQuery } from '@apollo/client';
import { LIST_CHALLENGES_PAGED } from '@/app/graphql/operations';
import {
  Box, Heading, SimpleGrid, Text, Tag, Input, HStack, Spinner, Link as CLink,
  Select, Button
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 12;

export default function ChallengesPage() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery(LIST_CHALLENGES_PAGED, {
    variables: { search, tag, page, pageSize: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  // Refetch when filters change
  useEffect(() => {
    setPage(1);
    refetch({ search, tag, page: 1, pageSize: PAGE_SIZE });
  }, [search, tag, refetch]);

  const total = data?.challengesPaged?.total ?? 0;
  const items = data?.challengesPaged?.items ?? [];
  const tags = data?.tags ?? [];

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageNumbers = useMemo(() => {
    // show up to 7 numbers with ellipses
    const nums: (number | '…')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
      return nums;
    }
    const add = (n: number | '…') => nums.push(n);
    add(1);
    if (page > 4) add('…');
    const start = Math.max(2, page - 2);
    const end = Math.min(totalPages - 1, page + 2);
    for (let i = start; i <= end; i++) add(i);
    if (page < totalPages - 3) add('…');
    add(totalPages);
    return nums;
  }, [page, totalPages]);

  return (
    <Box>
      <Heading mb={4}>Coding Challenges</Heading>

      <HStack spacing={4} mb={6} wrap="wrap">
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          width="320px"
        />
        <Select
          placeholder="All tags"
          value={tag ?? ''}
          onChange={(e) => setTag(e.target.value || undefined)}
          width="220px"
        >
          {tags?.map((t: any) => (
            <option value={t.name} key={t.name}>{t.name}</option>
          ))}
        </Select>
        <Button
          variant="outline"
          onClick={() => { setSearch(''); setTag(undefined); }}
        >
          Reset
        </Button>
      </HStack>

      {loading && <Spinner />}

      {!loading && (
        <>
          <SimpleGrid minChildWidth="280px" spacing={4}>
            {items.map((c: any) => (
              <Box key={c.id} p={4} borderWidth="1px" rounded="md">
                <CLink as={Link} href={`/challenges/${c.publicId}`}>
                  <Heading size="md">{c.title}</Heading>
                </CLink>
                <Text mt={2} noOfLines={3}>{c.description}</Text>
                <HStack mt={3} wrap="wrap">
                  {c.tags?.map((t: any) => <Tag key={t.name}>{t.name}</Tag>)}
                </HStack>
                <Text mt={2} fontSize="sm" color="gray.500">
                  {c.category} • {c.difficulty} • {c.points} pts
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {/* Numbered pagination */}
          <HStack mt={6} spacing={2} wrap="wrap">
            <Button
              onClick={() => { if (hasPrev) { const p = page - 1; setPage(p); refetch({ search, tag, page: p, pageSize: PAGE_SIZE }); } }}
              isDisabled={!hasPrev}
            >
              Prev
            </Button>
            {pageNumbers.map((n, idx) =>
              n === '…' ? (
                <Button key={`ellipsis-${idx}`} variant="ghost" isDisabled>
                  …
                </Button>
              ) : (
                <Button
                  key={n}
                  variant={n === page ? 'solid' : 'outline'}
                  onClick={() => {
                    setPage(n as number);
                    refetch({ search, tag, page: n, pageSize: PAGE_SIZE });
                  }}
                >
                  {n}
                </Button>
              )
            )}
            <Button
              onClick={() => { if (hasNext) { const p = page + 1; setPage(p); refetch({ search, tag, page: p, pageSize: PAGE_SIZE }); } }}
              isDisabled={!hasNext}
            >
              Next
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
}
