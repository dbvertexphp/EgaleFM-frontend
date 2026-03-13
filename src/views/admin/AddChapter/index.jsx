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
//   Select,
//   Badge,
//   Image,
//   Switch,
// } from '@chakra-ui/react';
// import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';

// export default function ChapterManagement() {
//   const [courses, setCourses] = useState([]); // ✅ ADD

//   const [subjects, setSubjects] = useState([]);
//   const [subSubjects, setSubSubjects] = useState([]);

//   const [chapters, setChapters] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Image State
//   const [chapterImage, setChapterImage] = useState(null);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);

//   // Form State (Backend-aligned)
//   const [formData, setFormData] = useState({
//     courseId: '',
//     subjectId: '',
//     subSubjectId: '',
//     name: '',
//     description: '',
//     weightage: 0,
//     isFreePreview: false,
//   });

//   const [editData, setEditData] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   // 🔹 Fetch Subjects + Chapters
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       const [courseRes, subjectRes, chapterRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, { headers }),
//         axios.get(`${baseUrl}api/admin/subjects`, { headers }),
//         axios.get(`${baseUrl}api/admin/chapters`, { headers }),
//       ]);

//       setCourses(courseRes.data.data || []);
//       setSubjects(subjectRes.data.data || []);
//       setChapters(chapterRes.data.data || []);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem('token');
//         window.location.href = '/auth/sign-in';
//       }

//       toast({
//         title: err.response?.data?.message || 'Data load failed',
//         status: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (!token) {
//       window.location.href = '/auth/sign-in';
//       return;
//     }

//     fetchData();
//   }, [token]);

//   const handleCourseChange = async (courseId) => {
//     // 🔥 FULL RESET WHEN COURSE CHANGES
//     setFormData({
//       courseId,
//       subjectId: '',
//       subSubjectId: '',
//       name: '',
//       description: '',
//       weightage: 0,
//       isFreePreview: false,
//     });

//     setSubjects([]);
//     setSubSubjects([]);

//     if (!courseId) return;

//     setLoadingSubjects(true);

//     try {
//       const res = await axios.get(
//         `${baseUrl}api/admin/subjects?courseId=${courseId}`,
//         { headers },
//       );

//       setSubjects(res.data.data || []);
//     } catch (err) {
//       toast({ title: 'Subject load error', status: 'error' });
//     } finally {
//       setLoadingSubjects(false);
//     }
//   };

//   // 🔹 Load Sub-Subjects when Subject changes
//   // const handleSubjectChange = async (subjectId) => {
//   //   setFormData({
//   //     ...formData,
//   //     subjectId,
//   //     subSubjectId: '',
//   //   });

//   //   setSubSubjects([]);

//   //   if (!subjectId) return;

//   //   try {
//   //     const res = await axios.get(
//   //       `${baseUrl}api/admin/sub-subjects?subjectId=${subjectId}`,
//   //       { headers },
//   //     );
//   //     setSubSubjects(res.data.data || []);
//   //   } catch (err) {
//   //     toast({ title: 'Sub-Subject load error', status: 'error' });
//   //   }
//   // };
//   const handleSubjectChange = async (subjectId) => {
//     setFormData((prev) => ({
//       ...prev,
//       subjectId,
//       subSubjectId: '',
//     }));

//     setSubSubjects([]);

//     if (!subjectId) return;

//     try {
//       const res = await axios.get(
//         `${baseUrl}api/admin/sub-subjects?subjectId=${subjectId}`,
//         { headers },
//       );

//       setSubSubjects(res.data.data || []);
//     } catch (err) {
//       toast({ title: 'Sub-Subject load error', status: 'error' });
//     }
//   };
//   // 🔹 Load Topics when Sub-Subject changes
//   const handleSubSubjectChange = (ssId) => {
//     setFormData({
//       ...formData,
//       subSubjectId: ssId,
//     });
//   };

//   // 🔹 CREATE CHAPTER
//   const handleCreate = async () => {
//     // 🔹 VALIDATION
//     if (!formData.courseId || !formData.subjectId || !formData.subSubjectId) {
//       return toast({
//         title: 'Course, Subject and Sub-Subject required',
//         status: 'warning',
//       });
//     }

//     if (!formData.name || formData.name.trim().length < 3) {
//       return toast({
//         title: 'Chapter name must be at least 3 characters',
//         status: 'warning',
//       });
//     }

//     if (loading) return; // 🔥 Prevent double submit

//     setLoading(true);

//     try {
//       const payload = new FormData();

//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== '' && value !== null && value !== undefined) {
//           payload.append(key, value);
//         }
//       });

//       if (chapterImage) {
//         payload.append('image', chapterImage);
//       }

//       await axios.post(`${baseUrl}api/admin/chapters`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       toast({ title: 'Chapter Created!', status: 'success' });

//       // 🔥 COMPLETE CLEAN RESET
//       setFormData({
//         courseId: '',
//         subjectId: '',
//         subSubjectId: '',
//         name: '',
//         description: '',
//         weightage: 0,
//         isFreePreview: false,
//       });

//       setSubjects([]);
//       setSubSubjects([]);
//       setChapterImage(null);

//       await fetchData();
//     } catch (err) {
//       toast({
//         title: err.response?.data?.message || 'Create failed',
//         status: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 UPDATE CHAPTER
//   const handleUpdate = async () => {
//     try {
//       const payload = new FormData();

//       payload.append(
//         'subSubjectId',
//         editData.subSubjectId?._id || editData.subSubjectId,
//       );

//       payload.append('name', editData.name);
//       payload.append('description', editData.description || '');
//       payload.append('weightage', editData.weightage);
//       payload.append('isFreePreview', editData.isFreePreview);

//       if (editData.newImage) {
//         payload.append('image', editData.newImage);
//       }

//       await axios.patch(
//         `${baseUrl}api/admin/chapters/${editData._id}`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       toast({ title: 'Updated Successfully', status: 'success' });
//       onClose();
//       fetchData();
//     } catch (err) {
//       toast({
//         title: err.response?.data?.message || 'Something went wrong',
//         status: 'error',
//       });
//     }
//   };

//   // 🔹 DELETE CHAPTER
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure?')) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/chapters/${id}`, { headers });
//         toast({ title: 'Deleted', status: 'info' });
//         fetchData();
//       } catch (err) {
//         toast({ title: 'Delete failed', status: 'error' });
//       }
//     }
//   };

//   // 🔹 SEARCH FILTER
//   const filteredData = chapters.filter(
//     (c) =>
//       c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.subSubjectId?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
//       {/* ADD CHAPTER CARD */}
//       <Card mb="20px" p="20px">
//         <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
//           Add New Chapter
//         </Text>

//         <Flex gap="15px" wrap="wrap">
//           {/* COURSE ✅ */}
//           <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Course
//             </FormLabel>
//             <Select
//               placeholder="Select Course"
//               value={formData.courseId}
//               onChange={(e) => handleCourseChange(e.target.value)}
//             >
//               {courses.map((c) => (
//                 <option key={c._id} value={c._id}>
//                   {c.name}
//                 </option>
//               ))}
//             </Select>
//           </FormControl>

//           {/* SUBJECT */}
//           {/* <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Subject
//             </FormLabel>
//             <Select
//               placeholder="Select Subject"
//               value={formData.subjectId}
//               onChange={(e) => handleSubjectChange(e.target.value)}
//               isDisabled={!formData.courseId}
//             >
//               {subjects.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </FormControl> */}
//           {/* SUBJECT DROPDOWN */}
//           <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Subject
//             </FormLabel>
//             <Select
//               placeholder={loadingSubjects ? 'Loading...' : 'Select Subject'}
//               value={formData.subjectId}
//               onChange={(e) => handleSubjectChange(e.target.value)}
//               isDisabled={!formData.courseId || loadingSubjects} // Jab load ho raha ho tab bhi disabled rahe
//             >
//               {subjects.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </FormControl>

//           {/* SUB-SUBJECT */}
//           <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Sub-Subject
//             </FormLabel>
//             <Select
//               placeholder="Select Sub-Subject"
//               value={formData.subSubjectId}
//               onChange={(e) => handleSubSubjectChange(e.target.value)}
//               isDisabled={!formData.subjectId}
//             >
//               {subSubjects.map((s) => (
//                 <option key={s._id} value={s._id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </FormControl>

//           {/* NAME */}
//           <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Chapter Name
//             </FormLabel>
//             <Input
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({
//                   ...formData,
//                   name: e.target.value,
//                 })
//               }
//               placeholder="Ex: Genetics"
//             />
//           </FormControl>

//           {/* DESCRIPTION ✅ */}
//           <FormControl width="100%">
//             <FormLabel fontSize="sm" fontWeight="700">
//               Description
//             </FormLabel>

//             <ReactQuill
//               key={formData.courseId + formData.subjectId + formData.name}
//               theme="snow"
//               value={formData.description}
//               onChange={(value) =>
//                 setFormData({
//                   ...formData,
//                   description: value,
//                 })
//               }
//               style={{ background: 'white' }}
//             />
//           </FormControl>

//           {/* IMAGE */}
//           <FormControl width={{ base: '100%', md: '20%' }}>
//             <FormLabel fontSize="sm" fontWeight="700">
//               Chapter Image
//             </FormLabel>
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files[0];

//                 if (!file) return;

//                 if (!file.type.startsWith('image/')) {
//                   toast({
//                     title: 'Only image files allowed',
//                     status: 'warning',
//                   });
//                   return;
//                 }

//                 if (file.size > 2 * 1024 * 1024) {
//                   toast({
//                     title: 'Image must be less than 2MB',
//                     status: 'warning',
//                   });
//                   return;
//                 }

//                 setChapterImage(file);
//               }}
//               pt="1"
//             />
//           </FormControl>

//           <Button
//             colorScheme="brand"
//             mt="30px"
//             onClick={handleCreate}
//             isLoading={loading}
//           >
//             Save
//           </Button>
//         </Flex>
//       </Card>

//       {/* LIST TABLE */}
//       <Card p="20px">
//         <Flex justify="space-between" mb="20px">
//           <Text color={textColor} fontSize="18px" fontWeight="700">
//             Chapters
//           </Text>

//           <InputGroup maxW="300px">
//             <InputLeftElement children={<MdSearch />} />
//             <Input
//               placeholder="Search..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </InputGroup>
//         </Flex>

//         <Box overflowX="auto">
//           <Table variant="simple">
//             <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
//               <Tr>
//                 <Th>Image</Th>
//                 <Th>Name</Th>

//                 <Th>Sub-Subject</Th>
//                 <Th>Actions</Th>
//               </Tr>
//             </Thead>

//             <Tbody>
//               {filteredData.map((item) => (
//                 <Tr key={item._id}>
//                   <Td>
//                     <Image
//                       src={
//                         item.image
//                           ? item.image.startsWith('http')
//                             ? item.image
//                             : `${baseUrl.replace(/\/$/, '')}${item.image}`
//                           : 'https://via.placeholder.com/50'
//                       }
//                       w="40px"
//                       h="40px"
//                       borderRadius="8px"
//                       objectFit="cover"
//                       fallbackSrc="https://via.placeholder.com/40"
//                     />
//                   </Td>

//                   <Td fontWeight="700">{item.name}</Td>

//                   <Td>
//                     <Badge colorScheme="purple">
//                       {item.subSubjectId?.name || 'N/A'}
//                     </Badge>
//                   </Td>

//                   <Td>
//                     <IconButton
//                       icon={<MdEdit />}
//                       onClick={() => {
//                         setEditData(item);
//                         onOpen();
//                       }}
//                       mr="2"
//                     />
//                     <IconButton
//                       icon={<MdDelete />}
//                       colorScheme="red"
//                       onClick={() => handleDelete(item._id)}
//                     />
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </Box>
//       </Card>

//       {/* EDIT MODAL */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent pb="4">
//           <ModalHeader>Edit Chapter</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {editData && (
//               <Flex direction="column" gap="4">
//                 <FormControl>
//                   <FormLabel>Chapter Name</FormLabel>
//                   <Input
//                     value={editData.name}
//                     onChange={(e) =>
//                       setEditData({
//                         ...editData,
//                         name: e.target.value,
//                       })
//                     }
//                   />
//                 </FormControl>

//                 <FormControl>
//                   <FormLabel>Update Image</FormLabel>
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) =>
//                       setEditData({
//                         ...editData,
//                         newImage: e.target.files[0],
//                       })
//                     }
//                     pt="1"
//                   />
//                 </FormControl>

//                 <FormControl>
//                   <FormLabel>Free Preview</FormLabel>
//                   <Switch
//                     isChecked={editData.isFreePreview}
//                     onChange={(e) =>
//                       setEditData({
//                         ...editData,
//                         isFreePreview: e.target.checked,
//                       })
//                     }
//                   />
//                 </FormControl>
//               </Flex>
//             )}
//           </ModalBody>

//           <ModalFooter>
//             <Button colorScheme="brand" onClick={handleUpdate}>
//               Update
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// }

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
  Image,
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function ChapterManagement() {
  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [chapterImage, setChapterImage] = useState(null);

  const [formData, setFormData] = useState({
    storyCategory: '',
    title: '',
    description: '',
    chapterNumber: '',
  });

  const [editData, setEditData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // 🔹 FETCH DATA
  const fetchData = async () => {
    try {
      setLoading(true);

      // Always load categories
      const categoryRes = await axios.get(`${baseUrl}api/admin/categories`, {
        headers,
      });
      setCategories(categoryRes.data.data || []);

      // 🔥 If category selected → filter
      // 🔥 Else → load all chapters
      const chapterUrl = formData.storyCategory
        ? `${baseUrl}api/admin/story-chapters/category/${formData.storyCategory}`
        : `${baseUrl}api/admin/story-chapters`;

      const chapterRes = await axios.get(chapterUrl, { headers });

      setChapters(chapterRes.data.data || []);
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Data load failed',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = '/auth/sign-in';
      return;
    }

    fetchData();
  }, [formData.storyCategory]);

  // 🔹 CREATE
  const handleCreate = async () => {
    if (!formData.storyCategory || !formData.title || !formData.chapterNumber) {
      return toast({
        title: 'Category, Title & Chapter Number required',
        status: 'warning',
      });
    }

    try {
      const payload = new FormData();
      payload.append('storyCategory', formData.storyCategory);
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('chapterNumber', formData.chapterNumber);

      if (chapterImage) {
        payload.append('image', chapterImage);
      }

      await axios.post(`${baseUrl}api/admin/story-chapters`, payload, {
        headers,
      });

      toast({ title: 'Chapter Created!', status: 'success' });

      setFormData({
        storyCategory: '',
        title: '',
        description: '',
        chapterNumber: '',
      });

      setChapterImage(null);
      fetchData();
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Create failed',
        status: 'error',
      });
    }
  };

  // 🔹 UPDATE
  const handleUpdate = async () => {
    try {
      const payload = new FormData();
      payload.append('title', editData.title);
      payload.append('description', editData.description || '');
      payload.append('chapterNumber', editData.chapterNumber);

      if (editData.newImage) {
        payload.append('image', editData.newImage);
      }

      await axios.patch(
        `${baseUrl}api/admin/story-chapters/${editData._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      toast({ title: 'Updated Successfully', status: 'success' });
      onClose();
      fetchData();
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Update failed',
        status: 'error',
      });
    }
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`${baseUrl}api/admin/story-chapters/${id}`, {
        headers,
      });
      toast({ title: 'Deleted', status: 'info' });
      fetchData();
    } catch {
      toast({ title: 'Delete failed', status: 'error' });
    }
  };

  const filteredData = chapters.filter((c) =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box pt="80px">
      <Card mb="20px" p="20px">
        <Text fontSize="22px" fontWeight="700" mb="20px">
          Add New Chapter
        </Text>

        <Flex gap="15px" wrap="wrap">
          <FormControl width="25%">
            <FormLabel>Story-Category</FormLabel>
            <Select
              value={formData.storyCategory}
              onChange={(e) =>
                setFormData({ ...formData, storyCategory: e.target.value })
              }
              placeholder="Select Category"
            >
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl width="25%">
            <FormLabel>Story-Chapter Name</FormLabel>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </FormControl>

          <FormControl width="25%">
            <FormLabel>Story-Chapter Number</FormLabel>
            <Input
              type="number"
              value={formData.chapterNumber}
              onChange={(e) =>
                setFormData({ ...formData, chapterNumber: e.target.value })
              }
            />
          </FormControl>

          <FormControl width="25%">
            <FormLabel>Story-Chapter Image</FormLabel>
            <Input
              type="file"
              onChange={(e) => setChapterImage(e.target.files[0])}
            />
          </FormControl>

          <FormControl width="100%">
            <FormLabel>Description</FormLabel>
            <ReactQuill
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value })
              }
            />
          </FormControl>

          <Button
            bg="linear-gradient(90deg, #6B46C1 0%, #B794F4 100%)"
            color="white"
            _hover={{ opacity: 0.9 }}
            onClick={handleCreate}
            isLoading={loading}
          >
            Save
          </Button>
        </Flex>
      </Card>

      <Card p="20px">
        <Flex justify="space-between" mb="20px">
          <Text fontSize="18px" fontWeight="700">
            Chapters
          </Text>
          <InputGroup maxW="300px">
            <InputLeftElement children={<MdSearch />} />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Table>
          <Thead>
            <Tr>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Story-Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>

          <Tbody>
            {filteredData.map((item) => (
              <Tr key={item._id}>
                <Td>
                  <Image
                    src={`${baseUrl.replace(/\/$/, '')}/${item.image}`}
                    w="40px"
                    h="40px"
                    borderRadius="8px"
                  />
                </Td>
                <Td>{item.title}</Td>
                <Td>
                  <Badge colorScheme="purple">{item.storyCategory?.name}</Badge>
                </Td>
                <Td>
                  <IconButton
                    icon={<MdEdit />}
                    onClick={() => {
                      setEditData(item);
                      onOpen();
                    }}
                    mr="2"
                  />
                  <IconButton
                    icon={<MdDelete />}
                    colorScheme="red"
                    onClick={() => handleDelete(item._id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
      {/* 🔹 EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Chapter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editData && (
              <>
                <FormControl mb="3">
                  <FormLabel>Chapter Name</FormLabel>
                  <Input
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl mb="3">
                  <FormLabel>Chapter Number</FormLabel>
                  <Input
                    type="number"
                    value={editData.chapterNumber}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        chapterNumber: e.target.value,
                      })
                    }
                  />
                </FormControl>

                <FormControl mb="3">
                  <FormLabel>Description</FormLabel>
                  <ReactQuill
                    value={editData.description || ''}
                    onChange={(value) =>
                      setEditData({ ...editData, description: value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Replace Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        newImage: e.target.files[0],
                      })
                    }
                  />
                </FormControl>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleUpdate}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
