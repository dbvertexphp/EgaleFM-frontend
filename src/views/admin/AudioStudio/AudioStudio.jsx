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

  return (
    <Box p={{ base: '20px', md: '40px' }}>
      <Text fontSize="28px" fontWeight="bold" mb={8}>
        Audio Studio 🎧
      </Text>

      <VStack spacing={6} align="stretch">
        {stories.map((story) => {
          const previewFile = selectedFiles[story._id];
          const previewUrl = previewFile
            ? URL.createObjectURL(previewFile)
            : null;
          const serverAudioUrl = story.audioFile
            ? `${RAW_BASE_URL}${story.audioFile}`
            : null;
          const activeAudioSrc = previewUrl || serverAudioUrl;
          const isPreviewingFile = selectedFiles[story._id];

          return (
            <Box
              key={story._id}
              p={6}
              borderWidth="1px"
              borderRadius="xl"
              bg={cardBg}
              shadow="md"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Box>
                  <Text fontSize="18px" fontWeight="600">
                    {story.title}
                  </Text>
                  <Badge
                    colorScheme={
                      isPreviewingFile
                        ? publishStatuses[story._id]
                          ? 'green'
                          : 'gray'
                        : story.isAudioPublished
                          ? 'green'
                          : 'gray'
                    }
                  >
                    {isPreviewingFile
                      ? publishStatuses[story._id]
                        ? 'LIVE (Preview)'
                        : 'DRAFT (Preview)'
                      : story.isAudioPublished
                        ? 'LIVE'
                        : 'DRAFT'}
                  </Badge>
                </Box>

                {/* Publish Toggle - Only shown when file selected (preview mode) */}
                {isPreviewingFile && (
                  <FormControl display="flex" alignItems="center" width="auto">
                    <FormLabel
                      htmlFor={`pub-${story._id}`}
                      mb="0"
                      fontSize="sm"
                      fontWeight="bold"
                    >
                      Publish on Upload
                    </FormLabel>
                    <Switch
                      id={`pub-${story._id}`}
                      colorScheme="green"
                      isChecked={
                        publishStatuses[story._id] !== undefined
                          ? publishStatuses[story._id]
                          : false
                      }
                      onChange={(e) =>
                        handlePublishStatusChange(story._id, e.target.checked)
                      }
                    />
                  </FormControl>
                )}
              </Flex>

              <HStack spacing={4} mb={6}>
                {story.textFile && (
                  <Button
                    as="a"
                    href={`${RAW_BASE_URL}${story.textFile}`}
                    target="_blank"
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                  >
                    Preview Text
                  </Button>
                )}

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
                  cursor="pointer"
                >
                  {story.audioFile ? 'Change Audio' : 'Select Audio'}
                </Button>

                {previewFile && (
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={() => handleConfirmUpload(story._id)}
                    isLoading={uploadingId === story._id}
                  >
                    Upload
                  </Button>
                )}
              </HStack>

              {/* Audio Player Box */}
              {/* {activeAudioSrc && (
                <Box
                  p={4}
                  bg={playerBg}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor="teal.400"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    mb={2}
                    color="teal.500"
                    letterSpacing="wider"
                  >
                    {previewUrl ? 'PREVIEW MODE (NOT SAVED)' : 'ACTIVE AUDIO'}
                  </Text>
                  <Flex align="center" gap={4}>
                    <audio
                      key={activeAudioSrc}
                      controls
                      style={{ flex: 1, height: '40px' }}
                    >
                      <source src={activeAudioSrc} />
                    </audio>

                    <IconButton
                      as="a"
                      href={activeAudioSrc}
                      download={`audio-${story.title}.mp3`}
                      icon={<DownloadIcon />}
                      aria-label="Download"
                      colorScheme="teal"
                      size="md"
                      isRound
                    />
                  </Flex>
                </Box>
              )} */}

              {story.audioFile && (
                <Box
                  p={4}
                  bg={playerBg}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderColor="green.400"
                >
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    mb={2}
                    color="green.500"
                  >
                    {story.isAudioPublished ? 'LIVE AUDIO' : 'DRAFT AUDIO'}
                  </Text>

                  <audio controls style={{ width: '100%' }}>
                    <source src={`${RAW_BASE_URL}${story.audioFile}`} />
                  </audio>
                </Box>
              )}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
