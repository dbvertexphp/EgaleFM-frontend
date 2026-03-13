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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  InputGroup,
  InputLeftElement,
  Switch,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function StoryCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [categoryName, setCategoryName] = useState('');
  const [categoryLogo, setCategoryLogo] = useState(null);
  const [editData, setEditData] = useState({ id: '', name: '' });
  const [editLogo, setEditLogo] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}api/admin/categories`,
        getHeaders(),
      );
      setCategories(response.data.data || []);
    } catch (err) {
      toast({
        title: 'Failed to fetch categories',
        status: 'error',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add Category
  const handleAddCategory = async () => {
    if (!categoryName) {
      return toast({
        title: 'Please enter category name',
        status: 'warning',
      });
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('name', categoryName);

      if (categoryLogo) {
        formData.append('categoryLogo', categoryLogo);
      }

      await axios.post(`${baseUrl}api/admin/categories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Category Created Successfully!',
        status: 'success',
      });

      setCategoryName('');
      setCategoryLogo(null);

      fetchCategories();
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Error adding category',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (category) => {
    try {
      setPublishingId(category._id);

      const url = category.isPublished
        ? `${baseUrl}api/admin/categories/${category._id}/unpublish`
        : `${baseUrl}api/admin/categories/${category._id}/publish`;

      await axios.patch(url, {}, getHeaders());

      toast({
        title: `Category ${
          category.isPublished ? 'Unpublished' : 'Published'
        } successfully`,
        status: 'success',
      });

      fetchCategories();
    } catch (err) {
      toast({
        title: 'Failed to update publish status',
        status: 'error',
      });
    } finally {
      setPublishingId(null);
    }
  };

  // Open Edit
  const openEditModal = (category) => {
    setEditData({ id: category._id, name: category.name });
    setEditLogo(null);
    onOpen();
  };

  // Update
const handleUpdate = async () => {
  try {
    const formData = new FormData();

    formData.append("name", editData.name);

    if (editLogo) {
      formData.append("categoryLogo", editLogo);
    }

    await axios.patch(
      `${baseUrl}api/admin/categories/${editData.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast({
      title: "Category Updated Successfully!",
      status: "success",
    });

    setEditLogo(null);
    onClose();
    fetchCategories();
  } catch (err) {
    toast({ title: "Update failed", status: "error" });
  }
};

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm('Delete this category permanently?')) {
      try {
        await axios.delete(
          `${baseUrl}api/admin/categories/${id}`,
          getHeaders(),
        );

        toast({ title: 'Category Deleted!', status: 'info' });
        fetchCategories();
      } catch (err) {
        toast({ title: 'Delete failed', status: 'error' });
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Add Section */}
      <Card mb="20px" p="20px">
        <Text fontSize="22px" fontWeight="700" mb="20px">
          Story Category Management
        </Text>

        <Flex gap="20px" align="flex-end">
          <FormControl>
            <FormLabel>Story-Category Name</FormLabel>
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Ex: Motivation, Horror, Love"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Category Logo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryLogo(e.target.files[0])}
            />
          </FormControl>
          <Button
            bg="linear-gradient(90deg, #6B46C1 0%, #B794F4 100%)"
            color="white"
            _hover={{ opacity: 0.9 }}
            onClick={handleAddCategory}
            isLoading={loading}
            px="40px"
          >
            Add Category
          </Button>
        </Flex>
      </Card>

      {/* Table Section */}
      <Card p="20px">
        <Flex justify="space-between" mb="20px">
          <Text fontSize="18px" fontWeight="700">
            All Story Categories
          </Text>

          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>S.No</Th>
                <Th>Logo</Th>
                <Th>Category Name</Th>
                <Th>Stories</Th>
                <Th>Published</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCategories.map((c, i) => (
                <Tr key={c._id}>
                  <Td>{i + 1}</Td>
                  <Td>
                    {c.logo ? (
                      <img
                        src={`${baseUrl}${c.logo}`}
                        alt="logo"
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #eee',
                        }}
                      />
                    ) : (
                      'No Logo'
                    )}
                  </Td>

                  <Td fontWeight="600" color="blue.500">
                    {c.name}
                  </Td>

                  <Td>{c.storyCount || 0}</Td>
                  <Td>
                    <Switch
                      isChecked={c.isPublished}
                      isDisabled={publishingId === c._id}
                      onChange={() => handleTogglePublish(c)}
                      colorScheme="green"
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<MdEdit />}
                      colorScheme="green"
                      onClick={() => openEditModal(c)}
                      mr="2"
                      size="sm"
                    />
                    <IconButton
                      icon={<MdDelete />}
                      colorScheme="red"
                      onClick={() => handleDelete(c._id)}
                      size="sm"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </FormControl>
              <FormControl>
    <FormLabel>Update Logo</FormLabel>
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => setEditLogo(e.target.files[0])}
    />
  </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save Changes
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
