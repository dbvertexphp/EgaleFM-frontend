/* eslint-disable */
'use client';

import {
  Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
  Button, Input, FormControl, FormLabel, useToast, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, InputGroup, InputLeftElement, Select, Badge, Tooltip
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSearch, MdInfoOutline } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function SubSubjectManagement() {
  const [subjects, setSubjects] = useState([]); 
  const [subSubjects, setSubSubjects] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState('');
  const [subSubjectName, setSubSubjectName] = useState('');
  const [description, setDescription] = useState('');

  const [editData, setEditData] = useState({ id: '', name: '', subjectId: '', description: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const secondaryColor = useColorModeValue('gray.600', 'gray.400');
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    try {
      const [subjectRes, subRes] = await Promise.all([
        axios.get(`${baseUrl}api/admin/subjects`, { headers }),
        axios.get(`${baseUrl}api/admin/sub-subjects`, { headers })
      ]);
      setSubjects(subjectRes.data.data || []);
      setSubSubjects(subRes.data.data || []);
    } catch (err) {
      toast({ title: 'Failed to load data', status: 'error' });
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSubSubject = async () => {
    if (!subSubjectName || !selectedSubject) {
      return toast({ title: 'Subject and sub-subject name are required', status: 'warning' });
    }
    setLoading(true);
    try {
      await axios.post(`${baseUrl}api/admin/sub-subjects`, 
        { name: subSubjectName, subjectId: selectedSubject, description: description }, 
        { headers }
      );
      toast({ title: 'Sub-subject added successfully', status: 'success' });
      setSubSubjectName('');
      setDescription('');
      fetchData();
    } catch (err) { 
      toast({ title: 'Failed to add sub-subject', status: 'error' }); 
    } finally { setLoading(false); }
  };

  const filteredData = subSubjects.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subjectId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditModal = (sub) => {
    setEditData({ 
      id: sub._id, 
      name: sub.name, 
      subjectId: sub.subjectId?._id || sub.subjectId,
      description: sub.description || ''
    });
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${baseUrl}api/admin/sub-subjects/${editData.id}`, 
        { name: editData.name, subjectId: editData.subjectId, description: editData.description },
        { headers }
      );
      toast({ title:'Updated successfully!', status: 'success' });
      onClose();
      fetchData();
    } catch (err) { 
      toast({ title: 'Failed to update', status: 'error' }); 
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this?")) {
      try {
        await axios.delete(`${baseUrl}api/admin/sub-subjects/${id}`, { headers });
        toast({ title: 'Subject has been deleted successfully', status: 'info' });
        fetchData();
      } catch (err) { toast({ title: 'Failed to delete subject', status: 'error' }); }
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      
      {/* INPUT CARD */}
      <Card mb='20px' p='20px'>
        <Text color={textColor} fontSize='22px' fontWeight='700' mb='20px'>Sub-Subject Management</Text>
        <Flex gap='15px' direction={{ base: 'column', md: 'row' }} align="flex-end">
          <FormControl flex='1'>
            <FormLabel fontSize="sm" fontWeight="700">Select Main Subject</FormLabel>
            <Select placeholder='Select Subject' value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl flex='1'>
            <FormLabel fontSize="sm" fontWeight="700">Sub-Subject Name</FormLabel>
            <Input value={subSubjectName} onChange={(e) => setSubSubjectName(e.target.value)} placeholder='Ex: Organic Chemistry' />
          </FormControl>
          <FormControl flex='1'>
            <FormLabel fontSize="sm" fontWeight="700">Description</FormLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Detail...' />
          </FormControl>
          <Button colorScheme='brand' onClick={handleAddSubSubject} isLoading={loading} px='30px'>Create</Button>
        </Flex>
      </Card>

      {/* LIST CARD */}
      <Card p='20px'>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text color={textColor} fontSize='18px' fontWeight='700'>Sub-Subjects List</Text>
          <InputGroup maxW='300px'>
            <InputLeftElement pointerEvents='none'><MdSearch color='gray.300' /></InputLeftElement>
            <Input placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Flex>

        <Box overflowX='auto'>
          <Table variant='simple' color="gray.500">
            <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
              <Tr>
                <Th>No.</Th>
                <Th>Sub-Subject</Th>
                <Th>Main Subject</Th>
                <Th>Description</Th> {/* Naya Column */}
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((item, i) => (
                <Tr key={item._id}>
                  <Td fontSize="sm">{i + 1}</Td>
                  <Td fontWeight='700' color={textColor}>{item.name}</Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle">{item.subjectId?.name || 'N/A'}</Badge>
                  </Td>
                  <Td maxW="200px">
                    <Tooltip label={item.description || "No description"}>
                      <Text isTruncated color={secondaryColor} fontSize="sm">
                        {item.description || "-"}
                      </Text>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Badge colorScheme={item.status === 'active' ? 'green' : 'red'}>{item.status}</Badge>
                  </Td>
                  <Td textAlign="right">
                    <IconButton variant="ghost" colorScheme='blue' icon={<MdEdit />} onClick={() => openEditModal(item)} mr='2' />
                    <IconButton variant="ghost" colorScheme='red' icon={<MdDelete />} onClick={() => handleDelete(item._id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* EDIT MODAL - Isme bhi UI same rahega */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Sub-Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb='4'>
              <FormLabel>Main Subject</FormLabel>
              <Select value={editData.subjectId} onChange={(e) => setEditData({...editData, subjectId: e.target.value})}>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Select>
            </FormControl>
            <FormControl mb='4'>
              <FormLabel>Sub-Subject Name</FormLabel>
              <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='brand' mr={3} onClick={handleUpdate}>Update</Button>
            <Button onClick={onClose} variant="ghost">Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}