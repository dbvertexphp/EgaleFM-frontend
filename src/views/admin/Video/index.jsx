// /* eslint-disable */
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
//   InputGroup,
//   InputLeftElement,
//   Select,
//   Badge,
//   Icon,
//   Tooltip
// } from '@chakra-ui/react';
// import { MdDelete, MdSearch, MdCloudUpload, MdPlayCircleOutline } from 'react-icons/md';
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function VideoManagement() {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [subSubjects, setSubSubjects] = useState([]);
//   const [chapters, setChapters] = useState([]);
//   const [videos, setVideos] = useState([]);

//   // Selection States
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedSubSubject, setSelectedSubSubject] = useState('');
//   const [selectedChapter, setSelectedChapter] = useState('');

//   // Input States
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoTitle, setVideoTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   const fileInputRef = useRef();
//   const toast = useToast();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const iconColor = useColorModeValue('brand.500', 'white');

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchData = async () => {
//     try {
//       const [courseRes, videoRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, { headers }),
//         axios.get(`${baseUrl}api/admin/videos`, { headers })
//       ]);
//       setCourses(courseRes.data.data || []);
//       setVideos(videoRes.data.data || []);
//     } catch (err) {
//       toast({ title: 'Fetch Error', description: 'Data load nahi ho paya', status: 'error' });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // Cascading Logic
//   const handleCourseChange = async (id) => {
//     setSelectedCourse(id);
//     setSelectedSubject(''); setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/subjects?courseId=${id}`, { headers });
//       setSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubjectChange = async (id) => {
//     setSelectedSubject(id);
//     setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/sub-subjects?subjectId=${id}`, { headers });
//       setSubSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubSubjectChange = async (id) => {
//     setSelectedSubSubject(id);
//     setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/chapters?subSubjectId=${id}`, { headers });
//       setChapters(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleUploadVideo = async () => {
//     if (!videoFile || !videoTitle || !selectedChapter) {
//       return toast({ title: 'Warning', description: 'Title, File aur Chapter zaroori hain!', status: 'warning' });
//     }

//     const formData = new FormData();
//     formData.append('video', videoFile);
//     formData.append('title', videoTitle);
//     formData.append('description', description);
//     formData.append('courseId', selectedCourse);
//     formData.append('subjectId', selectedSubject);
//     formData.append('subSubjectId', selectedSubSubject);
//     formData.append('chapterId', selectedChapter);

//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/videos`, formData, {
//         headers: { ...headers, 'Content-Type': 'multipart/form-data' }
//       });
//       toast({ title: 'Success', description: 'Video upload ho gayi!', status: 'success' });
//       // Reset fields
//       setVideoFile(null); setVideoTitle(''); setDescription('');
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Upload Failed', description: 'Server error', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("Kya aap is video ko delete karna chahte hain?")) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/videos/${id}`, { headers });
//         toast({ title: 'Deleted', status: 'info' });
//         fetchData();
//       } catch (err) { toast({ title: 'Error', status: 'error' }); }
//     }
//   };

//   // Search filter logic
//   const filteredVideos = videos.filter(v =>
//     v.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>

//       {/* 1. UPLOAD FORM CARD */}
//       <Card mb='20px' p='20px'>
//         <Text fontSize='22px' fontWeight='700' mb='20px' color={textColor}>
//           Video Management
//         </Text>

//         {/* Dropdowns */}
//         <Flex gap='15px' mb='20px' wrap="wrap">
//             <Select placeholder='Select Course' flex="1" value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
//                 {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </Select>
//             <Select placeholder='Select Subject' flex="1" value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
//                 {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//             </Select>
//             <Select placeholder='Select Sub-Subject' flex="1" value={selectedSubSubject} onChange={(e) => handleSubSubjectChange(e.target.value)}>
//                 {subSubjects.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
//             </Select>
//             <Select placeholder='Select Chapter' flex="1" value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
//                 {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
//             </Select>
//         </Flex>

//         {/* Inputs & File Selection */}
//         <Flex gap='15px' direction={{ base: 'column', md: 'row' }} align="flex-end">
//           <FormControl flex='1'>
//             <FormLabel fontWeight="700">Video Title</FormLabel>
//             <Input value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder='Ex: Lecture 01' />
//           </FormControl>

//           <FormControl flex='1'>
//             <FormLabel fontWeight="700">Description</FormLabel>
//             <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Topic details...' />
//           </FormControl>

//           <FormControl flex='1'>
//             <FormLabel fontWeight="700">Video File</FormLabel>
//             <input
//               type='file'
//               accept='video/*'
//               hidden
//               ref={fileInputRef}
//               onChange={(e) => setVideoFile(e.target.files[0])}
//             />
//             <Button
//               leftIcon={<MdCloudUpload />}
//               onClick={() => fileInputRef.current.click()}
//               w="100%"
//               variant="outline"
//               colorScheme={videoFile ? "green" : "gray"}
//             >
//               {videoFile ? videoFile.name.substring(0, 15) + "..." : "Select Video"}
//             </Button>
//           </FormControl>

//           <Button
//             colorScheme='brand'
//             variant='solid'
//             isLoading={loading}
//             onClick={handleUploadVideo}
//             px='40px'
//           >
//             Upload
//           </Button>
//         </Flex>
//       </Card>

//       {/* 2. VIDEO LIST TABLE CARD */}
//       <Card p='20px'>
//         <Flex justify='space-between' align='center' mb='20px' wrap="wrap" gap="10px">
//           <Text color={textColor} fontSize='18px' fontWeight='700'>
//             Videos Library ({filteredVideos.length})
//           </Text>
//           <InputGroup maxW='300px'>
//             <InputLeftElement pointerEvents='none'>
//               <MdSearch color='gray.300' />
//             </InputLeftElement>
//             <Input
//               placeholder='Search video by title...'
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </InputGroup>
//         </Flex>

//         <Box overflowX='auto'>
//           <Table variant='simple' color="gray.500">
//             <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
//               <Tr>
//                 <Th>Play</Th>
//                 <Th>Video Details</Th>
//                 <Th>Hierarchy</Th>
//                 <Th textAlign="right">Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filteredVideos.map((video) => (
//                 <Tr key={video._id}>
//                   <Td>
//                     <IconButton
//                       icon={<MdPlayCircleOutline size="24px" />}
//                       variant="ghost"
//                       colorScheme="brand"
//                       onClick={() => window.open(`${baseUrl}${video.videoUrl}`, '_blank')}
//                       aria-label="Play Video"
//                     />
//                   </Td>
//                   <Td>
//                     <Text fontWeight='700' color={textColor}>{video.title}</Text>
//                     <Text fontSize='xs' noOfLines={1} color="gray.400">{video.description}</Text>
//                   </Td>
//                   <Td>
//                     <Flex direction="column" gap="1">
//                         <Badge variant="subtle" colorScheme="orange" fontSize="10px">
//                           Course: {video.courseId?.name || 'N/A'}
//                         </Badge>
//                         <Badge variant="subtle" colorScheme="blue" fontSize="10px">
//                           Sub: {video.subjectId?.name || 'N/A'}
//                         </Badge>
//                         <Badge variant="subtle" colorScheme="purple" fontSize="10px">
//                           Ch: {video.chapterId?.name || 'N/A'}
//                         </Badge>
//                     </Flex>
//                   </Td>
//                   <Td textAlign="right">
//                     <IconButton
//                       variant="ghost"
//                       colorScheme='red'
//                       icon={<MdDelete />}
//                       onClick={() => handleDelete(video._id)}
//                     />
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>

//           {filteredVideos.length === 0 && (
//             <Box textAlign="center" py="20px">
//               <Text color="gray.400">No Videos Found</Text>
//             </Box>
//           )}
//         </Box>
//       </Card>
//     </Box>
//   );
// }
/* eslint-disable */
/* eslint-disable */
/* eslint-disable */
// 'use client';

// import {
//   Box, Flex, Text, useColorModeValue, Button, Input, FormControl, FormLabel,
//   useToast, IconButton, InputGroup, InputLeftElement, Select, Badge,
//   SimpleGrid, Image, VStack, HStack, Textarea, Divider,
//   AspectRatio, Menu, MenuButton, MenuList, MenuItem, Icon
// } from '@chakra-ui/react';
// import {
//   MdDelete, MdSearch, MdCloudUpload, MdPlayArrow,
//   MdMoreVert, MdEdit, MdVideoLibrary, MdFolder, MdDescription, MdImage
// } from 'react-icons/md';
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function VideoManagement() {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [subSubjects, setSubSubjects] = useState([]);
//   const [chapters, setChapters] = useState([]);
//   const [videos, setVideos] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedSubSubject, setSelectedSubSubject] = useState('');
//   const [selectedChapter, setSelectedChapter] = useState('');

//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [notesFile, setNotesFile] = useState(null);

//   const [videoTitle, setVideoTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   const videoInputRef = useRef();
//   const thumbInputRef = useRef();
//   const notesInputRef = useRef();

//   const toast = useToast();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const cardBg = useColorModeValue('white', 'navy.800');
//   const brandColor = useColorModeValue('brand.500', 'brand.400');
//   const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchData = async () => {
//     try {
//       const [courseRes, videoRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, { headers }),
//         axios.get(`${baseUrl}api/admin/videos`, { headers })
//       ]);
//       setCourses(courseRes.data.data || []);
//       setVideos(videoRes.data.data || []);
//     } catch (err) {
//       toast({ title: 'Fetch Error', description: 'Failed to load data', status: 'error' });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleCourseChange = async (id) => {
//     setSelectedCourse(id);
//     setSelectedSubject(''); setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/subjects?courseId=${id}`, { headers });
//       setSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubjectChange = async (id) => {
//     setSelectedSubject(id);
//     setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/sub-subjects?subjectId=${id}`, { headers });
//       setSubSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubSubjectChange = async (id) => {
//     setSelectedSubSubject(id);
//     setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/chapters?subSubjectId=${id}`, { headers });
//       setChapters(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleUploadVideo = async () => {
//     if (!videoFile || !videoTitle || !selectedChapter) {
//       return toast({
//         title: 'Validation Error',
//         description: 'Please provide Video Title, File and select a Chapter.',
//         status: 'warning'
//       });
//     }

//     const formData = new FormData();
//     formData.append('video', videoFile);
//     if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
//     if (notesFile) formData.append('notes', notesFile); // Optional Field

//     formData.append('title', videoTitle);
//     formData.append('description', description);
//     formData.append('courseId', selectedCourse);
//     formData.append('subjectId', selectedSubject);
//     formData.append('subSubjectId', selectedSubSubject);
//     formData.append('chapterId', selectedChapter);

//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/videos`, formData, {
//         headers: { ...headers, 'Content-Type': 'multipart/form-data' }
//       });
//       toast({ title: 'Success', description: 'Lecture published successfully!', status: 'success' });

//       setVideoFile(null); setThumbnailFile(null); setNotesFile(null);
//       setVideoTitle(''); setDescription('');
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Upload Failed', description: err.response?.data?.message || 'Server Error', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("Are you sure you want to delete this video?")) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/videos/${id}`, { headers });
//         toast({ title: 'Deleted', description: 'Video removed from library', status: 'info' });
//         fetchData();
//       } catch (err) { toast({ title: 'Delete Error', status: 'error' }); }
//     }
//   };

//   const filteredVideos = videos.filter(v =>
//     v.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px' }} px="20px">

//       <Card mb='30px' p='25px'>
//         <Flex align="center" mb="25px">
//             <Icon as={MdVideoLibrary} w='28px' h='28px' color={brandColor} me='10px' />
//             <Text fontSize='22px' fontWeight='700' color={textColor}>Publish New Lecture</Text>
//         </Flex>

//         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing='15px' mb='25px'>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Course</FormLabel>
//                 <Select variant="filled" placeholder='Select Course' value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
//                     {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Subject' value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
//                     {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Sub-Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Sub-Subject' value={selectedSubSubject} onChange={(e) => handleSubSubjectChange(e.target.value)}>
//                     {subSubjects.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Chapter</FormLabel>
//                 <Select variant="filled" placeholder='Select Chapter' value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
//                     {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
//                 </Select>
//             </FormControl>
//         </SimpleGrid>

//         <VStack spacing="20px" align="stretch">
//             <FormControl isRequired>
//                 <FormLabel fontSize="sm" fontWeight="700">Lecture Title</FormLabel>
//                 <Input variant="auth" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder='Ex: Chapter 1 - Physics Basics' />
//             </FormControl>

//             <SimpleGrid columns={{ base: 1, md: 3 }} spacing="15px">
//                 <FormControl isRequired>
//                     <FormLabel fontSize="sm" fontWeight="700">Video File</FormLabel>
//                     <input type='file' accept='video/*' hidden ref={videoInputRef} onChange={(e) => setVideoFile(e.target.files[0])} />
//                     <Button leftIcon={<MdPlayArrow />} onClick={() => videoInputRef.current.click()} w="full" variant="outline" colorScheme={videoFile ? "green" : "brand"}>
//                         {videoFile ? "File Ready" : "Select Video"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Thumbnail</FormLabel>
//                     <input type='file' accept='image/*' hidden ref={thumbInputRef} onChange={(e) => setThumbnailFile(e.target.files[0])} />
//                     <Button leftIcon={<MdImage />} onClick={() => thumbInputRef.current.click()} w="full" variant="outline" colorScheme={thumbnailFile ? "green" : "orange"}>
//                         {thumbnailFile ? "Image Ready" : "Upload Image"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Notes (PDF - Optional)</FormLabel>
//                     <input type='file' accept='.pdf' hidden ref={notesInputRef} onChange={(e) => setNotesFile(e.target.files[0])} />
//                     <Button leftIcon={<MdDescription />} onClick={() => notesInputRef.current.click()} w="full" variant="outline" colorScheme={notesFile ? "green" : "purple"}>
//                         {notesFile ? "PDF Attached" : "Add Notes"}
//                     </Button>
//                 </FormControl>
//             </SimpleGrid>

//             <FormControl>
//                 <FormLabel fontSize="sm" fontWeight="700">Description</FormLabel>
//                 <Textarea variant="auth" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter lecture summary...' />
//             </FormControl>

//             <Button colorScheme='brand' size="lg" isLoading={loading} onClick={handleUploadVideo} w="full" h="55px">
//                 PUBLISH LECTURE
//             </Button>
//         </VStack>
//       </Card>

//       <Flex justify='space-between' align='center' mb='25px'>
//           <Box>
//             <Text color={textColor} fontSize='26px' fontWeight='800'>Lecture Library</Text>
//             <Text color={secondaryTextColor} fontSize="sm">Manage your uploaded contents</Text>
//           </Box>
//           <InputGroup maxW='300px'>
//             <InputLeftElement children={<MdSearch color='gray.300' />} />
//             <Input borderRadius="full" variant="filled" placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </InputGroup>
//       </Flex>

//       <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing='25px'>
//         {filteredVideos.map((video) => (
//           <Box key={video._id} bg={cardBg} borderRadius='20px' overflow='hidden' shadow='sm' border="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}>
//             {/* Full Width Thumbnail Section */}
//             <Box position="relative" cursor="pointer" onClick={() => window.open(`${baseUrl}${video.videoUrl}`, '_blank')}>
//                 <AspectRatio ratio={16 / 9}>
//                     <Box bg="black">
//                         {video.thumbnailUrl ? (
//                             <Image src={`${baseUrl}${video.thumbnailUrl}`} alt={video.title} objectFit="cover" w="full" h="full" />
//                         ) : (
//                             <Flex align="center" justify="center" h="full" bg="gray.800">
//                                 <Icon as={MdPlayArrow} w="50px" h="50px" color="whiteAlpha.500" />
//                             </Flex>
//                         )}
//                         <Box position="absolute" top="0" left="0" w="full" h="full" bg="blackAlpha.200" _hover={{ bg: "blackAlpha.50" }} />
//                     </Box>
//                 </AspectRatio>

//                 {video.notesUrl && (
//                     <Badge position="absolute" top="10px" left="10px" colorScheme="purple" variant="solid"
//                            onClick={(e) => { e.stopPropagation(); window.open(`${baseUrl}${video.notesUrl}`, '_blank'); }}>
//                         PDF NOTES
//                     </Badge>
//                 )}
//             </Box>

//             <Box p='18px'>
//                 <Flex justify="space-between" mb="10px">
//                     <VStack align="start" spacing="2px" flex="1">
//                         <Text fontWeight='700' color={textColor} fontSize='md' noOfLines={1}>{video.title}</Text>
//                         <Text fontSize='xs' color={secondaryTextColor} noOfLines={1}>{video.description || "No description available"}</Text>
//                     </VStack>
//                     <Menu>
//                         <MenuButton as={IconButton} icon={<MdMoreVert />} variant="ghost" size="sm" />
//                         <MenuList>
//                             <MenuItem icon={<MdEdit />}>Edit</MenuItem>
//                             <MenuItem icon={<MdDelete />} color="red.500" onClick={() => handleDelete(video._id)}>Delete</MenuItem>
//                         </MenuList>
//                     </Menu>
//                 </Flex>

//                 <Divider my="12px" />

//                 <VStack align="start" spacing="8px">
//                     <HStack spacing="4px">
//                         <Icon as={MdFolder} color="orange.400" w="14px" h="14px" />
//                         <Text fontSize='xs' fontWeight="700" color="orange.500">{video.courseId?.name || 'General Course'}</Text>
//                     </HStack>
//                     <HStack wrap="wrap">
//                         <Badge borderRadius="4px" colorScheme="blue" fontSize="10px">{video.subjectId?.name || 'N/A'}</Badge>
//                         <Badge borderRadius="4px" colorScheme="purple" fontSize="10px">{video.chapterId?.name || 'N/A'}</Badge>
//                     </HStack>
//                 </VStack>
//             </Box>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// }

// /* eslint-disable */
// 'use client';

// import {
//   Box, Flex, Text, useColorModeValue, Button, Input, FormControl, FormLabel,
//   useToast, IconButton, InputGroup, InputLeftElement, Select, Badge,
//   SimpleGrid, Image, VStack, HStack, Textarea, Divider,
//   AspectRatio, Menu, MenuButton, MenuList, MenuItem, Icon
// } from '@chakra-ui/react';
// import {
//   MdDelete, MdSearch, MdCloudUpload, MdPlayArrow,
//   MdMoreVert, MdEdit, MdVideoLibrary, MdFolder, MdDescription, MdImage
// } from 'react-icons/md';
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function VideoManagement() {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [subSubjects, setSubSubjects] = useState([]);
//   const [chapters, setChapters] = useState([]);
//   const [videos, setVideos] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedSubSubject, setSelectedSubSubject] = useState('');
//   const [selectedChapter, setSelectedChapter] = useState('');

//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [notesFile, setNotesFile] = useState(null);

//   const [videoTitle, setVideoTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   const videoInputRef = useRef();
//   const thumbInputRef = useRef();
//   const notesInputRef = useRef();

//   const toast = useToast();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const cardBg = useColorModeValue('white', 'navy.800');
//   const brandColor = useColorModeValue('brand.500', 'brand.400');
//   const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchData = async () => {
//     try {
//       const [courseRes, videoRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, { headers }),
//         axios.get(`${baseUrl}api/admin/videos`, { headers })
//       ]);
//       setCourses(courseRes.data.data || []);
//       setVideos(videoRes.data.data || []);
//     } catch (err) {
//       toast({ title: 'Fetch Error', description: 'Failed to load data', status: 'error' });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleCourseChange = async (id) => {
//     setSelectedCourse(id);
//     setSelectedSubject(''); setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/subjects?courseId=${id}`, { headers });
//       setSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubjectChange = async (id) => {
//     setSelectedSubject(id);
//     setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/sub-subjects?subjectId=${id}`, { headers });
//       setSubSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubSubjectChange = async (id) => {
//     setSelectedSubSubject(id);
//     setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/chapters?subSubjectId=${id}`, { headers });
//       setChapters(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleUploadVideo = async () => {
//     if (!videoFile || !videoTitle || !selectedChapter) {
//       return toast({
//         title: 'Validation Error',
//         description: 'Please provide Video Title, File and select a Chapter.',
//         status: 'warning'
//       });
//     }

//     const formData = new FormData();
//     formData.append('video', videoFile);
//     if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
//     if (notesFile) formData.append('notes', notesFile);

//     formData.append('title', videoTitle);
//     formData.append('description', description);
//     formData.append('courseId', selectedCourse);
//     formData.append('subjectId', selectedSubject);
//     formData.append('subSubjectId', selectedSubSubject);
//     formData.append('chapterId', selectedChapter);

//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/videos`, formData, {
//         headers: { ...headers, 'Content-Type': 'multipart/form-data' }
//       });
//       toast({ title: 'Success', description: 'Lecture published successfully!', status: 'success' });

//       setVideoFile(null); setThumbnailFile(null); setNotesFile(null);
//       setVideoTitle(''); setDescription('');
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Upload Failed', description: err.response?.data?.message || 'Server Error', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("Are you sure you want to delete this video?")) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/videos/${id}`, { headers });
//         toast({ title: 'Deleted', description: 'Video removed from library', status: 'info' });
//         fetchData();
//       } catch (err) { toast({ title: 'Delete Error', status: 'error' }); }
//     }
//   };

//   const filteredVideos = videos.filter(v =>
//     v.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '150px', md: '80px' }} px="20px">
//       {/* 1. UPLOAD FORM CARD */}
//       <Card mb='30px' p='25px'>
//         <Flex align="center" mb="25px">
//             <Icon as={MdVideoLibrary} w='28px' h='28px' color={brandColor} me='10px' />
//             <Text fontSize='22px' fontWeight='700' color={textColor}>Publish New Lecture</Text>
//         </Flex>

//         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing='15px' mb='25px'>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Course</FormLabel>
//                 <Select variant="filled" placeholder='Select Course' value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
//                     {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Subject' value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
//                     {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Sub-Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Sub-Subject' value={selectedSubSubject} onChange={(e) => handleSubSubjectChange(e.target.value)}>
//                     {subSubjects.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Chapter</FormLabel>
//                 <Select variant="filled" placeholder='Select Chapter' value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
//                     {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
//                 </Select>
//             </FormControl>
//         </SimpleGrid>

//         <VStack spacing="20px" align="stretch">
//             <FormControl isRequired>
//                 <FormLabel fontSize="sm" fontWeight="700">Lecture Title</FormLabel>
//                 <Input variant="auth" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder='Ex: Chapter 1 - Physics Basics' />
//             </FormControl>

//             <SimpleGrid columns={{ base: 1, md: 3 }} spacing="15px">
//                 <FormControl isRequired>
//                     <FormLabel fontSize="sm" fontWeight="700">Video File</FormLabel>
//                     <input type='file' accept='video/*' hidden ref={videoInputRef} onChange={(e) => setVideoFile(e.target.files[0])} />
//                     <Button leftIcon={<MdPlayArrow />} onClick={() => videoInputRef.current.click()} w="full" variant="outline" colorScheme={videoFile ? "green" : "brand"}>
//                         {videoFile ? "File Ready" : "Select Video"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Thumbnail</FormLabel>
//                     <input type='file' accept='image/*' hidden ref={thumbInputRef} onChange={(e) => setThumbnailFile(e.target.files[0])} />
//                     <Button leftIcon={<MdImage />} onClick={() => thumbInputRef.current.click()} w="full" variant="outline" colorScheme={thumbnailFile ? "green" : "orange"}>
//                         {thumbnailFile ? "Image Ready" : "Upload Image"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Notes (PDF - Optional)</FormLabel>
//                     <input type='file' accept='.pdf' hidden ref={notesInputRef} onChange={(e) => setNotesFile(e.target.files[0])} />
//                     <Button leftIcon={<MdDescription />} onClick={() => notesInputRef.current.click()} w="full" variant="outline" colorScheme={notesFile ? "green" : "purple"}>
//                         {notesFile ? "PDF Attached" : "Add Notes"}
//                     </Button>
//                 </FormControl>
//             </SimpleGrid>

//             <FormControl>
//                 <FormLabel fontSize="sm" fontWeight="700">Description</FormLabel>
//                 <Textarea variant="auth" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter lecture summary...' />
//             </FormControl>

//             <Button colorScheme='brand' size="lg" isLoading={loading} onClick={handleUploadVideo} w="full" h="55px">
//                 PUBLISH LECTURE
//             </Button>
//         </VStack>
//       </Card>

//       <Flex justify='space-between' align='center' mb='25px'>
//           <Box>
//             <Text color={textColor} fontSize='26px' fontWeight='800'>Lecture Library</Text>
//             <Text color={secondaryTextColor} fontSize="sm">Manage your uploaded contents</Text>
//           </Box>
//           <InputGroup maxW='300px'>
//             <InputLeftElement children={<MdSearch color='gray.300' />} />
//             <Input borderRadius="full" variant="filled" placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </InputGroup>
//       </Flex>

//       <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing='25px'>
//         {filteredVideos.map((video) => (
//           <Box key={video._id} bg={cardBg} borderRadius='20px' overflow='hidden' shadow='sm' border="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}>
//             {/* Thumbnail Section */}
//             <Box position="relative" cursor="pointer" onClick={() => window.open(`${baseUrl}${video.videoUrl}`, '_blank')}>
//                 <AspectRatio ratio={16 / 9}>
//                     <Box bg="black">
//                         {video.thumbnailUrl ? (
//                             <Image src={`${baseUrl}${video.thumbnailUrl}`} alt={video.title} objectFit="cover" w="full" h="full" />
//                         ) : (
//                             <Flex align="center" justify="center" h="full" bg="gray.800">
//                                 <Icon as={MdPlayArrow} w="50px" h="50px" color="whiteAlpha.500" />
//                             </Flex>
//                         )}
//                         <Box position="absolute" top="0" left="0" w="full" h="full" bg="blackAlpha.200" _hover={{ bg: "blackAlpha.50" }} />
//                     </Box>
//                 </AspectRatio>

//                 {video.notesUrl && (
//                     <Badge position="absolute" top="10px" left="10px" colorScheme="purple" variant="solid"
//                            onClick={(e) => { e.stopPropagation(); window.open(`${baseUrl}${video.notesUrl}`, '_blank'); }}>
//                         PDF NOTES
//                     </Badge>
//                 )}
//             </Box>

//             <Box p='18px'>
//                 <Flex justify="space-between" mb="10px">
//                     <VStack align="start" spacing="2px" flex="1">
//                         <Text fontWeight='700' color={textColor} fontSize='md' noOfLines={1}>{video.title}</Text>
//                         <Text fontSize='xs' color={secondaryTextColor} noOfLines={1}>{video.description || "No description available"}</Text>
//                     </VStack>
//                     <Menu>
//                         <MenuButton as={IconButton} icon={<MdMoreVert />} variant="ghost" size="sm" />
//                         <MenuList>
//                             <MenuItem icon={<MdEdit />}>Edit</MenuItem>
//                             <MenuItem icon={<MdDelete />} color="red.500" onClick={() => handleDelete(video._id)}>Delete</MenuItem>
//                         </MenuList>
//                     </Menu>
//                 </Flex>

//                 <Divider my="12px" />

//                 <VStack align="start" spacing="8px">
//                     <HStack spacing="4px">
//                         <Icon as={MdFolder} color="orange.400" w="14px" h="14px" />
//                         {/* FIX: Check both subjectId and subjectId.name */}
//                         <Text fontSize='xs' fontWeight="700" color="orange.500">
//                           {video.courseId?.name || 'General Course'}
//                         </Text>
//                     </HStack>
//                     <HStack wrap="wrap">
//                         {/* FIX: Ensure subject name is displayed correctly */}
//                         <Badge borderRadius="4px" colorScheme="blue" fontSize="10px">
//                           {video.subjectId?.name || (typeof video.subjectId === 'string' ? 'ID Only' : 'No Subject')}
//                         </Badge>
//                         <Badge borderRadius="4px" colorScheme="purple" fontSize="10px">
//                           {video.chapterId?.name || 'No Chapter'}
//                         </Badge>
//                     </HStack>
//                 </VStack>
//             </Box>
//           </Box>
//         ))}
//       </SimpleGrid>
//     </Box>
//   );
// }

/* eslint-disable */
/* eslint-disable */
// 'use client';

// import {
//   Box, Flex, Text, useColorModeValue, Button, Input, FormControl, FormLabel,
//   useToast, IconButton, InputGroup, InputLeftElement, Select, Badge,
//   SimpleGrid, Image, VStack, HStack, Textarea, Divider,
//   AspectRatio, Menu, MenuButton, MenuList, MenuItem, Icon,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure
// } from '@chakra-ui/react';
// import {
//   MdDelete, MdSearch, MdCloudUpload, MdPlayArrow,
//   MdMoreVert, MdEdit, MdVideoLibrary, MdFolder, MdDescription, MdImage, MdChevronRight
// } from 'react-icons/md';
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function VideoManagement() {
//   const [courses, setCourses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [subSubjects, setSubSubjects] = useState([]);
//   const [chapters, setChapters] = useState([]);
//   const [videos, setVideos] = useState([]);

//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [selectedSubSubject, setSelectedSubSubject] = useState('');
//   const [selectedChapter, setSelectedChapter] = useState('');

//   const [videoFile, setVideoFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [notesFile, setNotesFile] = useState(null);

//   const [videoTitle, setVideoTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Edit State
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [editingVideo, setEditingVideo] = useState(null);

//   const videoInputRef = useRef();
//   const thumbInputRef = useRef();
//   const notesInputRef = useRef();

//   const toast = useToast();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const cardBg = useColorModeValue('white', 'navy.800');
//   const brandColor = useColorModeValue('brand.500', 'brand.400');
//   const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchData = async () => {
//     try {
//       const [courseRes, videoRes] = await Promise.all([
//         axios.get(`${baseUrl}api/admin/courses`, { headers }),
//         axios.get(`${baseUrl}api/admin/videos`, { headers })
//       ]);
//       setCourses(courseRes.data.data || []);
//       setVideos(videoRes.data.data || []);
//     } catch (err) {
//       toast({ title: 'Fetch Error', description: 'Failed to load data', status: 'error' });
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const handleCourseChange = async (id) => {
//     setSelectedCourse(id);
//     setSelectedSubject(''); setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/subjects?courseId=${id}`, { headers });
//       setSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubjectChange = async (id) => {
//     setSelectedSubject(id);
//     setSelectedSubSubject(''); setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/sub-subjects?subjectId=${id}`, { headers });
//       setSubSubjects(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleSubSubjectChange = async (id) => {
//     setSelectedSubSubject(id);
//     setSelectedChapter('');
//     try {
//       const res = await axios.get(`${baseUrl}api/admin/chapters?subSubjectId=${id}`, { headers });
//       setChapters(res.data.data || []);
//     } catch (err) { console.error(err); }
//   };

//   const handleUploadVideo = async () => {
//     if (!videoFile || !videoTitle || !selectedChapter) {
//       return toast({
//         title: 'Validation Error',
//         description: 'Please provide Video Title, File and select a Chapter.',
//         status: 'warning'
//       });
//     }

//     const formData = new FormData();
//     formData.append('video', videoFile);
//     if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
//     if (notesFile) formData.append('notes', notesFile);

//     formData.append('title', videoTitle);
//     formData.append('description', description);
//     formData.append('courseId', selectedCourse);
//     formData.append('subjectId', selectedSubject);
//     formData.append('subSubjectId', selectedSubSubject);
//     formData.append('chapterId', selectedChapter);

//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/admin/videos`, formData, {
//         headers: { ...headers, 'Content-Type': 'multipart/form-data' }
//       });
//       toast({ title: 'Success', description: 'Lecture published successfully!', status: 'success' });
//       setVideoFile(null); setThumbnailFile(null); setNotesFile(null);
//       setVideoTitle(''); setDescription('');
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Upload Failed', description: err.response?.data?.message || 'Server Error', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   const handleEditClick = (video) => {
//     setEditingVideo(video);
//     onOpen();
//   };

//   const handleUpdateVideo = async () => {
//     setLoading(true);
//     try {
//       await axios.put(`${baseUrl}api/admin/videos/${editingVideo._id}`, {
//         title: editingVideo.title,
//         description: editingVideo.description
//       }, { headers });
//       toast({ title: 'Updated', status: 'success' });
//       onClose();
//       fetchData();
//     } catch (err) {
//       toast({ title: 'Update Failed', status: 'error' });
//     } finally { setLoading(false); }
//   };

//   const handleDelete = async (id) => {
//     if(window.confirm("Are you sure you want to delete this video?")) {
//       try {
//         await axios.delete(`${baseUrl}api/admin/videos/${id}`, { headers });
//         toast({ title: 'Deleted', description: 'Video removed from library', status: 'info' });
//         fetchData();
//       } catch (err) { toast({ title: 'Delete Error', status: 'error' }); }
//     }
//   };

//   const filteredVideos = videos.filter(v =>
//     v.title?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '150px', md: '80px' }} px="20px">
//       {/* 1. UPLOAD FORM CARD */}
//       <Card mb='30px' p='25px'>
//         <Flex align="center" mb="25px">
//             <Icon as={MdVideoLibrary} w='28px' h='28px' color={brandColor} me='10px' />
//             <Text fontSize='22px' fontWeight='700' color={textColor}>Publish New Lecture</Text>
//         </Flex>

//         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing='15px' mb='25px'>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Course</FormLabel>
//                 <Select variant="filled" placeholder='Select Course' value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)}>
//                     {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Subject' value={selectedSubject} onChange={(e) => handleSubjectChange(e.target.value)}>
//                     {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Sub-Subject</FormLabel>
//                 <Select variant="filled" placeholder='Select Sub-Subject' value={selectedSubSubject} onChange={(e) => handleSubSubjectChange(e.target.value)}>
//                     {subSubjects.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
//                 </Select>
//             </FormControl>
//             <FormControl><FormLabel fontSize="sm" fontWeight="700">Chapter</FormLabel>
//                 <Select variant="filled" placeholder='Select Chapter' value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)}>
//                     {chapters.map(ch => <option key={ch._id} value={ch._id}>{ch.name}</option>)}
//                 </Select>
//             </FormControl>
//         </SimpleGrid>

//         <VStack spacing="20px" align="stretch">
//             <FormControl isRequired>
//                 <FormLabel fontSize="sm" fontWeight="700">Lecture Title</FormLabel>
//                 <Input variant="auth" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder='Ex: Chapter 1 - Physics Basics' />
//             </FormControl>

//             <SimpleGrid columns={{ base: 1, md: 3 }} spacing="15px">
//                 <FormControl isRequired>
//                     <FormLabel fontSize="sm" fontWeight="700">Video File</FormLabel>
//                     <input type='file' accept='video/*' hidden ref={videoInputRef} onChange={(e) => setVideoFile(e.target.files[0])} />
//                     <Button leftIcon={<MdPlayArrow />} onClick={() => videoInputRef.current.click()} w="full" variant="outline" colorScheme={videoFile ? "green" : "brand"}>
//                         {videoFile ? "File Ready" : "Select Video"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Thumbnail</FormLabel>
//                     <input type='file' accept='image/*' hidden ref={thumbInputRef} onChange={(e) => setThumbnailFile(e.target.files[0])} />
//                     <Button leftIcon={<MdImage />} onClick={() => thumbInputRef.current.click()} w="full" variant="outline" colorScheme={thumbnailFile ? "green" : "orange"}>
//                         {thumbnailFile ? "Image Ready" : "Upload Image"}
//                     </Button>
//                 </FormControl>

//                 <FormControl>
//                     <FormLabel fontSize="sm" fontWeight="700">Notes (PDF - Optional)</FormLabel>
//                     <input type='file' accept='.pdf' hidden ref={notesInputRef} onChange={(e) => setNotesFile(e.target.files[0])} />
//                     <Button leftIcon={<MdDescription />} onClick={() => notesInputRef.current.click()} w="full" variant="outline" colorScheme={notesFile ? "green" : "purple"}>
//                         {notesFile ? "PDF Attached" : "Add Notes"}
//                     </Button>
//                 </FormControl>
//             </SimpleGrid>

//             <FormControl>
//                 <FormLabel fontSize="sm" fontWeight="700">Description</FormLabel>
//                 <Textarea variant="auth" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter lecture summary...' />
//             </FormControl>

//             <Button colorScheme='brand' size="lg" isLoading={loading} onClick={handleUploadVideo} w="full" h="55px">
//                 PUBLISH LECTURE
//             </Button>
//         </VStack>
//       </Card>

//       {/* 2. LIBRARY SECTION */}
//       <Flex justify='space-between' align='center' mb='25px'>
//           <Box>
//             <Text color={textColor} fontSize='26px' fontWeight='800'>Lecture Library</Text>
//           </Box>
//           <InputGroup maxW='300px'>
//             <InputLeftElement children={<MdSearch color='gray.300' />} />
//             <Input borderRadius="full" variant="filled" placeholder='Search...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </InputGroup>
//       </Flex>

//       <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing='25px'>
//         {filteredVideos.map((video) => (
//           <Box key={video._id} bg={cardBg} borderRadius='20px' overflow='hidden' shadow='sm' border="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}>
//             <Box position="relative">
//                 <AspectRatio ratio={16 / 9}>
//                     <Box bg="black" cursor="pointer" onClick={() => window.open(`${baseUrl}${video.videoUrl}`, '_blank')}>
//                         {video.thumbnailUrl ? (
//                             <Image src={`${baseUrl}${video.thumbnailUrl}`} alt={video.title} objectFit="cover" w="full" h="full" />
//                         ) : (
//                             <Flex align="center" justify="center" h="full" bg="gray.800"><Icon as={MdPlayArrow} w="50px" h="50px" color="whiteAlpha.500" /></Flex>
//                         )}
//                     </Box>
//                 </AspectRatio>
//             </Box>

//             <Box p='18px'>
//                 <Flex justify="space-between" mb="10px">
//                     <VStack align="start" spacing="2px" flex="1">
//                         <Text fontWeight='700' color={textColor} fontSize='md' noOfLines={1}>{video.title}</Text>
//                         <Text fontSize='xs' color={secondaryTextColor} noOfLines={1}>{video.description || "No description"}</Text>
//                     </VStack>
//                     <Menu>
//                         <MenuButton as={IconButton} icon={<MdMoreVert />} variant="ghost" size="sm" />
//                         <MenuList>
//                             <MenuItem icon={<MdEdit />} onClick={() => handleEditClick(video)}>Edit</MenuItem>
//                             <MenuItem icon={<MdDelete />} color="red.500" onClick={() => handleDelete(video._id)}>Delete</MenuItem>
//                         </MenuList>
//                     </Menu>
//                 </Flex>

//                 <Divider my="12px" />

//                 {/* COURSE -> SUBJECT -> SUB-SUBJECT -> CHAPTER SECTION */}
//                 <VStack align="start" spacing="6px">
//                     <HStack spacing="4px" wrap="wrap">
//                         <Badge colorScheme="brand" fontSize="10px">{video.courseId?.name || 'Course'}</Badge>
//                         <Icon as={MdChevronRight} color="gray.400" />
//                         <Badge colorScheme="blue" fontSize="10px">{video.subjectId?.name || 'Subject'}</Badge>
//                     </HStack>

//                     <HStack spacing="4px" wrap="wrap">
//                         {video.subSubjectId && (
//                           <>
//                             <Badge colorScheme="orange" fontSize="10px" variant="outline">{video.subSubjectId?.name}</Badge>
//                             <Icon as={MdChevronRight} color="gray.400" />
//                           </>
//                         )}
//                         <Badge colorScheme="purple" fontSize="10px">{video.chapterId?.name || 'Chapter'}</Badge>
//                     </HStack>
//                 </VStack>
//             </Box>
//           </Box>
//         ))}
//       </SimpleGrid>

//       {/* EDIT MODAL */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent bg={cardBg}>
//           <ModalHeader color={textColor}>Edit Lecture Details</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <VStack spacing="15px">
//               <FormControl>
//                 <FormLabel>Title</FormLabel>
//                 <Input value={editingVideo?.title || ''} onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})} />
//               </FormControl>
//               <FormControl>
//                 <FormLabel>Description</FormLabel>
//                 <Textarea value={editingVideo?.description || ''} onChange={(e) => setEditingVideo({...editingVideo, description: e.target.value})} />
//               </FormControl>
//             </VStack>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
//             <Button colorScheme="brand" isLoading={loading} onClick={handleUpdateVideo}>Save Changes</Button>
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
  Text,
  useColorModeValue,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
  InputGroup,
  InputLeftElement,
  Select,
  Badge,
  SimpleGrid,
  Image,
  VStack,
  HStack,
  Textarea,
  Divider,
  AspectRatio,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Skeleton } from '@chakra-ui/react';
import {
  MdDelete,
  MdSearch,
  MdCloudUpload,
  MdPlayArrow,
  MdMoreVert,
  MdEdit,
  MdVideoLibrary,
  MdFolder,
  MdDescription,
  MdImage,
  MdChevronRight,
} from 'react-icons/md';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function VideoManagement() {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [topics, setTopics] = useState([]); // ✅ Naya State
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubSubject, setSelectedSubSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(''); // ✅ Naya State
  const [selectedChapter, setSelectedChapter] = useState('');

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);

  const [videoTitle, setVideoTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Edit State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingVideo, setEditingVideo] = useState(null);

  const videoInputRef = useRef();
  const thumbInputRef = useRef();
  const notesInputRef = useRef();

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const brandColor = useColorModeValue('brand.500', 'brand.400');
  const secondaryTextColor = useColorModeValue('gray.600', 'gray.400');
  const cardBorderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = React.useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // Per-level loading
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subSubjectsLoading, setSubSubjectsLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [videosLoading, setVideosLoading] = useState(false);

  // Request id refs to avoid race conditions (one ref per endpoint)
  const coursesReqRef = useRef(0);
  const subjectsReqRef = useRef(0);
  const subSubjectsReqRef = useRef(0);
  const topicsReqRef = useRef(0);
  const chaptersReqRef = useRef(0);
  const videosReqRef = useRef(0);

  // Fetch only courses on mount. Videos are fetched only after topic selection.
  const fetchCourses = React.useCallback(async () => {
    // console.log('BASE URL:', baseUrl);
    // console.log('Calling:', `${baseUrl}api/admin/courses`);

    const id = ++coursesReqRef.current;
    setCoursesLoading(true);
    try {
      const res = await axios.get(`${baseUrl}api/admin/courses`, { headers });
      if (id !== coursesReqRef.current) return; // stale
      setCourses(res.data.data || []);
    } catch (err) {
      toast({
        title: 'Fetch Error',
        description: 'Failed to load courses',
        status: 'error',
      });
    } finally {
      setCoursesLoading(false);
    }
  }, [baseUrl, headers, toast]);
  const fetchAllVideos = React.useCallback(async () => {
    const id = ++videosReqRef.current;
    setVideosLoading(true);
    try {
      const res = await axios.get(`${baseUrl}api/admin/videos`, { headers });
      if (id !== videosReqRef.current) return;
      setVideos(res.data.data || []);
    } catch (err) {
      toast({
        title: 'Fetch Error',
        description: 'Failed to load videos',
        status: 'error',
      });
    } finally {
      setVideosLoading(false);
    }
  }, [baseUrl, headers, toast]);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      await fetchCourses();
      await fetchAllVideos();
    };

    init();
  }, [token]);

  const fetchSubjects = React.useCallback(
    async (courseId) => {
      if (!courseId) return;
      const id = ++subjectsReqRef.current;
      setSubjectsLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}api/admin/subjects?courseId=${courseId}`,
          { headers },
        );
        if (id !== subjectsReqRef.current) return;
        setSubjects(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Fetch Error',
          description: 'Failed to load subjects',
          status: 'error',
        });
      } finally {
        setSubjectsLoading(false);
      }
    },
    [baseUrl, headers, toast],
  );

  const fetchSubSubjects = React.useCallback(
    async (subjectId) => {
      if (!subjectId) return;
      const id = ++subSubjectsReqRef.current;
      setSubSubjectsLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}api/admin/sub-subjects?subjectId=${subjectId}`,
          { headers },
        );
        if (id !== subSubjectsReqRef.current) return;
        setSubSubjects(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Fetch Error',
          description: 'Failed to load sub-subjects',
          status: 'error',
        });
      } finally {
        setSubSubjectsLoading(false);
      }
    },
    [baseUrl, headers, toast],
  );

  // Chapters depend on SubSubject; Topics depend on Chapter (strict hierarchical order)
  const fetchChapters = React.useCallback(
    async (subSubjectId) => {
      if (!subSubjectId) return;
      const id = ++chaptersReqRef.current;
      setChaptersLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}api/admin/chapters?subSubjectId=${subSubjectId}`,
          { headers },
        );
        if (id !== chaptersReqRef.current) return;
        setChapters(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Fetch Error',
          description: 'Failed to load chapters',
          status: 'error',
        });
      } finally {
        setChaptersLoading(false);
      }
    },
    [baseUrl, headers, toast],
  );

  const fetchTopics = React.useCallback(
    async (chapterId) => {
      if (!chapterId) return;
      const id = ++topicsReqRef.current;
      setTopicsLoading(true);
      try {
        const res = await axios.get(
          `${baseUrl}api/admin/topics?chapterId=${chapterId}`,
          { headers },
        );
        if (id !== topicsReqRef.current) return;
        setTopics(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Fetch Error',
          description: 'Failed to load topics',
          status: 'error',
        });
      } finally {
        setTopicsLoading(false);
      }
    },
    [baseUrl, headers, toast],
  );

  const fetchVideosForTopic = React.useCallback(
    async (topicId) => {
      if (!topicId) return;
      const id = ++videosReqRef.current;
      setVideosLoading(true);

      try {
        const res = await axios.get(
          `${baseUrl}api/admin/videos?topicId=${topicId}`,
          { headers },
        );
        if (id !== videosReqRef.current) return;
        setVideos(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Fetch Error',
          description: 'Failed to load videos',
          status: 'error',
        });
      } finally {
        setVideosLoading(false);
      }
    },
    [baseUrl, headers, toast],
  );

  // Handlers with strict dependency rules and reset of lower levels
  const handleCourseChange = React.useCallback(
    (id) => {
      setSelectedCourse(() => id);
      setSelectedSubject(() => '');
      setSelectedSubSubject(() => '');
      setSelectedTopic(() => '');
      setSelectedChapter(() => '');
      setSubjects([]);
      setSubSubjects([]);
      setTopics([]);
      setChapters([]);

      if (id) fetchSubjects(id);
    },
    [fetchSubjects],
  );

  const handleSubjectChange = React.useCallback(
    (id) => {
      setSelectedSubject(() => id);
      setSelectedSubSubject(() => '');
      setSelectedTopic(() => '');
      setSelectedChapter(() => '');
      setSubSubjects([]);
      setTopics([]);
      setChapters([]);

      if (id) fetchSubSubjects(id);
    },
    [fetchSubSubjects],
  );

  const handleSubSubjectChange = React.useCallback(
    (id) => {
      setSelectedSubSubject(() => id);
      setSelectedChapter(() => '');
      setSelectedTopic(() => '');
      setChapters([]);
      setTopics([]);

      if (id) fetchChapters(id);
    },
    [fetchChapters],
  );

  const handleChapterChange = React.useCallback(
    (id) => {
      setSelectedChapter(() => id);
      setSelectedTopic(() => '');
      setTopics([]);

      if (id) fetchTopics(id);
    },
    [fetchTopics],
  );

  const handleTopicChange = React.useCallback((id) => {
    setSelectedTopic(id);
  }, []);

  // const handleUploadVideo = async () => {
  //   if (!videoFile || !videoTitle || !selectedChapter || !selectedTopic) {
  //     return toast({
  //       title: 'Validation Error',
  //       description: 'Please provide Video Title, File, Topic and Chapter.',
  //       status: 'warning'
  //     });
  //   }

  //   const formData = new FormData();
  //   formData.append('video', videoFile);
  //   if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
  //   if (notesFile) formData.append('notes', notesFile);

  //   formData.append('title', videoTitle);
  //   formData.append('description', description);
  //   formData.append('courseId', selectedCourse);
  //   formData.append('subjectId', selectedSubject);
  //   formData.append('subSubjectId', selectedSubSubject);
  //   formData.append('topicId', selectedTopic); // ✅ Added TopicId
  //   formData.append('chapterId', selectedChapter);

  //   setLoading(true);
  //   try {
  //     await axios.post(`${baseUrl}api/admin/videos`, formData, {
  //       headers: { ...headers, 'Content-Type': 'multipart/form-data' }
  //     });
  //     toast({ title: 'Success', description: 'Lecture published successfully!', status: 'success' });
  //     setVideoFile(null); setThumbnailFile(null); setNotesFile(null);
  //     setVideoTitle(''); setDescription('');
  //     fetchData();
  //   } catch (err) {
  //     toast({ title: 'Upload Failed', description: err.response?.data?.message || 'Server Error', status: 'error' });
  //   } finally { setLoading(false); }
  // };
  const handleUploadVideo = async () => {
    // 1. Pehle console karke check karein ki value hai ya nahi
    console.log('Submitting Topic ID:', selectedTopic);
    console.log('Submitting Chapter ID:', selectedChapter);

    if (!videoFile || !videoTitle || !selectedChapter || !selectedTopic) {
      return toast({
        title: 'Validation Error',
        description: 'Please provide Video Title, File, Topic and Chapter.',
        status: 'warning',
      });
    }

    const formData = new FormData();

    // ✅ RULE: Saari TEXT fields pehle append karein (Files se pehle)
    formData.append('title', videoTitle);
    formData.append('description', description);
    formData.append('courseId', selectedCourse);
    formData.append('subjectId', selectedSubject);
    formData.append('subSubjectId', selectedSubSubject);
    formData.append('topicId', selectedTopic); // Ye ab pehle jayega
    formData.append('chapterId', selectedChapter);

    // ✅ Files ko aakhir mein append karein
    formData.append('video', videoFile);
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    if (notesFile) formData.append('notes', notesFile);

    setLoading(true);
    try {
      const res = await axios.post(`${baseUrl}api/admin/videos`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Agar success ho jaye
      console.log('Server Response:', res.data);
      toast({
        title: 'Success',
        description: 'Lecture published successfully!',
        status: 'success',
      });

      // Clear Form
      setVideoFile(null);
      setThumbnailFile(null);
      setNotesFile(null);
      setVideoTitle('');
      setDescription('');

      if (videoInputRef.current) videoInputRef.current.value = '';
      if (thumbInputRef.current) thumbInputRef.current.value = '';
      if (notesInputRef.current) notesInputRef.current.value = '';

      // Reset Dropdowns
      // Reset Dropdowns
      setSelectedCourse('');
      setSelectedSubject('');
      setSelectedSubSubject('');
      setSelectedChapter('');
      setSelectedTopic('');

      setSubjects([]);
      setSubSubjects([]);
      setChapters([]);
      setTopics([]);

      fetchAllVideos();
    } catch (err) {
      console.error('Upload Error Details:', err.response?.data);
      toast({
        title: 'Upload Failed',
        description: err.response?.data?.message || 'Server Error',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditClick = (video) => {
    setEditingVideo(video);
    onOpen();
  };

  const handleUpdateVideo = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${baseUrl}api/admin/videos/${editingVideo._id}`,
        {
          title: editingVideo.title,
          description: editingVideo.description,
        },
        { headers },
      );
      toast({ title: 'Updated', status: 'success' });
      onClose();
      fetchAllVideos();
    } catch (err) {
      toast({ title: 'Update Failed', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`${baseUrl}api/admin/videos/${id}`, { headers });
        toast({
          title: 'Deleted',
          description: 'Video removed from library',
          status: 'info',
        });
        fetchAllVideos();
      } catch (err) {
        toast({ title: 'Delete Error', status: 'error' });
      }
    }
  };

  const filteredVideos = videos.filter((v) =>
    v.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box pt={{ base: '150px', md: '80px' }} px="20px">
      {/* 1. UPLOAD FORM CARD */}
      <Card mb="30px" p="25px">
        <Flex align="center" mb="25px">
          <Icon
            as={MdVideoLibrary}
            w="28px"
            h="28px"
            color={brandColor}
            me="10px"
          />
          <Text fontSize="22px" fontWeight="700" color={textColor}>
            Publish New Lecture
          </Text>
        </Flex>

        <SimpleGrid
          columns={{ base: 1, md: 3, lg: 5 }}
          spacing="15px"
          mb="25px"
        >
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Course
            </FormLabel>
            {coursesLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Select
                variant="filled"
                placeholder="Select Course"
                value={selectedCourse}
                onChange={(e) => handleCourseChange(e.target.value)}
              >
                {courses.length === 0 ? (
                  <option value="">No courses</option>
                ) : (
                  courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))
                )}
              </Select>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Subject
            </FormLabel>
            {subjectsLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Select
                variant="filled"
                placeholder="Select Subject"
                value={selectedSubject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                isDisabled={!selectedCourse}
              >
                {!selectedCourse ? (
                  <option value="">Select a course first</option>
                ) : subjects.length === 0 ? (
                  <option value="">No subjects</option>
                ) : (
                  subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))
                )}
              </Select>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Sub-Subject
            </FormLabel>
            {subSubjectsLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Select
                variant="filled"
                placeholder="Select Sub-Subject"
                value={selectedSubSubject}
                onChange={(e) => handleSubSubjectChange(e.target.value)}
                isDisabled={!selectedSubject}
              >
                {!selectedSubject ? (
                  <option value="">Select a subject first</option>
                ) : subSubjects.length === 0 ? (
                  <option value="">No sub-subjects</option>
                ) : (
                  subSubjects.map((ss) => (
                    <option key={ss._id} value={ss._id}>
                      {ss.name}
                    </option>
                  ))
                )}
              </Select>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Chapter
            </FormLabel>
            {chaptersLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Select
                variant="filled"
                placeholder="Select Chapter"
                value={selectedChapter}
                onChange={(e) => handleChapterChange(e.target.value)}
                isDisabled={!selectedSubSubject}
              >
                {!selectedSubSubject ? (
                  <option value="">Select a sub-subject first</option>
                ) : chapters.length === 0 ? (
                  <option value="">No chapters</option>
                ) : (
                  chapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.name}
                    </option>
                  ))
                )}
              </Select>
            )}
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Topic
            </FormLabel>
            {topicsLoading ? (
              <Skeleton height="40px" />
            ) : (
              <Select
                variant="filled"
                placeholder="Select Topic"
                value={selectedTopic}
                onChange={(e) => handleTopicChange(e.target.value)}
                isDisabled={!selectedChapter}
              >
                {!selectedChapter ? (
                  <option value="">Select a chapter first</option>
                ) : topics.length === 0 ? (
                  <option value="">No topics</option>
                ) : (
                  topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))
                )}
              </Select>
            )}
          </FormControl>
        </SimpleGrid>

        <VStack spacing="20px" align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="700">
              Lecture Title
            </FormLabel>
            <Input
              variant="auth"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Ex: Chapter 1 - Physics Basics"
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="15px">
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="700">
                Video File
              </FormLabel>
              <input
                type="file"
                accept="video/*"
                hidden
                ref={videoInputRef}
                onChange={(e) => setVideoFile(e.target.files[0])}
              />
              <Button
                leftIcon={<MdPlayArrow />}
                onClick={() => videoInputRef.current.click()}
                w="full"
                variant="outline"
                colorScheme={videoFile ? 'green' : 'brand'}
              >
                {videoFile ? 'File Ready' : 'Select Video'}
              </Button>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="700">
                Thumbnail
              </FormLabel>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={thumbInputRef}
                onChange={(e) => setThumbnailFile(e.target.files[0])}
              />
              <Button
                leftIcon={<MdImage />}
                onClick={() => thumbInputRef.current.click()}
                w="full"
                variant="outline"
                colorScheme={thumbnailFile ? 'green' : 'orange'}
              >
                {thumbnailFile ? 'Image Ready' : 'Upload Image'}
              </Button>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="700">
                Notes (PDF - Optional)
              </FormLabel>
              <input
                type="file"
                accept=".pdf"
                hidden
                ref={notesInputRef}
                onChange={(e) => setNotesFile(e.target.files[0])}
              />
              <Button
                leftIcon={<MdDescription />}
                onClick={() => notesInputRef.current.click()}
                w="full"
                variant="outline"
                colorScheme={notesFile ? 'green' : 'purple'}
              >
                {notesFile ? 'PDF Attached' : 'Add Notes'}
              </Button>
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="700">
              Description
            </FormLabel>
            <Textarea
              variant="auth"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter lecture summary..."
            />
          </FormControl>

          <Button
            colorScheme="brand"
            size="lg"
            isLoading={loading}
            onClick={handleUploadVideo}
            w="full"
            h="55px"
          >
            PUBLISH LECTURE
          </Button>
        </VStack>
      </Card>

      {/* 2. LIBRARY SECTION */}
      <Flex justify="space-between" align="center" mb="25px">
        <Box>
          <Text color={textColor} fontSize="26px" fontWeight="800">
            Lecture Library
          </Text>
        </Box>
        <InputGroup maxW="300px">
          <InputLeftElement children={<MdSearch color="gray.300" />} />
          <Input
            borderRadius="full"
            variant="filled"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="25px">
        {videosLoading
          ? // show placeholders while videos load
            Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                bg={cardBg}
                borderRadius="20px"
                overflow="hidden"
                shadow="sm"
                border="1px solid"
                borderColor={cardBorderColor}
              >
                <Skeleton height="140px" />
                <Box p="18px">
                  <Skeleton height="16px" mb="8px" width="60%" />
                  <Skeleton height="12px" width="40%" />
                </Box>
              </Box>
            ))
          : filteredVideos.map((video) => (
              <Box
                key={video._id}
                bg={cardBg}
                borderRadius="20px"
                overflow="hidden"
                shadow="sm"
                border="1px solid"
                borderColor={cardBorderColor}
              >
                <Box position="relative">
                  <AspectRatio ratio={16 / 9}>
                    <Box
                      bg="black"
                      cursor="pointer"
                      onClick={() =>
                        window.open(`${baseUrl}${video.videoUrl}`, '_blank')
                      }
                    >
                      {video.thumbnailUrl ? (
                        <Image
                          src={`${baseUrl}${video.thumbnailUrl}`}
                          alt={video.title}
                          objectFit="cover"
                          w="full"
                          h="full"
                        />
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          h="full"
                          bg="gray.800"
                        >
                          <Icon
                            as={MdPlayArrow}
                            w="50px"
                            h="50px"
                            color="whiteAlpha.500"
                          />
                        </Flex>
                      )}
                    </Box>
                  </AspectRatio>
                </Box>

                <Box p="18px">
                  <Flex justify="space-between" mb="10px">
                    <VStack align="start" spacing="2px" flex="1">
                      <Text
                        fontWeight="700"
                        color={textColor}
                        fontSize="md"
                        noOfLines={1}
                      >
                        {video.title}
                      </Text>
                      <Text
                        fontSize="xs"
                        color={secondaryTextColor}
                        noOfLines={1}
                      >
                        {video.description || 'No description'}
                      </Text>
                    </VStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MdMoreVert />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<MdEdit />}
                          onClick={() => handleEditClick(video)}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          icon={<MdDelete />}
                          color="red.500"
                          onClick={() => handleDelete(video._id)}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>

                  <Divider my="12px" />

                  <VStack align="start" spacing="6px">
                    <HStack spacing="4px" wrap="wrap">
                      <Badge colorScheme="brand" fontSize="10px">
                        {video.courseId?.name || 'Course'}
                      </Badge>
                      <Icon as={MdChevronRight} color="gray.400" />
                      <Badge colorScheme="blue" fontSize="10px">
                        {video.subjectId?.name || 'Subject'}
                      </Badge>
                    </HStack>

                    <HStack spacing="4px" wrap="wrap">
                      {video.subSubjectId && (
                        <>
                          <Badge
                            colorScheme="orange"
                            fontSize="10px"
                            variant="outline"
                          >
                            {video.subSubjectId?.name}
                          </Badge>
                          <Icon as={MdChevronRight} color="gray.400" />
                        </>
                      )}
                      {video.topicId && (
                        <>
                          <Badge
                            colorScheme="teal"
                            fontSize="10px"
                            variant="solid"
                          >
                            {video.topicId?.name}
                          </Badge>
                          <Icon as={MdChevronRight} color="gray.400" />
                        </>
                      )}
                      <Badge colorScheme="purple" fontSize="10px">
                        {video.chapterId?.name || 'Chapter'}
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
              </Box>
            ))}
      </SimpleGrid>

      {/* EDIT MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Edit Lecture Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="15px">
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editingVideo?.title || ''}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, title: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editingVideo?.description || ''}
                  onChange={(e) =>
                    setEditingVideo({
                      ...editingVideo,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              isLoading={loading}
              onClick={handleUpdateVideo}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
