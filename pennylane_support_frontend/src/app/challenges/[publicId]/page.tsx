'use client';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_POST, CREATE_CONVERSATION, GET_CHALLENGE } from '@/app/graphql/operations';
import {
  Box, Heading, Text, VStack, Divider, Input, Button,
  Textarea, Spinner, HStack, Tag
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ChallengeDetailPage() {
  const { publicId } = useParams<{ publicId: string }>();
  const { data, loading, refetch } = useQuery(GET_CHALLENGE, { variables: { publicId } });
  const [createConversation] = useMutation(CREATE_CONVERSATION);
  const [addPost] = useMutation(ADD_POST);

  // form state for creating a new conversation
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('PennyLane Help');
  const [firstPost, setFirstPost] = useState('');

  // per-conversation reply text
  const [replies, setReplies] = useState<Record<number, string>>({});

  if (loading) return <Spinner />;

  const challenge = data?.challenge;
  if (!challenge) return <Text>No challenge found with this ID.</Text>;

  const handleCreate = async () => {
    if (!topic.trim() || !firstPost.trim()) return;
    await createConversation({
      variables: {
        challengePublicId: publicId,
        topic,
        category,
        firstPost,             
      },
    });
    setTopic('');
    setCategory('PennyLane Help');
    setFirstPost('');
    await refetch();
  };

  const handleReply = async (conversationId: number) => {
    const message = (replies[conversationId] || '').trim();
    if (!message) return;
    await addPost({ variables: { conversationId, content: message } });
    setReplies((prev) => ({ ...prev, [conversationId]: '' }));
    await refetch();
  };

  return (
    <Box>
      <Heading mb={2}>{challenge.title}</Heading>
      <Text color="gray.600" mb={4}>
        {challenge.category} • {challenge.difficulty} • {challenge.points} pts
      </Text>
      <HStack mb={4} wrap="wrap">
        {challenge.tags?.map((t: any) => <Tag key={t.name}>{t.name}</Tag>)}
      </HStack>
      <Text mb={6}>{challenge.description}</Text>

      <Heading size="md" mt={8} mb={2}>Hints</Heading>
      <VStack align="stretch" spacing={2} mb={6}>
        {challenge.hints?.map((h: any, i: number) => <Text key={i}>• {h.text}</Text>)}
      </VStack>

      <Heading size="md" mt={8} mb={2}>Learning Objectives</Heading>
      <VStack align="stretch" spacing={2} mb={6}>
        {challenge.learningObjectives?.map((lo: any, i: number) => <Text key={i}>• {lo.text}</Text>)}
      </VStack>

      <Heading size="md" mt={8} mb={2}>Start a Support Conversation</Heading>
      <VStack align="stretch" spacing={3} mb={10}>
        <Input placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Textarea placeholder="First message…" value={firstPost} onChange={(e) => setFirstPost(e.target.value)} />
        <Button onClick={handleCreate} colorScheme="blue" alignSelf="start">Create Conversation</Button>
      </VStack>

      <Heading size="md" mb={2}>Conversations</Heading>
      <VStack align="stretch" spacing={6}>
        {challenge.conversations?.map((conv: any) => (
          <Box key={conv.id} p={4} borderWidth="1px" rounded="md">
            <Heading size="sm">{conv.topic}</Heading>
            <Text fontSize="sm" color="gray.500">{conv.category} • {conv.status}</Text>
            <Divider my={3} />
            <VStack align="stretch" spacing={3}>
              {conv.posts?.map((p: any) => (
                <Box key={p.id}>
                  <Text fontSize="sm" color="gray.600">{p.authorDisplayName || 'User'}</Text>
                  <Text>{p.content}</Text>
                </Box>
              ))}
            </VStack>
            <Textarea
              mt={3}
              placeholder="Write a reply…"
              value={replies[conv.id] || ''}
              onChange={(e) => setReplies((prev) => ({ ...prev, [conv.id]: e.target.value }))}
            />
            <Button mt={2} onClick={() => handleReply(conv.id)}>Reply</Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
