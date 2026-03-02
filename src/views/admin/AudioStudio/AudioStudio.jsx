import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Textarea,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import axios from 'axios';

/* 🔥 IMPORTANT FIX
   .env ko touch nahi karna
   Isliye yaha manually /api add kar rahe hain
*/
const RAW_BASE_URL = process.env.REACT_APP_BASE_URL?.replace(/\/$/, '');
const API_BASE_URL = `${RAW_BASE_URL}/api`;

export default function AudioStudio() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [audioTitle, setAudioTitle] = useState('');
  const [audioDescription, setAudioDescription] = useState('');
  const [audioFile, setAudioFile] = useState(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem('token');

  // ✅ Fetch Approved Stories
  const fetchApprovedStories = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE_URL}/admin/user-stories?status=approved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setStories(res.data.data || []);
    } catch (error) {
      toast({
        title: 'Error fetching stories',
        description: error.response?.data?.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [token, toast]);

  useEffect(() => {
    fetchApprovedStories();
  }, [fetchApprovedStories]);

  const handleOpenModal = (story) => {
    setSelectedStory(story);
    setAudioTitle('');
    setAudioDescription('');
    setAudioFile(null);
    onOpen();
  };

  const handleUploadAudio = async () => {
    if (!audioTitle || !audioDescription || !audioFile) {
      toast({
        title: 'All fields are required',
        status: 'warning',
      });
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('audioTitle', audioTitle);
      formData.append('audioDescription', audioDescription);
      formData.append('audio', audioFile);

      await axios.put(
        `${API_BASE_URL}/admin/story/${selectedStory._id}/upload-audio`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: 'Story converted to Audio & Published 🎧',
        status: 'success',
      });

      onClose();
      fetchApprovedStories();
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message,
        status: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUnpublishAudio = async (storyId) => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/story/${storyId}/unpublish-audio`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast({
        title: 'Audio Unpublished Successfully',
        status: 'success',
      });

      fetchApprovedStories();
    } catch (error) {
      toast({
        title: 'Unpublish failed',
        description: error.response?.data?.message,
        status: 'error',
      });
    }
  };

  return (
    <Box p="20px">
      <Text fontSize="2xl" fontWeight="bold" mb="20px">
        Audio Studio 🎧
      </Text>

      {loading ? (
        <Flex justify="center" mt="40px">
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Story</Th>
              <Th>User</Th>
              <Th>Status</Th>
              <Th>Audio</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {stories.map((story) => (
              <Tr key={story._id}>
                <Td>{story.title}</Td>
                <Td>{story.user?.name}</Td>
                <Td>
                  <Badge colorScheme="green">Approved</Badge>
                </Td>

                <Td>
                  {story.isAudioPublished ? (
                    <Box>
                      <Badge colorScheme="blue" mb="2">
                        Published
                      </Badge>

                      {/* Audio Player */}
                      <audio
                        controls
                        controlsList="nodownload"
                        style={{ width: '220px', marginTop: '6px' }}
                        src={`${RAW_BASE_URL}${story.audioFile}`}
                      />

                      {/* Download Button */}
                      <Box mt="2">
                        <Button
                          size="xs"
                          colorScheme="green"
                          as="a"
                          href={`${RAW_BASE_URL}${story.audioFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Badge colorScheme="gray">Not Uploaded</Badge>
                  )}
                </Td>

                <Td>
                  {story.isAudioPublished ? (
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleUnpublishAudio(story._id)}
                    >
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      colorScheme="purple"
                      onClick={() => handleOpenModal(story)}
                    >
                      Upload Audio
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Publish Audio</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Audio Title"
              mb="10px"
              value={audioTitle}
              onChange={(e) => setAudioTitle(e.target.value)}
            />

            <Textarea
              placeholder="Audio Description"
              mb="10px"
              value={audioDescription}
              onChange={(e) => setAudioDescription(e.target.value)}
            />

            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleUploadAudio}
              isLoading={uploading}
            >
              Publish Audio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
