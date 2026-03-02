import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Text,
  Spinner,
  VStack,
  Badge,
  Button,
  Select,
  HStack,
  Divider,
  Flex,
  Image,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from 'components/card/Card';

export default function UserStoriesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const baseUrl = process.env.REACT_APP_BASE_URL?.replace(/\/$/, '');
  const token = localStorage.getItem('token');

  const bgCard = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/user-stories/by-user/${userId}`,
        { headers },
      );

      if (res.data?.success) {
        setStories(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (storyId, newStatus) => {
    setUpdatingId(storyId);

    try {
      await axios.patch(
        `${baseUrl}/api/admin/user-stories/${storyId}/status`,
        { status: newStatus },
        { headers },
      );

      setStories((prev) =>
        prev.map((s) => (s._id === storyId ? { ...s, status: newStatus } : s)),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'yellow';
  };

  if (loading)
    return (
      <Flex mt="100px" justify="center">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );

  return (
    <Card p="30px" mt="80px">
      {/* ===== Header Section ===== */}
      <Flex justify="space-between" align="center" mb={8}>
        <HStack spacing={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            aria-label="Back"
            onClick={() => navigate(-1)}
            variant="outline"
          />
          <Text fontSize="24px" fontWeight="800">
            User Stories
          </Text>
        </HStack>

        <Badge
          colorScheme="blue"
          fontSize="14px"
          px={4}
          py={2}
          borderRadius="full"
        >
          {stories.length} Total
        </Badge>
      </Flex>

      {stories.length === 0 ? (
        <Flex justify="center" align="center" minH="200px">
          <Text color="gray.500">No stories found</Text>
        </Flex>
      ) : (
        <VStack spacing={8} align="stretch">
          {stories.map((story) => (
            <Box
              key={story._id}
              bg={bgCard}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="xl"
              p={6}
              shadow="sm"
              _hover={{ shadow: 'md' }}
              transition="0.3s"
            >
              {/* Title + Status */}
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontSize="20px" fontWeight="700">
                  {story.title}
                </Text>

                <Badge
                  colorScheme={getStatusColor(story.status)}
                  fontSize="13px"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {story.status.toUpperCase()}
                </Badge>
              </Flex>

              {/* Cover Image */}
              {story.coverImage && (
                <Box mt={4}>
                  <Image
                    src={`${baseUrl}${story.coverImage}`}
                    alt="cover"
                    borderRadius="lg"
                    w="100%"
                    maxH="280px"
                    objectFit="cover"
                    fallbackSrc="https://via.placeholder.com/800x400?text=No+Image"
                  />
                </Box>
              )}

              {/* Description */}
              <Text mt={4} color="gray.600">
                {story.description}
              </Text>

              {/* Stats */}
              <HStack mt={4} spacing={6}>
                <Badge colorScheme="pink">❤️ {story.likes?.length || 0}</Badge>
                <Badge colorScheme="blue">
                  💬 {story.comments?.length || 0}
                </Badge>
                <Badge colorScheme="purple">
                  📚 {story.chapters?.length || 0} Chapters
                </Badge>
              </HStack>

              {/* Chapters */}
              {story.chapters?.length > 0 && (
                <Box mt={6}>
                  <Text fontWeight="700" mb={3}>
                    Chapters
                  </Text>

                  <VStack spacing={4} align="stretch">
                    {story.chapters.map((chapter, i) => (
                      <Box
                        key={i}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg="gray.50"
                      >
                        <Text fontWeight="600">{chapter.title}</Text>
                        <Text fontSize="14px" color="gray.600">
                          {chapter.description}
                        </Text>

                        {chapter.image && (
                          <Image
                            mt={3}
                            src={`${baseUrl}${chapter.image}`}
                            borderRadius="md"
                            maxH="180px"
                            objectFit="cover"
                            fallbackSrc="https://via.placeholder.com/600x300?text=No+Image"
                          />
                        )}
                      </Box>
                    ))}
                  </VStack>
                </Box>
              )}

              <Divider my={6} />

              {/* Status Update */}
              <HStack spacing={4}>
                <Select
                  maxW="220px"
                  value={story.status}
                  isDisabled={updatingId === story._id}
                  onChange={(e) => updateStatus(story._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>

                {story.textFile && (
                  <Button
                    as="a"
                    href={`${baseUrl}/${story.textFile}`}
                    target="_blank"
                    size="sm"
                    colorScheme="blue"
                  >
                    Preview File
                  </Button>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Card>
  );
}
