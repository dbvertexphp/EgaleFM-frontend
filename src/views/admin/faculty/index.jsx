/* eslint-disable */
'use client';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  SimpleGrid,
  Textarea,
  useToast,
  Icon,
  Avatar,
  IconButton,
} from '@chakra-ui/react';
import { MdArrowBack, MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Agar aap routing use kar rahe hain
import Card from 'components/card/Card';

export default function AddFaculty() {
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  // const navigate = useNavigate(); // Back button ke liye

  // Colors
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = 'brand.500';
  const bgCard = useColorModeValue('white', 'navy.800');

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/';
  const token = localStorage.getItem('token');

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('degree', formData.degree);
    data.append('description', formData.description);
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await axios.post(`${baseUrl}api/faculty/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        toast({
          title: 'Success!',
          description: 'Faculty member added successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        // Clear Form
        setFormData({ name: '', degree: '', description: '' });
        setImage(null);
        setPreview(null);
      }
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} maxW="800px" mx="auto">
      {/* Header */}
      <Flex align="center" mb="20px">
        <IconButton
          icon={<MdArrowBack />}
          variant="ghost"
          fontSize="24px"
          onClick={() => window.history.back()}
          mr="10px"
        />
        <Text color={textColor} fontSize="2xl" fontWeight="700">
          Add New Faculty Member
        </Text>
      </Flex>

      <Card p="30px" bg={bgCard}>
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={1} spacing="25px">
            {/* Image Upload Section */}
            <Flex direction="column" align="center" mb="10px">
              <Avatar
                size="2xl"
                src={preview}
                name={formData.name || 'Faculty'}
                mb="15px"
                boxShadow="xl"
              />
              <FormControl>
                <FormLabel
                  htmlFor="image-upload"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  bg={useColorModeValue('gray.100', 'navy.700')}
                  p="10px 20px"
                  borderRadius="12px"
                  _hover={{ bg: 'gray.200' }}
                >
                  <Icon as={MdCloudUpload} mr="8px" />
                  <Text fontSize="sm" fontWeight="600">
                    {image ? 'Change Photo' : 'Upload Photo'}
                  </Text>
                </FormLabel>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={handleImageChange}
                />
              </FormControl>
            </Flex>

            {/* Name Input */}
            <FormControl isRequired>
              <FormLabel color={textColor} fontWeight="bold">
                Full Name
              </FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Dr. John Doe"
                variant="filled"
                borderRadius="12px"
                _focus={{ borderColor: brandColor }}
              />
            </FormControl>

            {/* Degree Input */}
            <FormControl isRequired>
              <FormLabel color={textColor} fontWeight="bold">
                Degree / Qualification
              </FormLabel>
              <Input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Ex: Ph.D in Computer Science"
                variant="filled"
                borderRadius="12px"
                _focus={{ borderColor: brandColor }}
              />
            </FormControl>

            {/* Description Input */}
            <FormControl isRequired>
              <FormLabel color={textColor} fontWeight="bold">
                Bio / Description
              </FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description about the faculty's experience..."
                rows={4}
                variant="filled"
                borderRadius="12px"
                _focus={{ borderColor: brandColor }}
              />
            </FormControl>

            {/* Action Buttons */}
            <Flex justify="flex-end" mt="10px">
              <Button
                variant="ghost"
                mr="10px"
                onClick={() => setFormData({ name: '', degree: '', description: '' })}
              >
                Reset
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                variant="solid"
                fontWeight="700"
                borderRadius="12px"
                px="40px"
                isLoading={loading}
                loadingText="Saving..."
              >
                Add Faculty
              </Button>
            </Flex>
          </SimpleGrid>
        </form>
      </Card>
    </Box>
  );
}