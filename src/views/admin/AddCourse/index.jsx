// 'use client';

// import {
//   Box,
//   Flex,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
//   useColorModeValue,
//   Button,
//   Input,
//   FormControl,
//   FormLabel,
//   useToast,
//   IconButton,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   InputGroup,
//   InputLeftElement,
// } from '@chakra-ui/react';
// import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';
// import { Switch } from '@chakra-ui/react';

// export default function CourseManagement() {
//   const [courses, setCourses] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [publishingId, setPublishingId] = useState(null);
//   const [initialLoading, setInitialLoading] = useState(true);

//   // Form States
//   const [courseName, setCourseName] = useState('');
//   const [courseYear, setCourseYear] = useState(''); // Naya State Year ke liye
//   const [editData, setEditData] = useState({ id: '', name: '', year: '' });

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   const getHeaders = () => ({
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   const handleTogglePublish = async (course) => {
//     try {
//       setPublishingId(course._id);

//       const url = course.isPublished
//         ? `${baseUrl}api/admin/courses/${course._id}/unpublish`
//         : `${baseUrl}api/admin/courses/${course._id}/publish`;

//       await axios.patch(url, {}, getHeaders());

//       toast({
//         title: `Course ${
//           course.isPublished ? 'Unpublished' : 'Published'
//         } successfully`,
//         status: 'success',
//       });

//       fetchCourses();
//     } catch (err) {
//       toast({
//         title: 'Failed to update publish status',
//         status: 'error',
//       });
//     } finally {
//       setPublishingId(null);
//     }
//   };

//   // 1. Fetch All Courses
//   const fetchCourses = async () => {
//     try {
//       const response = await axios.get(
//         `${baseUrl}api/admin/courses`,
//         getHeaders(),
//       );
//       setCourses(response.data.data || []);
//     } catch (err) {
//       console.error('Fetch Error:', err);
//       toast({
//         title: 'Failed to fetch courses',
//         status: 'error',
//         duration: 3000,
//       });
//     } finally {
//       setInitialLoading(false); // 🔥 Ye line important hai
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // 2. Search Filter
//   const filteredCourses = courses.filter((c) =>
//     c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   // 3. Add Course (Ab Year bhi bhejega)
//   const handleAddCourse = async () => {
//     if (!courseName || !courseYear) {
//       return toast({
//         title: 'Please enter name and year',
//         status: 'warning',
//         duration: 2000,
//       });
//     }
//     setLoading(true);
//     try {
//       await axios.post(
//         `${baseUrl}api/admin/courses`,
//         { name: courseName, year: courseYear },
//         getHeaders(),
//       );
//       toast({
//         title: 'Course Created Successfully!',
//         status: 'success',
//         duration: 2000,
//       });
//       setCourseName('');
//       setCourseYear('');
//       fetchCourses();
//     } catch (err) {
//       toast({
//         title: err.response?.data?.message || 'Error adding course',
//         status: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 4. Update Logic
//   const openEditModal = (course) => {
//     setEditData({ id: course._id, name: course.name, year: course.year || '' });
//     onOpen();
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.patch(
//         `${baseUrl}api/admin/courses/${editData.id}`,
//         { name: editData.name, year: editData.year },
//         getHeaders(),
//       );
//       toast({ title: 'Course Updated Successfully!', status: 'success' });
//       onClose();
//       fetchCourses();
//     } catch (err) {
//       toast({ title: 'Update failed', status: 'error' });
//     }
//   };

//   // 5. Delete Logic
//   const handleDelete = async (id) => {
//     if (
//       window.confirm('Are you sure you want to delete this course permanently?')
//     ) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/courses/${id}`, getHeaders());
//         toast({ title: 'Course Permanently Deleted!', status: 'info' });
//         fetchCourses();
//       } catch (err) {
//         toast({ title: 'Delete failed', status: 'error' });
//       }
//     }
//   };

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
//       {/* ADD SECTION - Year Input Added */}
//       {/* ADD SECTION - Only show if no course exists */}
//       {!initialLoading && courses.length === 0 && (
//         <Card mb="20px" p="20px">
//           <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
//             Course Management
//           </Text>

//           <Flex
//             gap="20px"
//             align="flex-end"
//             direction={{ base: 'column', md: 'row' }}
//           >
//             <FormControl>
//               <FormLabel>Course Name</FormLabel>
//               <Input
//                 value={courseName}
//                 onChange={(e) => setCourseName(e.target.value)}
//                 placeholder="Ex: Web Development"
//               />
//             </FormControl>

//             <FormControl>
//               <FormLabel>Year</FormLabel>
//               <Input
//                 value={courseYear}
//                 onChange={(e) => setCourseYear(e.target.value)}
//                 placeholder="Ex: 2026"
//               />
//             </FormControl>

//             <Button
//               colorScheme="blue"
//               onClick={handleAddCourse}
//               isLoading={loading}
//               px="40px"
//             >
//               Add Course
//             </Button>
//           </Flex>
//         </Card>
//       )}

//       {/* SEARCH & TABLE SECTION - Year Column Added */}
//       <Card p="20px">
//         <Flex
//           direction={{ base: 'column', md: 'row' }}
//           justify="space-between"
//           align={{ md: 'center' }}
//           mb="20px"
//           gap="10px"
//         >
//           <Text color={textColor} fontSize="18px" fontWeight="700">
//             All Courses List
//           </Text>
//           <InputGroup maxW={{ md: '300px' }}>
//             <InputLeftElement pointerEvents="none">
//               <MdSearch color="gray.300" />
//             </InputLeftElement>
//             <Input
//               placeholder="Search by course name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </InputGroup>
//         </Flex>

//         <Box overflowX="auto">
//           <Table variant="simple">
//             <Thead bg="gray.50">
//               <Tr>
//                 <Th>S.No</Th>
//                 <Th>Course Name</Th>
//                 <Th>Year</Th>
//                 <Th>Status</Th>
//                 <Th>Published</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filteredCourses.map((c, i) => (
//                 <Tr key={c._id}>
//                   <Td>{i + 1}</Td>
//                   <Td fontWeight="600" color="blue.500">
//                     {c.name}
//                   </Td>
//                   <Td>{c.year || 'N/A'}</Td>
//                   <Td>
//                     <Text
//                       fontSize="sm"
//                       color={c.status === 'active' ? 'green.500' : 'red.500'}
//                       textTransform="capitalize"
//                     >
//                       {c.status}
//                     </Text>
//                   </Td>
//                   <Td>
//                     <Switch
//                       isChecked={c.isPublished}
//                       isDisabled={
//                         publishingId === c._id || c.status !== 'active'
//                       }
//                       onChange={() => handleTogglePublish(c)}
//                       colorScheme="green"
//                       size="lg"
//                     />
//                   </Td>

//                   <Td>
//                     <IconButton
//                       icon={<MdEdit />}
//                       colorScheme="green"
//                       onClick={() => openEditModal(c)}
//                       mr="2"
//                       size="sm"
//                     />
//                     <IconButton
//                       icon={<MdDelete />}
//                       colorScheme="red"
//                       onClick={() => handleDelete(c._id)}
//                       size="sm"
//                     />
//                   </Td>
//                 </Tr>
//               ))}
//               {filteredCourses.length === 0 && (
//                 <Tr>
//                   <Td colSpan={5} textAlign="center" py="4">
//                     No matching courses found
//                   </Td>
//                 </Tr>
//               )}
//             </Tbody>
//           </Table>
//         </Box>
//       </Card>

//       {/* UPDATE MODAL - Year Field Added */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Edit Course Details</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Flex direction="column" gap="15px">
//               <FormControl>
//                 <FormLabel>Course Name</FormLabel>
//                 <Input
//                   value={editData.name}
//                   onChange={(e) =>
//                     setEditData({ ...editData, name: e.target.value })
//                   }
//                 />
//               </FormControl>
//               <FormControl>
//                 <FormLabel>Year</FormLabel>
//                 <Input
//                   value={editData.year}
//                   onChange={(e) =>
//                     setEditData({ ...editData, year: e.target.value })
//                   }
//                 />
//               </FormControl>
//             </Flex>
//           </ModalBody>
//           <ModalFooter>
//             <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
//               Save Changes
//             </Button>
//             <Button onClick={onClose}>Cancel</Button>
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
  const [editData, setEditData] = useState({ id: '', name: '' });

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
      await axios.post(
        `${baseUrl}api/admin/categories`,
        { name: categoryName },
        getHeaders(),
      );

      toast({
        title: 'Category Created Successfully!',
        status: 'success',
      });

      setCategoryName('');
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
    onOpen();
  };

  // Update
  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${baseUrl}api/admin/categories/${editData.id}`,
        { name: editData.name },
        getHeaders(),
      );

      toast({ title: 'Category Updated Successfully!', status: 'success' });
      onClose();
      fetchCategories();
    } catch (err) {
      toast({ title: 'Update failed', status: 'error' });
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
                <Th>Category Name</Th>
                <Th>Published</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCategories.map((c, i) => (
                <Tr key={c._id}>
                  <Td>{i + 1}</Td>
                  <Td fontWeight="600" color="blue.500">
                    {c.name}
                  </Td>
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
