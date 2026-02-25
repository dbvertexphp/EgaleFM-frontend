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
} from '@chakra-ui/react';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// Custom components
import Card from 'components/card/Card';

export default function ReferralSettings() {
  const [settings, setSettings] = React.useState({
    joiningReward: 0,
    maxReferralUsage: 0,
    rewardPerReferral: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [updateForm, setUpdateForm] = React.useState({
    joiningReward: '',
    maxReferralUsage: '',
    rewardPerReferral: '',
  });
  const [formErrors, setFormErrors] = React.useState({
    joiningReward: '',
    maxReferralUsage: '',
    rewardPerReferral: '',
  });
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Fetch referral settings
  const fetchReferralSettings = async () => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      setLoading(true);
      const response = await axios.get(`${baseUrl}api/admin/getReferralSetting`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response (Referral Settings):', response.data);

      if (!response.data.status || !response.data.setting) {
        throw new Error('Invalid response format: Expected referral settings');
      }

      setSettings(response.data.setting);
      setUpdateForm({
        joiningReward: response.data.setting.joiningReward.toString(),
        maxReferralUsage: response.data.setting.maxReferralUsage.toString(),
        rewardPerReferral: response.data.setting.rewardPerReferral.toString(),
      });
      setLoading(false);
    } catch (err) {
      console.error('Fetch Referral Settings Error:', err);
      if (
        err.response?.data?.message === 'Not authorized, token failed' ||
        err.response?.data?.message === 'Session expired or logged in on another device' ||
        err.response?.data?.message === 'Un-Authorized, You are not authorized to access this route.'
      ) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.message || 'Failed to fetch referral settings');
        setLoading(false);
      }
    }
  };

  // Update referral settings
  const updateReferralSettings = async () => {
    // Reset errors
    setFormErrors({ joiningReward: '', maxReferralUsage: '', rewardPerReferral: '' });

    // Validate inputs
    let hasError = false;
    const newErrors = { joiningReward: '', maxReferralUsage: '', rewardPerReferral: '' };

    if (!updateForm.joiningReward) {
      newErrors.joiningReward = 'Joining reward is required';
      hasError = true;
    } else if (!/^\d{1,4}$/.test(updateForm.joiningReward)) {
      newErrors.joiningReward = 'Joining reward must be a number up to 4 digits';
      hasError = true;
    }

    if (!updateForm.maxReferralUsage) {
      newErrors.maxReferralUsage = 'Max referral usage is required';
      hasError = true;
    } else if (!/^\d{1,2}$/.test(updateForm.maxReferralUsage)) {
      newErrors.maxReferralUsage = 'Max referral usage must be a number up to 2 digits';
      hasError = true;
    }

    if (!updateForm.rewardPerReferral) {
      newErrors.rewardPerReferral = 'Reward per referral is required';
      hasError = true;
    } else if (!/^\d{1,4}$/.test(updateForm.rewardPerReferral)) {
      newErrors.rewardPerReferral = 'Reward per referral must be a number up to 4 digits';
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

      const response = await axios.post(
        `${baseUrl}api/admin/updateReferralSetting`, // Assuming this is the update endpoint
        {
          joiningReward: parseInt(updateForm.joiningReward, 10),
          maxReferralUsage: parseInt(updateForm.maxReferralUsage, 10),
          rewardPerReferral: parseInt(updateForm.rewardPerReferral, 10),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Update Referral Settings Response:', response.data);
      toast({
        title: 'Success',
        description: 'Referral settings updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      await fetchReferralSettings();
    } catch (err) {
      console.error('Update Referral Settings Error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update referral settings',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setError(err.message || 'Failed to update referral settings');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'maxReferralUsage') {
      // Allow only numbers and limit to 2 digits
      if (value === '' || (/^\d{0,2}$/.test(value) && parseInt(value, 10) <= 99)) {
        setUpdateForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Allow only numbers and limit to 4 digits for joiningReward and rewardPerReferral
      if (value === '' || (/^\d{0,4}$/.test(value) && parseInt(value, 10) <= 9999)) {
        setUpdateForm((prev) => ({ ...prev, [name]: value }));
      }
    }
    // Clear error for the field when user starts typing
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  React.useEffect(() => {
    fetchReferralSettings();
  }, [navigate]);

  if (loading) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="25px"
        py="25px"
        borderRadius="20px"
        boxShadow="lg"
      >
        <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
          Loading...
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="25px"
        py="25px"
        borderRadius="20px"
        boxShadow="lg"
        style={{ marginTop: '80px' }}
      >
        <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
          Error: {error}
        </Text>
      </Card>
    );
  }

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="25px"
      py="25px"
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
          Referral Settings
        </Text>
      </Flex>
      <Box mb="30px">
        <Flex direction="column" gap="4">
          {/* <FormControl isInvalid={!!formErrors.joiningReward}>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Joining Reward (₹)
            </FormLabel>
            <Input
              name="joiningReward"
              type="text"
              value={updateForm.joiningReward}
              onChange={handleInputChange}
              placeholder="e.g., 50"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              maxLength={4}
            />
            {formErrors.joiningReward && (
              <FormErrorMessage>{formErrors.joiningReward}</FormErrorMessage>
            )}
          </FormControl> */}
          {/* <FormControl isInvalid={!!formErrors.maxReferralUsage}>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Max Referral Usage
            </FormLabel>
            <Input
              name="maxReferralUsage"
              type="text"
              value={updateForm.maxReferralUsage}
              onChange={handleInputChange}
              placeholder="e.g., 5"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              maxLength={2}
            />
            {formErrors.maxReferralUsage && (
              <FormErrorMessage>{formErrors.maxReferralUsage}</FormErrorMessage>
            )}
          </FormControl> */}
          <FormControl isInvalid={!!formErrors.rewardPerReferral}>
            <FormLabel fontSize="sm" fontWeight="500" color={textColor}>
              Reward Per Referral (₹)
            </FormLabel>
            <Input
              name="rewardPerReferral"
              type="text"
              value={updateForm.rewardPerReferral}
              onChange={handleInputChange}
              placeholder="e.g., 100"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              maxLength={4}
            />
            {formErrors.rewardPerReferral && (
              <FormErrorMessage>{formErrors.rewardPerReferral}</FormErrorMessage>
            )}
          </FormControl>
          <Button
            colorScheme="teal"
            onClick={updateReferralSettings}
            borderRadius="12px"
            fontSize="sm"
            fontWeight="600"
            textTransform="uppercase"
            bg="teal.600"
            _hover={{ bg: 'teal.700' }}
            _active={{ bg: 'teal.800' }}
          >
            Update Referral Settings
          </Button>
        </Flex>
      </Box>
      <Box>
        <Text fontSize="lg" fontWeight="600" mb="10px" color={textColor}>
          Current Settings
        </Text>
        <Flex direction="column" gap="2" border="1px" borderColor={borderColor} p="15px" borderRadius="8px">
          {/* <Text fontSize="sm" color={textColor}>
            <strong>Joining Reward:</strong> ₹{settings.joiningReward}
          </Text>
          <Text fontSize="sm" color={textColor}>
            <strong>Max Referral Usage:</strong> {settings.maxReferralUsage}
          </Text> */}
          <Text fontSize="sm" color={textColor}>
            <strong>Reward Per Referral:</strong> ₹{settings.rewardPerReferral}
          </Text>
          <Text fontSize="sm" color="gray.500">
            <strong>Last Updated:</strong> {new Date(settings.updatedAt).toLocaleString()}
          </Text>
        </Flex>
      </Box>
    </Card>
  );
}
