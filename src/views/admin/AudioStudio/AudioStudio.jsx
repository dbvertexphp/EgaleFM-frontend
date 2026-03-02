import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  VStack,
  Badge,
  Button,
  HStack,
  Flex,
  Input,
  Spinner,
  useToast,
  Divider,
  useColorModeValue,
  Alert,
  AlertIcon,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';

export default function AudioStudio() {
  /* ===============================
      STATE
  =============================== */
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  // Track desired publish status for each story (not yet saved to DB)
  const [publishStatuses, setPublishStatuses] = useState({});

  /* ===============================
      CONFIG & HOOKS
  =============================== */
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const playerBg = useColorModeValue('gray.50', 'gray.700');

  const RAW_BASE_URL =
    process.env.REACT_APP_BASE_URL?.replace(/\/$/, '') ||
    'http://localhost:3030';
  const API_BASE = `${RAW_BASE_URL}/api`;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  /* ===============================
      FETCH STORIES
  =============================== */
  const fetchStories = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/user-stories`, {
        headers,
      });
      if (res.data?.success) setStories(res.data.data || []);
    } catch (error) {
      toast({ title: 'Fetch failed', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token, toast]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /* ===============================
      HANDLERS
  =============================== */

  const handleFileChange = (e, storyId) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles((prev) => ({ ...prev, [storyId]: file }));
    }
  };

  // Update desired publish status for a story (preview state, not saved yet)
  const handlePublishStatusChange = (storyId, isChecked) => {
    setPublishStatuses((prev) => ({
      ...prev,
      [storyId]: isChecked,
    }));
  };

  const handleConfirmUpload = async (storyId) => {
    const file = selectedFiles[storyId];
    if (!file) return;

    const isPublished =
      publishStatuses[storyId] !== undefined ? publishStatuses[storyId] : false;

    const formData = new FormData();
    formData.append('audioTitle', 'Audio Version');
    formData.append('audioDescription', 'Converted to audio');
    formData.append('audioFile', file);
    formData.append('isAudioPublished', isPublished ? 'true' : 'false');

    try {
      setUploadingId(storyId);

      const res = await axios.put(
        `${API_BASE}/admin/story/${storyId}/upload-audio`,
        formData,
        { headers },
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
          status: 'success',
          duration: 3000,
        });

        // 🔥 INSTANT UI UPDATE
        setStories((prev) =>
          prev.map((story) => (story._id === storyId ? res.data.data : story)),
        );
      }

      // reset preview
      setSelectedFiles((prev) => {
        const copy = { ...prev };
        delete copy[storyId];
        return copy;
      });

      setPublishStatuses((prev) => {
        const copy = { ...prev };
        delete copy[storyId];
        return copy;
      });
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Upload failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploadingId(null);
    }
  };

  /* ===============================
      UI RENDERING
  =============================== */
  if (!token)
    return (
      <Alert status="error" mt="50px">
        <AlertIcon />
        Unauthorized. Login again.
      </Alert>
    );
  if (loading)
    return (
      <Flex justify="center" mt="100px">
        <Spinner size="xl" />
      </Flex>
    );
  const thStyle = {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  };

  const tdStyle = {
    padding: '10px',
  };
  return (
    <Box p={{ base: '20px', md: '40px' }}>
      <Text fontSize="28px" fontWeight="bold" mb={8}>
        Audio Studio 🎧
      </Text>

      <Box overflowX="auto">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Upload Audio</th>
              <th style={thStyle}>Public</th>
              <th style={thStyle}>Player</th>
            </tr>
          </thead>

          <tbody>
            {stories.map((story) => {
              const previewFile = selectedFiles[story._id];
              const isPreviewing = !!previewFile;

              return (
                <tr key={story._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>{story.title}</td>

                  {/* STATUS */}
                  <td style={tdStyle}>
                    <Badge
                      colorScheme={
                        story.audioFile
                          ? story.isAudioPublished
                            ? 'green'
                            : 'gray'
                          : 'red'
                      }
                    >
                      {story.audioFile
                        ? story.isAudioPublished
                          ? 'LIVE'
                          : 'DRAFT'
                        : 'NO AUDIO'}
                    </Badge>
                  </td>

                  {/* FILE UPLOAD */}
                  <td style={tdStyle}>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, story._id)}
                      display="none"
                      id={`file-${story._id}`}
                    />

                    <Button
                      as="label"
                      htmlFor={`file-${story._id}`}
                      size="sm"
                      variant="outline"
                      mr={2}
                    >
                      Select
                    </Button>

                    {isPreviewing && (
                      <Button
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleConfirmUpload(story._id)}
                        isLoading={uploadingId === story._id}
                      >
                        Upload
                      </Button>
                    )}
                  </td>

                  {/* PUBLIC TOGGLE */}
                  <td style={tdStyle}>
                    {story.audioFile && (
                      <Switch
                        colorScheme="green"
                        isChecked={story.isAudioPublished}
                        onChange={async () => {
                          try {
                            const res = await axios.patch(
                              `${API_BASE}/admin/story/${story._id}/toggle-publish`,
                              {},
                              { headers },
                            );

                            if (res.data.success) {
                              toast({
                                title: res.data.data.isAudioPublished
                                  ? 'Audio is now Public 🎧'
                                  : 'Audio moved to Draft',
                                status: 'success',
                                duration: 3000,
                              });

                              setStories((prev) =>
                                prev.map((s) =>
                                  s._id === story._id ? res.data.data : s,
                                ),
                              );
                            }
                          } catch (err) {
                            toast({
                              title: 'Update failed',
                              status: 'error',
                            });
                          }
                        }}
                      />
                    )}
                  </td>

                  {/* AUDIO PLAYER */}
                  <td style={tdStyle}>
                    {story.audioFile && (
                      <audio controls style={{ width: '200px' }}>
                        <source src={`${RAW_BASE_URL}${story.audioFile}`} />
                      </audio>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
