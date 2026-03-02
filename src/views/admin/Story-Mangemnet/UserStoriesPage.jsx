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
  const thStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: '600',
  };

  const tdStyle = {
    padding: '12px',
  };
  return (
    <Card p="30px" mt="80px">
      {/* HEADER */}
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

        <Badge colorScheme="blue" px={4} py={2} borderRadius="full">
          {stories.length} Total
        </Badge>
      </Flex>

      {stories.length === 0 ? (
        <Flex justify="center" align="center" minH="200px">
          <Text color="gray.500">No stories found</Text>
        </Flex>
      ) : (
        <Box overflowX="auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Cover</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Likes</th>
                <th style={thStyle}>Comments</th>
                <th style={thStyle}>Chapters</th>
                <th style={thStyle}>Update</th>
                <th style={thStyle}>Preview</th>
              </tr>
            </thead>

            <tbody>
              {stories.map((story) => (
                <tr key={story._id} style={{ borderBottom: '1px solid #ddd' }}>
                  {/* TITLE */}
                  <td style={tdStyle}>{story.title}</td>

                  {/* COVER */}
                  <td style={tdStyle}>
                    {story.coverImage ? (
                      <Image
                        src={`${baseUrl}${story.coverImage}`}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    ) : (
                      'No Image'
                    )}
                  </td>

                  {/* STATUS BADGE */}
                  <td style={tdStyle}>
                    <Badge colorScheme={getStatusColor(story.status)}>
                      {story.status.toUpperCase()}
                    </Badge>
                  </td>

                  {/* LIKES */}
                  <td style={tdStyle}>❤️ {story.likes?.length || 0}</td>

                  {/* COMMENTS */}
                  <td style={tdStyle}>💬 {story.comments?.length || 0}</td>

                  {/* CHAPTER COUNT */}
                  <td style={tdStyle}>📚 {story.chapters?.length || 0}</td>

                  {/* UPDATE STATUS */}
                  <td style={tdStyle}>
                    <Select
                      size="sm"
                      value={story.status}
                      isDisabled={updatingId === story._id}
                      onChange={(e) => updateStatus(story._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Select>
                  </td>

                  {/* PREVIEW FILE */}
                  <td style={tdStyle}>
                    {story.textFile && (
                      <Button
                        as="a"
                        href={`${baseUrl}/${story.textFile}`}
                        target="_blank"
                        size="sm"
                        colorScheme="blue"
                      >
                        View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Card>
  );
}
