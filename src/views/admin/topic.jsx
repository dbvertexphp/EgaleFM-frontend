import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

import {
  MdSearch,
  MdTopic,
  MdAccountTree,
  MdEdit,
  MdDelete,
} from 'react-icons/md';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';
import { useDisclosure } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function TopicManagement() {
  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [topics, setTopics] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  const [editData, setEditData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    subjectId: '', // UI only (mapped to category)
    subSubjectId: '', // UI only (unused but kept for layout)
    chapterId: '',
    name: '',
    description: '',
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  // 🔹 Fetch Categories (mapped as Subject UI)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes] = await Promise.all([
          axios.get(`${baseUrl}api/admin/categories`, { headers }),
        ]);

        setCategories(catRes.data.data || []);
        fetchAllTopics();
      } catch {
        toast({ title: 'Data load error', status: 'error' });
      }
    };
    fetchData();
  }, []);

  // 🔹 When Category (Subject UI) changes → Load Chapters
  const handleSubjectChange = async (categoryId) => {
    setFormData({
      ...formData,
      subjectId: categoryId,
      chapterId: '',
    });

    if (!categoryId) return;

    try {
      const res = await axios.get(
        `${baseUrl}api/admin/story-chapters/category/${categoryId}`,
        { headers },
      );

      setChapters(res.data.data || []);
    } catch {
      toast({ title: 'Chapter load error', status: 'error' });
    }
  };

  // 🔹 Fetch Topics
  const fetchAllTopics = async () => {
    try {
      const url = formData.chapterId
        ? `${baseUrl}api/admin/story-topics/chapter/${formData.chapterId}`
        : `${baseUrl}api/admin/story-topics`;

      const res = await axios.get(url, { headers });
      setTopics(res.data.data || []);
    } catch {}
  };

  // 🔹 CREATE TOPIC (FormData + Audio)
  const handleCreate = async () => {
    if (!formData.chapterId || !formData.name || !audioFile) {
      return toast({
        title: 'Chapter, Topic Name & Audio required',
        status: 'warning',
      });
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append('title', formData.name);
      payload.append('description', formData.description);
      payload.append('storyChapter', formData.chapterId);
      payload.append('audio', audioFile);

      await axios.post(`${baseUrl}api/admin/story-topics`, payload, {
        headers,
      });

      toast({ title: 'Topic added successfully!', status: 'success' });

      setFormData({
        subjectId: '',
        subSubjectId: '',
        chapterId: '',
        name: '',
        description: '',
      });

      setAudioFile(null);
      fetchAllTopics();
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Failed to add topic',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 UPDATE TOPIC
  const handleUpdate = async () => {
    try {
      const payload = new FormData();
      payload.append('title', editData.title);
      payload.append('description', editData.description || '');

      if (editData.newAudio) {
        payload.append('audio', editData.newAudio);
      }

      await axios.patch(
        `${baseUrl}api/admin/story-topics/${editData._id}`,
        payload,
        { headers },
      );

      toast({ title: 'Topic updated successfully', status: 'success' });
      onClose();
      fetchAllTopics();
    } catch {
      toast({ title: 'Update failed', status: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this topic?')) return;
    try {
      await axios.delete(`${baseUrl}api/admin/story-topics/${id}`, { headers });
      toast({ title: 'Topic deleted', status: 'info' });
      fetchAllTopics();
    } catch {
      toast({ title: 'Delete failed', status: 'error' });
    }
  };

  const filteredTopics = topics.filter((t) =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card mb="20px" p="20px">
        <Flex align="center" mb="20px">
          <MdAccountTree size="24px" style={{ marginRight: '10px' }} />
          <Text fontSize="22px" fontWeight="700">
            Add Story Topic
          </Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="15px" mb="15px">
          <FormControl>
            <FormLabel>1. Story-Category</FormLabel>
            <Select
              placeholder="Select Story-Category"
              value={formData.subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>3. Story Chapter</FormLabel>
            <Select
              placeholder="Select Chapter"
              value={formData.chapterId}
              onChange={(e) =>
                setFormData({ ...formData, chapterId: e.target.value })
              }
              isDisabled={!formData.subjectId}
            >
              {chapters.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.title}
                </option>
              ))}
            </Select>
          </FormControl>
        </SimpleGrid>

        <Flex gap="15px" wrap="wrap" align="flex-end">
          <FormControl width={{ base: '100%', md: '35%' }}>
            <FormLabel>4. Story Topic Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              isDisabled={!formData.chapterId}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Audio File</FormLabel>
            <Input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
            />
          </FormControl>

          <FormControl flex="1">
            <FormLabel>Description</FormLabel>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
              modules={modules}
              style={{ height: '150px', marginBottom: '40px' }}
            />
          </FormControl>

          <Button
            colorScheme="brand"
            onClick={handleCreate}
            isLoading={loading}
            isDisabled={!formData.chapterId}
            leftIcon={<MdTopic />}
          >
            Save Topic
          </Button>
        </Flex>
      </Card>

      <Card p="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="18px" fontWeight="700">
            All Topics ({filteredTopics.length})
          </Text>

          <InputGroup maxW="300px">
            <InputLeftElement children={<MdSearch color="gray.300" />} />
            <Input
              placeholder="Search topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Table>
          <Thead>
            <Tr>
              <Th>Topic Name</Th>
              <Th>Chapter</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTopics.map((item) => (
              <Tr key={item._id}>
                <Td>{item.title}</Td>
                <Td>
                  <Badge colorScheme="purple">{item.storyChapter?.title}</Badge>
                </Td>
                <Td>
                  <Flex gap="2">
                    {/* <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setEditData(item);
                        onOpen();
                      }}
                    >
                      View
                    </Button> */}

                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => {
                        setEditData(item);
                        onOpen();
                      }}
                      leftIcon={<MdEdit />}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(item._id)}
                      leftIcon={<MdDelete />}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
      {/* VIEW / EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View / Edit Topic</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editData && (
              <>
                <FormControl mb="3">
                  <FormLabel>Topic Title</FormLabel>
                  <Input
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb="3">
                  <FormLabel>Description</FormLabel>
                  <ReactQuill
                    theme="snow"
                    value={editData.description || ''}
                    onChange={(value) =>
                      setEditData({ ...editData, description: value })
                    }
                    modules={modules}
                  />
                </FormControl>

                <FormControl mb="3">
                  <FormLabel>Current Audio</FormLabel>
                  {editData.audioUrl && (
                    <audio
                      controls
                      style={{ width: '100%' }}
                      src={`${baseUrl}${editData.audioUrl}`}
                    />
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Replace Audio (Optional)</FormLabel>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        newAudio: e.target.files[0],
                      })
                    }
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
