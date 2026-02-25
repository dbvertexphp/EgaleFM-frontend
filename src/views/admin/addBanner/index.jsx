/* eslint-disable */
'use client';

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import react-select for searchable dropdown
import Card from 'components/card/Card';
import { position } from 'stylis';

export default function BannerForm() {
  const [formData, setFormData] = React.useState({
    images: [],
    title: '',
    link: '',
    user_id: '',
    days: '',
    position: '',
  });
  const [formErrors, setFormErrors] = React.useState({
    title: '',
    link: '',
    user_id: '',
    days: '',
    position: '',
  });
  const [users, setUsers] = React.useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Fetch users for dropdown
  const fetchUsers = async () => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      const response = await axios.get(
        `${baseUrl}api/admin/getAllUsersForBanner`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log('user response', response);
      if (response.data && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        throw new Error('Invalid user data format');
      }
    } catch (err) {
      console.error('Fetch Users Error:', err);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [navigate]);

  // Handle file input for images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));
    setFormErrors((prev) => ({ ...prev, images: '' }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle react-select change
  const handleSelectChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      user_id: selectedOption ? selectedOption.value : '',
    }));
    setFormErrors((prev) => ({ ...prev, user_id: '' }));
  };

  // Submit banner
  const submitBanner = async () => {
    setFormErrors({ title: '', link: '', user_id: '' });

    let hasError = false;
    const newErrors = { title: '', link: '', user_id: '' };

    if (!formData.title) {
      newErrors.title = 'Title is required';
      hasError = true;
    }
    if (!formData.link) {
      newErrors.link = 'Link is required';
      hasError = true;
    } else if (!/^(https?:\/\/)/.test(formData.link)) {
      newErrors.link = 'Link must start with http:// or https://';
      hasError = true;
    }
    if (!formData.user_id) {
      newErrors.user_id = 'User ID is required';
      hasError = true;
    }

    if (!formData.days) {
      newErrors.days = 'Days is required';
      hasError = true;
    }

    if (!formData.position) {
      newErrors.position = 'Position is required';
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      return;
    }

    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }

      const selectedUser = users.find(
        (user) => user.unique_id === formData.user_id,
      );
      const userIdToSend = selectedUser ? selectedUser._id : '';

      const formDataToSend = new FormData();
      formData.images.forEach((file) => formDataToSend.append('images', file));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('user_id', userIdToSend);
      formDataToSend.append('days', formData.days);
      formDataToSend.append('position', formData.position);

      const response = await axios.post(
        `${baseUrl}api/banner/addBanner`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      // console.log('Add Banner Response:', response.data);
      toast({
        title: 'Success',
        description: 'Banner added successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      navigate('/admin/banner');
      setFormData({ images: [], title: '', link: '', user_id: '' });
    } catch (err) {
      console.error('Add Banner Error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to add banner',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  // Prepare options for react-select
  const userOptions = users.map((user) => ({
    value: user.unique_id,
    label: user.unique_id,
  }));

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="25px"
      py="25px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
      borderRadius="20px"
      boxShadow="lg"
      style={{ marginTop: '80px' }}
    >
      <Flex px="0px" mb="20px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Add Banner
        </Text>
      </Flex>
      <Box mb="30px">
        <Flex direction="column" gap="4">
          <FormControl isInvalid={!!formErrors.images} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Images
            </FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
            />
            {formErrors.images && (
              <FormErrorMessage>{formErrors.images}</FormErrorMessage>
            )}
          </FormControl>

          {/* Display selected images */}
          {formData.images.length > 0 && (
            <Box mt="4">
              <Text fontSize="sm" fontWeight="500" color={textColor} mb="2">
                Selected Images:
              </Text>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing="4">
                {formData.images.map((file, index) => (
                  <Image
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Selected image ${index + 1}`}
                    maxH="100px"
                    objectFit="cover"
                    borderRadius="8px"
                  />
                ))}
              </SimpleGrid>
            </Box>
          )}

          <FormControl isInvalid={!!formErrors.title} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Title
            </FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter banner title"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
            />
            {formErrors.title && (
              <FormErrorMessage>{formErrors.title}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.link} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Link
            </FormLabel>
            <Input
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="Enter link (e.g., https://example.com)"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
            />
            {formErrors.link && (
              <FormErrorMessage>{formErrors.link}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.user_id} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              User ID
            </FormLabel>
            <Select
              options={userOptions}
              value={userOptions.find(
                (option) => option.value === formData.user_id,
              )}
              onChange={handleSelectChange}
              placeholder="Search by unique ID"
              isClearable
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '8px',
                  borderColor: formErrors.user_id ? 'red.500' : 'gray.300',
                  '&:hover': {
                    borderColor: formErrors.user_id ? 'red.500' : 'gray.400',
                  },
                  boxShadow: 'none',
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
            {formErrors.user_id && (
              <FormErrorMessage>{formErrors.user_id}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.title} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Days
            </FormLabel>
            <Input
              name="days"
              value={formData.days}
              onChange={handleInputChange}
              placeholder="Enter Days"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
            />
            {formErrors.days && (
              <FormErrorMessage>{formErrors.days}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl isInvalid={!!formErrors.title} isRequired>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Position
            </FormLabel>
            <Input
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="Enter Position"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px blue.500',
              }}
            />
            {formErrors.position && (
              <FormErrorMessage>{formErrors.position}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            colorScheme="teal"
            onClick={submitBanner}
            borderRadius="12px"
            fontSize="sm"
            fontWeight="600"
            textTransform="uppercase"
            bg="teal.600"
            _hover={{ bg: 'teal.700' }}
            _active={{ bg: 'teal.800' }}
          >
            Submit Banner
          </Button>
        </Flex>
      </Box>
    </Card>
  );
}
