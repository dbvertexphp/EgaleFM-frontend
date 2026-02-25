// 'use client';

// import {
//   Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
//   Button, Input, FormControl, FormLabel, useToast, IconButton,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
//   useDisclosure, InputGroup, InputLeftElement, Select, Badge
// } from '@chakra-ui/react';
// import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function SubjectManagement() {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Form States
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [subjectName, setSubjectName] = useState('');
//   const [editData, setEditData] = useState({ id: '', name: '', courseId: '' });

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   // Headers Helper
//   const getHeaders = () => ({
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   // 1. Fetch Data (Backend Routes ke hisab se)
//   const fetchData = async () => {
//     try {
//       // Dono calls aapke /api/admin/... waale routes par jayengi
//       const [courseRes, subjectRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, getHeaders()),
//         axios.get(`${baseUrl}api/admin/subjects`, getHeaders())
//       ]);

//       // Controller mein aap 'data' key use kar rahe hain: res.status(200).json({ data: subjects })
//       setCourses(courseRes.data.data || []);
//       setSubjects(subjectRes.data.data || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       toast({ title: 'Failed to fetch courses', status: 'error' });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // 2. Add Subject (POST /api/admin/subjects)
//   const handleAddSubject = async () => {
//     if (!subjectName || !selectedCourse) {
//       return toast({ title: 'Please Select Course and Subject Name', status: 'warning' });
//     }
//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/subjects`,
//         { name: subjectName, courseId: selectedCourse },
//         getHeaders()
//       );
//       toast({ title: 'Subject Added!', status: 'success' });
//       setSubjectName('');
//       fetchData();
//     } catch (err) {
//       toast({ title: err.response?.data?.message || 'Error', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   // 3. Search Filter Logic
//   const filteredSubjects = subjects.filter((s) =>
//     s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // 4. Update Modal Setup
//   const openEditModal = (subject) => {
//     setEditData({
//       id: subject._id,
//       name: subject.name,
//       courseId: subject.courseId?._id || subject.courseId
//     });
//     onOpen();
//   };

//   // 5. Update Call (PATCH /api/admin/subjects/:id)
//   const handleUpdate = async () => {
//     try {
//       // Aapke route mein PATCH use ho raha hai update ke liye
//       await axios.patch(`${baseUrl}api/admin/subjects/${editData.id}`,
//         { name: editData.name, courseId: editData.courseId },
//         getHeaders()
//       );
//       toast({ title: 'Subject Added!', status: 'success' });
//       onClose();
//       fetchData();
//     } catch (err) {
//       toast({ title: ' Failed to Update ', status: 'error' });
//     }
//   };

//   // 6. Delete Call (DELETE /api/admin/subjects/:id)
//   const handleDelete = async (id) => {
//   if (window.confirm("Are you sure you want to delete this?")) {
//     try {
//       await axios.delete(`${baseUrl}api/admin/subjects/${id}`, getHeaders());
//       toast({ title: 'Subject has been deleted successfully', status: 'info' });
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Failed to delete subject', status: 'error' });
//     }
//   }
// };

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>

//       {/* ADD SECTION */}
//       <Card mb='20px' p='20px'>
//         <Text color={textColor} fontSize='22px' fontWeight='700' mb='20px'>Subject Management</Text>
//         <Flex gap='20px' align='flex-end' direction={{ base: 'column', md: 'row' }}>
//           <FormControl flex='1'>
//             <FormLabel>Course Selected</FormLabel>
//             <Select
//               placeholder='Select Course'
//               value={selectedCourse}
//               onChange={(e) => setSelectedCourse(e.target.value)}
//             >
//               {courses.map(course => (
//                 <option key={course._id} value={course._id}>{course.name}</option>
//               ))}
//             </Select>
//           </FormControl>
//           <FormControl flex='2'>
//             <FormLabel>Subject Name</FormLabel>
//             <Input
//               value={subjectName}
//               onChange={(e) => setSubjectName(e.target.value)}
//               placeholder='Ex: Biochemistry'
//             />
//           </FormControl>
//           <Button colorScheme='whatsapp' onClick={handleAddSubject} isLoading={loading} px='40px'>
//             Add Subject
//           </Button>
//         </Flex>
//       </Card>

//       {/* SEARCH & TABLE SECTION */}
//       <Card p='20px'>
//         <Flex direction={{ base: 'column', md: 'row' }} justify='space-between' align={{ md: 'center' }} mb='20px' gap='10px'>
//           <Text color={textColor} fontSize='18px' fontWeight='700'>All Subjects ({filteredSubjects.length})</Text>
//           <InputGroup maxW={{ md: '300px' }}>
//             <InputLeftElement pointerEvents='none'><MdSearch color='gray.300' /></InputLeftElement>
//             <Input
//               placeholder='Search...'
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
//                 <Th>Subject Name</Th>
//                 <Th>Course</Th>
//                 <Th>Status</Th>
//                 <Th textAlign="right">Actions</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filteredSubjects.map((s, i) => (
//                 <Tr key={s._id}>
//                   <Td fontSize="sm">{i + 1}</Td>
//                   <Td fontWeight='700' color={textColor}>{s.name}</Td>
//                   <Td>{s.courseId?.name || <Badge colorScheme="red">No Course</Badge>}</Td>
//                   <Td>
//                     <Badge colorScheme={s.status === 'active' ? 'green' : 'red'}>
//                       {s.status}
//                     </Badge>
//                   </Td>
//                   <Td textAlign="right">
//                     <IconButton
//                       variant="ghost"
//                       colorScheme='blue'
//                       icon={<MdEdit />}
//                       onClick={() => openEditModal(s)}
//                       mr='2'
//                     />
//                     <IconButton
//                       variant="ghost"
//                       colorScheme='red'
//                       icon={<MdDelete />}
//                       onClick={() => handleDelete(s._id)}
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
//           <ModalHeader>Update Subject</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <FormControl mb='4'>
//               <FormLabel>Course</FormLabel>
//               <Select
//                 value={editData.courseId}
//                 onChange={(e) => setEditData({...editData, courseId: e.target.value})}
//               >
//                 {courses.map(course => (
//                   <option key={course._id} value={course._id}>{course.name}</option>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl>
//               <FormLabel>Subject Name</FormLabel>
//               <Input
//                 value={editData.name}
//                 onChange={(e) => setEditData({...editData, name: e.target.value})}
//               />
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
  Select,
  Badge,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function SubjectManagement() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Form States
  const [selectedCourse, setSelectedCourse] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [editData, setEditData] = useState({ id: '', name: '', courseId: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Headers Helper
  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // 1. Fetch Data (Backend Routes ke hisab se)
  const fetchData = async () => {
    try {
      // Dono calls aapke /api/admin/... waale routes par jayengi
      const [courseRes, subjectRes] = await Promise.all([
        axios.get(`${baseUrl}api/admin/courses`, getHeaders()),
        axios.get(`${baseUrl}api/admin/subjects`, getHeaders()),
      ]);

      // Controller mein aap 'data' key use kar rahe hain: res.status(200).json({ data: subjects })
      setCourses(courseRes.data.data || []);
      setSubjects(subjectRes.data.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
      toast({ title: 'Failed to fetch courses', status: 'error' });
    } finally {
      setInitialLoading(false); // 🔥 important
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Add Subject (POST /api/admin/subjects)
  const handleAddSubject = async () => {
    if (!subjectName || !selectedCourse) {
      return toast({
        title: 'Please Select Course and Subject Name',
        status: 'warning',
      });
    }
    setLoading(true);
    try {
      await axios.post(
        `${baseUrl}api/admin/subjects`,
        { name: subjectName, courseId: selectedCourse },
        getHeaders(),
      );
      toast({ title: 'Subject Added!', status: 'success' });
      setSubjectName('');
      fetchData();
    } catch (err) {
      toast({ title: err.response?.data?.message || 'Error', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Search Filter Logic
  const filteredSubjects = subjects.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 4. Update Modal Setup
  const openEditModal = (subject) => {
    setEditData({
      id: subject._id,
      name: subject.name,
      courseId: subject.courseId?._id || subject.courseId,
    });
    onOpen();
  };

  // 5. Update Call (PATCH /api/admin/subjects/:id)
  const handleUpdate = async () => {
    try {
      // Aapke route mein PATCH use ho raha hai update ke liye
      await axios.patch(
        `${baseUrl}api/admin/subjects/${editData.id}`,
        { name: editData.name, courseId: editData.courseId },
        getHeaders(),
      );
      toast({ title: 'Subject Added!', status: 'success' });
      onClose();
      fetchData();
    } catch (err) {
      toast({ title: ' Failed to Update ', status: 'error' });
    }
  };

  // 6. Delete Call (DELETE /api/admin/subjects/:id)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await axios.delete(`${baseUrl}api/admin/subjects/${id}`, getHeaders());
        toast({
          title: 'Subject has been deleted successfully',
          status: 'info',
        });
        fetchData();
      } catch (err) {
        toast({ title: 'Failed to delete subject', status: 'error' });
      }
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* ADD SECTION */}
      {!initialLoading && subjects.length < 3 && (
        <Card mb="20px" p="20px">
          <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
            Subject Management
          </Text>
          <Flex
            gap="20px"
            align="flex-end"
            direction={{ base: 'column', md: 'row' }}
          >
            <FormControl flex="1">
              <FormLabel>Course Selected</FormLabel>
              <Select
                placeholder="Select Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl flex="2">
              <FormLabel>Subject Name</FormLabel>
              <Input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Ex: Biochemistry"
              />
            </FormControl>
            <Button
              colorScheme="whatsapp"
              onClick={handleAddSubject}
              isLoading={loading}
              px="40px"
            >
              Add Subject
            </Button>
          </Flex>
        </Card>
      )}
      {/* SEARCH & TABLE SECTION */}
      <Card p="20px">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ md: 'center' }}
          mb="20px"
          gap="10px"
        >
          <Text color={textColor} fontSize="18px" fontWeight="700">
            All Subjects ({filteredSubjects.length})
          </Text>
          <InputGroup maxW={{ md: '300px' }}>
            <InputLeftElement pointerEvents="none">
              <MdSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500">
            <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
              <Tr>
                <Th>S.No</Th>
                <Th>Subject Name</Th>
                <Th>Course</Th>
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSubjects.map((s, i) => (
                <Tr key={s._id}>
                  <Td fontSize="sm">{i + 1}</Td>
                  <Td fontWeight="700" color={textColor}>
                    {s.name}
                  </Td>
                  <Td>
                    {s.courseId?.name || (
                      <Badge colorScheme="red">No Course</Badge>
                    )}
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={s.status === 'active' ? 'green' : 'red'}
                    >
                      {s.status}
                    </Badge>
                  </Td>
                  <Td textAlign="right">
                    <IconButton
                      variant="ghost"
                      colorScheme="blue"
                      icon={<MdEdit />}
                      onClick={() => openEditModal(s)}
                      mr="2"
                    />
                    <IconButton
                      variant="ghost"
                      colorScheme="red"
                      icon={<MdDelete />}
                      onClick={() => handleDelete(s._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* UPDATE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Course</FormLabel>
              <Select
                value={editData.courseId}
                onChange={(e) =>
                  setEditData({ ...editData, courseId: e.target.value })
                }
              >
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Subject Name</FormLabel>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Save Changes
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
