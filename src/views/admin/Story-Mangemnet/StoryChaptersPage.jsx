import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Image,
  Spinner,
  Flex,
  Badge,
  Button,
  Input,
  HStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StoryChaptersPage() {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL?.replace(/\/$/, '');
  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/user-stories/${storyId}`,
        { headers },
      );

      if (res.data.success) {
        setStory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Flex justify="center" mt="100px">
        <Spinner size="xl" />
      </Flex>
    );
  const thStyle = {
    padding: '16px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
  };

  const tdStyle = {
    padding: '16px',
    verticalAlign: 'middle',
  };
  return (
    <Box mt={{ base: '100px', md: '120px' }} px={{ base: '20px', md: '40px' }}>
      {/* HEADER */}
      <Flex justify="space-between" align="center" mb={10} wrap="wrap" gap={4}>
        <HStack spacing={4}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="outline"
            borderRadius="full"
            onClick={() => navigate(-1)}
          >
            Back
          </Button>

          <Text fontSize="26px" fontWeight="800">
            {story.title} - Chapters
          </Text>
        </HStack>

        <Badge
          colorScheme="purple"
          fontSize="14px"
          px={4}
          py={2}
          borderRadius="full"
        >
          {story.chapters.length} Chapters
        </Badge>
      </Flex>

      {/* TABLE CONTAINER */}
      <Box
        bg="white"
        borderRadius="2xl"
        shadow="lg"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
      >
        <Box overflowX="auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#111827', color: 'white' }}>
              <tr>
                <th style={thStyle}>Chapter</th>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Likes</th>
                <th style={thStyle}>Comments</th>
              </tr>
            </thead>

            <tbody>
              {story.chapters.map((chapter, index) => (
                <tr
                  key={chapter._id}
                  style={{
                    borderBottom: '1px solid #eee',
                    transition: '0.2s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#f9fafb')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  {/* CHAPTER TITLE */}
                  <td style={tdStyle}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="700">
                        {index + 1}. {chapter.title}
                      </Text>
                      <Text fontSize="12px" color="gray.500">
                        Created:{' '}
                        {new Date(chapter.createdAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </td>

                  {/* IMAGE */}
                  <td style={tdStyle}>
                    {chapter.image ? (
                      <Image
                        src={`${baseUrl}${chapter.image}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="lg"
                        shadow="md"
                      />
                    ) : (
                      <Text fontSize="13px" color="gray.400">
                        No Image
                      </Text>
                    )}
                  </td>

                  {/* DESCRIPTION */}
                  <td style={{ ...tdStyle, maxWidth: '350px' }}>
                    <Text noOfLines={3} fontSize="14px" color="gray.600">
                      {chapter.description}
                    </Text>
                  </td>

                  {/* CHAPTER LIKES */}
                  <td style={tdStyle}>
                    <Badge
                      colorScheme="pink"
                      fontSize="13px"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      ❤️ {chapter.likes?.length || 0}
                    </Badge>
                  </td>

                  {/* CHAPTER COMMENTS */}
                  <td style={tdStyle}>
                    <Badge
                      colorScheme="blue"
                      fontSize="13px"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      💬 {chapter.comments?.length || 0}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  );
}
