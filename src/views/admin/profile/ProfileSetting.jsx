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
  useToast,
  Avatar,
  Stack,
  Icon,
  InputGroup,
  InputLeftElement,
  Divider,
  SimpleGrid, // <--- Yeh line add karein
} from '@chakra-ui/react';
import { MdPerson, MdPhone, MdLock, MdEmail, MdCloudUpload } from 'react-icons/md';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function AdminProfile() {
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', profileImage: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${baseUrl}api/admin/profile`, { headers });
      if (res.data.success) setProfileData(res.data.data);
    } catch (err) {
      toast({ title: 'Error fetching profile', status: 'error' });
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // Profile Update (Name & Phone)
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await axios.put(`${baseUrl}api/admin/profile`, {
        name: profileData.name,
        phone: profileData.phone
      }, { headers });
      toast({ title: 'Profile Updated!', status: 'success' });
    } catch (err) {
      toast({ title: 'Update failed', status: 'error' });
    } finally { setLoading(false); }
  };

  // Image Upload Logic
 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // UI mein turant preview dikhane ke liye (Temporary Blob URL)
  const previewUrl = URL.createObjectURL(file);
  setProfileData((prev) => ({ ...prev, profileImage: previewUrl }));

  const formData = new FormData();
  formData.append('profileImage', file); // 'profileImage' wahi field name hai jo aapka multer backend me expect kar raha hai

  try {
    const res = await axios.put(`${baseUrl}api/admin/profile`, formData, {
      headers: { 
        ...headers, 
        'Content-Type': 'multipart/form-data' 
      }
    });

    if (res.data.success) {
      // Backend se return ho raha hai: res.data.data.profileImage
      // Hum state ko final backend path se update karenge
      setProfileData((prev) => ({ 
        ...prev, 
        profileImage: res.data.data.profileImage 
      }));
      
      toast({ title: 'Photo Updated Successfully!', status: 'success' });
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast({ title: 'Image upload failed', status: 'error' });
  }
};

  // Password Change Logic
  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword) {
      return toast({ title: 'Please fill passwords', status: 'warning' });
    }
    setPassLoading(true);
    try {
      await axios.post(`${baseUrl}api/admin/change-password`, passwords, { headers });
      toast({ title: 'Password Changed! Logging out...', status: 'success' });
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      toast({ title: err.response?.data?.message || 'Error', status: 'error' });
    } finally { setPassLoading(false); }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} px="20px">
      <Stack spacing="20px" maxW="800px" mx="auto">
        
        {/* SECTION 1: PHOTO & PROFILE INFO */}
        <Card p="30px">
          <Text color={textColor} fontSize="20px" fontWeight="700" mb="20px">
            Personal Information
          </Text>
          
          <Flex align="center" mb="30px" direction={{ base: 'column', md: 'row' }}>
            <Box position="relative">
              <Avatar 
                src={`${baseUrl}${profileData.profileImage}`} 
                name={profileData.name} 
                size="xl" h="100px" w="100px" border="2px solid" borderColor="blue.500"
              />
              <Button
                size="xs" colorScheme="blue" position="absolute" bottom="0" right="0" borderRadius="full"
                onClick={() => fileInputRef.current.click()}
              >
                <Icon as={MdCloudUpload} />
              </Button>
              <input type="file" ref={fileInputRef} hidden onChange={handleImageChange} accept="image/*" />
            </Box>
            <Box ms={{ md: '20px' }} mt={{ base: '10px', md: '0' }} textAlign={{ base: 'center', md: 'left' }}>
              <Text fontSize="lg" fontWeight="bold" color={textColor}>{profileData.name}</Text>
              <Text fontSize="sm" color="gray.500">{profileData.email}</Text>
            </Box>
          </Flex>

          <Stack spacing="15px">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="15px">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Full Name</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdPerson} color="gray.400" />} />
                  <Input value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600">Phone Number</FormLabel>
                <InputGroup>
                  <InputLeftElement children={<Icon as={MdPhone} color="gray.400" />} />
                  <Input value={profileData.phone || ''} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                </InputGroup>
              </FormControl>
            </SimpleGrid>
            <Button colorScheme="blue" onClick={handleUpdateProfile} isLoading={loading} alignSelf="flex-start" px="40px">
              Update Profile
            </Button>
          </Stack>
        </Card>

        {/* SECTION 2: SECURITY / PASSWORD */}
        <Card p="30px">
          <Text color={textColor} fontSize="20px" fontWeight="700" mb="20px">
            Security Settings
          </Text>
          <Stack spacing="15px">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Current Password</FormLabel>
              <InputGroup>
                <InputLeftElement children={<Icon as={MdLock} color="gray.400" />} />
                <Input type="password" placeholder="••••••••" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">New Password</FormLabel>
              <InputGroup>
                <InputLeftElement children={<Icon as={MdLock} color="gray.400" />} />
                <Input type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
              </InputGroup>
            </FormControl>
            <Box>
                <Button colorScheme="red" variant="solid" onClick={handleChangePassword} isLoading={passLoading} px="40px">
                Change Password
                </Button>
                <Text fontSize="xs" color="gray.500" mt="2">You will be logged out after a successful password change.</Text>
            </Box>
          </Stack>
        </Card>

      </Stack>
    </Box>
  );
}