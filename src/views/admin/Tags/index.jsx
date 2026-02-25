// 'use client';

// import {
//   Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
//   Button, Input, FormControl, FormLabel, useToast, IconButton,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
//   useDisclosure, InputGroup, InputLeftElement, Select, Badge, Textarea
// } from '@chakra-ui/react';
// import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function TagManagement() {
//   const [chapters, setChapters] = useState([]); 
//   const [tags, setTags] = useState([]); 
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Form States
//   const [selectedChapter, setSelectedChapter] = useState('');
//   const [tagName, setTagName] = useState('');
//   const [tagDescription, setTagDescription] = useState('');
  
//   // Update State
//   const [editData, setEditData] = useState({ id: '', name: '', description: '', status: '' });

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
  
//   const getHeaders = () => ({
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   // 1. Fetch Chapters and Tags
//   const fetchData = async () => {
//     try {
//       const [chapterRes, tagRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/chapters`, getHeaders()), // Adjust endpoint if different
//         axios.get(`${baseUrl}api/admin/tags`, getHeaders())
//       ]);

//       setChapters(chapterRes.data.data || []);
//       setTags(tagRes.data.data || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       toast({ title: 'Failed to fetch data', status: 'error', isClosable: true });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // 2. Add Tag (POST /api/admin/tags)
//   const handleAddTag = async () => {
//     if (!tagName || !selectedChapter) {
//       return toast({ title: 'Chapter and Tag Name are required', status: 'warning' });
//     }
//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/tags`, 
//         { 
//           chapterId: selectedChapter, 
//           name: tagName, 
//           description: tagDescription 
//         }, 
//         getHeaders()
//       );
//       toast({ title: 'Tag Created!', status: 'success' });
//       setTagName('');
//       setTagDescription('');
//       fetchData();
//     } catch (err) { 
//       toast({ title: err.response?.data?.message || 'Error', status: 'error' }); 
//     } finally { setLoading(false); }
//   };

//   // 3. Search Filter Logic
//   const filteredTags = tags.filter((t) =>
//     t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     t.chapterId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // 4. Update Modal Setup
//   const openEditModal = (tag) => {
//     setEditData({ 
//       id: tag._id, 
//       name: tag.name, 
//       description: tag.description || '',
//       status: tag.status
//     });
//     onOpen();
//   };

//   // 5. Update Call (PATCH /api/admin/tags/:id)
//   const handleUpdate = async () => {
//     try {
//       await axios.patch(`${baseUrl}api/admin/tags/${editData.id}`, 
//         { 
//           name: editData.name, 
//           description: editData.description,
//           status: editData.status 
//         },
//         getHeaders()
//       );
//       toast({ title: 'Tag Updated Successfully!', status: 'success' });
//       onClose();
//       fetchData();
//     } catch (err) { 
//       toast({ title: 'Failed to Update', status: 'error' }); 
//     }
//   };

//   // 6. Delete Call (DELETE /api/admin/tags/:id)
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this tag?")) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/tags/${id}`, getHeaders());
//         toast({ title: 'Tag deleted successfully', status: 'info' });
//         fetchData();
//       } catch (err) {
//         toast({ title: 'Failed to delete tag', status: 'error' });
//       }
//     }
//   };

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      
//       {/* ADD SECTION */}
//       <Card mb='20px' p='20px'>
//         <Text color={textColor} fontSize='22px' fontWeight='700' mb='20px'>Tag Management</Text>
//         <Flex gap='20px' direction='column'>
//           <Flex gap='20px' direction={{ base: 'column', md: 'row' }}>
//             <FormControl flex='1'>
//               <FormLabel>Chapter</FormLabel>
//               <Select 
//                 placeholder='Select Chapter' 
//                 value={selectedChapter} 
//                 onChange={(e) => setSelectedChapter(e.target.value)}
//               >
//                 {chapters.map(ch => (
//                   <option key={ch._id} value={ch._id}>{ch.name}</option>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl flex='2'>
//               <FormLabel>Tag Name</FormLabel>
//               <Input 
//                 value={tagName} 
//                 onChange={(e) => setTagName(e.target.value)} 
//                 placeholder='Ex: High Priority' 
//               />
//             </FormControl>
//           </Flex>
          
//           <FormControl>
//             <FormLabel>Description (Optional)</FormLabel>
//             <Textarea 
//               value={tagDescription} 
//               onChange={(e) => setTagDescription(e.target.value)} 
//               placeholder='Briefly describe this tag...' 
//             />
//           </FormControl>
          
//           <Button colorScheme='whatsapp' onClick={handleAddTag} isLoading={loading} alignSelf='flex-end' px='40px'>
//             Create Tag
//           </Button>
//         </Flex>
//       </Card>

//       {/* SEARCH & TABLE SECTION */}
//       <Card p='20px'>
//         <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' align={{ md: 'center' }} mb='20px' gap='10px'>
//           <Text color={textColor} fontSize='18px' fontWeight='700'>All Tags ({filteredTags.length})</Text>
//           <InputGroup maxW={{ md: '300px' }}>
//             <InputLeftElement pointerEvents='none'><MdSearch color='gray.300' /></InputLeftElement>
//             <Input 
//               placeholder='Search by tag or chapter...' 
//               value={searchTerm} 
//               onChange={(e) => setSearchTerm(e.target.value)} 
//             />
//           </InputGroup>
//         </Flex>

//         <Box overflowX='auto'>
//           <Table variant='simple' color="gray.500">
//             <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
//               <Tr>
//                 <Th>S.No</Th>
//                 <Th>Tag Name</Th>
//                 <Th>Chapter</Th>
//                 <Th>Status</Th>
//                 <Th textAlign="right">Actions</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filteredTags.map((tag, i) => (
//                 <Tr key={tag._id}>
//                   <Td fontSize="sm">{i + 1}</Td>
//                   <Td>
//                     <Box>
//                       <Text fontWeight='700' color={textColor}>{tag.name}</Text>
//                       <Text fontSize='xs' color='gray.400'>{tag.description}</Text>
//                     </Box>
//                   </Td>
//                   <Td>{tag.chapterId?.name || <Badge colorScheme="red">No Chapter</Badge>}</Td>
//                   <Td>
//                     <Badge colorScheme={tag.status === 'active' ? 'green' : 'red'}>
//                       {tag.status}
//                     </Badge>
//                   </Td>
//                   <Td textAlign="right">
//                     <IconButton 
//                       variant="ghost" 
//                       colorScheme='blue' 
//                       icon={<MdEdit />} 
//                       onClick={() => openEditModal(tag)} 
//                       mr='2' 
//                     />
//                     <IconButton 
//                       variant="ghost" 
//                       colorScheme='red' 
//                       icon={<MdDelete />} 
//                       onClick={() => handleDelete(tag._id)} 
//                     />
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </Box>
//       </Card>

//       {/* UPDATE MODAL */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Update Tag</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl mb='4'>
//               <FormLabel>Tag Name</FormLabel>
//               <Input 
//                 value={editData.name} 
//                 onChange={(e) => setEditData({...editData, name: e.target.value})} 
//               />
//             </FormControl>
//             <FormControl mb='4'>
//               <FormLabel>Description</FormLabel>
//               <Textarea 
//                 value={editData.description} 
//                 onChange={(e) => setEditData({...editData, description: e.target.value})} 
//               />
//             </FormControl>
//             <FormControl>
//               <FormLabel>Status</FormLabel>
//               <Select 
//                 value={editData.status} 
//                 onChange={(e) => setEditData({...editData, status: e.target.value})}
//               >
//                 <option value='active'>Active</option>
//                 <option value='inactive'>Inactive</option>
//               </Select>
//             </FormControl>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme='blue' mr={3} onClick={handleUpdate}>Save Changes</Button>
//             <Button onClick={onClose} variant="ghost">Cancel</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//     </Box>
//   );
// }

'use client';
import { Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, Button, Input, useToast, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { MdDelete, MdEdit, MdAdd } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function TagCRUD() {
  const [tags, setTags] = useState([]);
  const [name, setName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editTag, setEditTag] = useState({ id: '', name: '' });
  
  const toast = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

  const fetchTags = async () => {
    const res = await axios.get(`${baseUrl}api/admin/tags`, authHeader);
    setTags(res.data.data);
  };

  useEffect(() => { fetchTags(); }, []);

  const handleAdd = async () => {
    if (!name) return;
    try {
      await axios.post(`${baseUrl}api/admin/tags`, { name }, authHeader);
      setName('');
      fetchTags();
      toast({ title: 'Tag added', status: 'success', position: 'top-right' });
    } catch (e) { toast({ title: 'Error', status: 'error' }); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete?")) {
      await axios.delete(`${baseUrl}api/admin/tags/${id}`, authHeader);
      fetchTags();
    }
  };

  const handleUpdate = async () => {
    await axios.patch(`${baseUrl}api/admin/tags/${editTag.id}`, { name: editTag.name }, authHeader);
    onClose();
    fetchTags();
  };

  return (
    <Box pt={{ base: '130px', md: '80px' }}>
          <Text fontSize='22px' fontWeight='700' mb='20px'>Tags</Text>
      <Card p='20px' mb='20px'>
        <Flex gap='10px'>
          <Input placeholder='Enter Tag Name (e.g. Pathology)' value={name} onChange={(e) => setName(e.target.value)} />
          <Button leftIcon={<MdAdd />} colorScheme='teal' onClick={handleAdd}>Add Tag</Button>
        </Flex>
      </Card>

      <Card p='20px'>
        <Table variant='simple'>
          <Thead>
            <Tr><Th>Tag ID</Th><Th>Name</Th><Th textAlign='right'>Actions</Th></Tr>
          </Thead>
          <Tbody>
            {tags.map((t) => (
              <Tr key={t._id}>
                <Td fontSize='xs' color='gray.400'>{t._id}</Td>
                <Td fontWeight='700'>{t.name}</Td>
                <Td textAlign='right'>
                  <IconButton icon={<MdEdit />} onClick={() => { setEditTag({id: t._id, name: t.name}); onOpen(); }} variant='ghost' colorScheme='blue' />
                  <IconButton icon={<MdDelete />} onClick={() => handleDelete(t._id)} variant='ghost' colorScheme='red' />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay /><ModalContent><ModalHeader>Edit Tag</ModalHeader>
          <ModalBody><Input value={editTag.name} onChange={(e) => setEditTag({...editTag, name: e.target.value})} /></ModalBody>
          <ModalFooter><Button colorScheme='blue' onClick={handleUpdate}>Update</Button></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}