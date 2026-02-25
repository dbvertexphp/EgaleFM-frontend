// /* eslint-disable */
// 'use client';

// import {
//   Box,
//   Flex,
//   Text,
//   useColorModeValue,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Spinner,
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Avatar,
//   Badge,
//   IconButton,
//   Tooltip,
//   SimpleGrid,
//   Icon,
// } from '@chakra-ui/react';
// import { SearchIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
// import { MdPeople, MdSchool } from 'react-icons/md';
// import axios from 'axios';
// import * as React from 'react';
// import Card from 'components/card/Card'; // Aapka Card component

// export default function FacultyList() {
//   const [faculties, setFaculties] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [searchTerm, setSearchTerm] = React.useState('');

//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const bgItem = useColorModeValue('gray.50', 'navy.700');
  
//   // Base URL aur Token
//   const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:4000/';
//   const token = localStorage.getItem('token');

//   // 1. Fetch Faculty List from API
//   const fetchFaculties = async () => {
//     try {
//       setLoading(true);
//       // Endpoint as per your request: router.get('/list')
//       const response = await axios.get(`${baseUrl}api/faculty/list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       // Agar backend se response.data.data me array aa raha hai
//       if (response.data.success) {
//         setFaculties(response.data.data);
//       } else {
//         setFaculties(response.data); // Agar direct array aa raha hai
//       }
//     } catch (err) {
//       console.error('Error fetching faculty list', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchFaculties();
//   }, []);

//   // 2. Search Filter
//   const filteredData = faculties.filter(
//     (f) =>
//       f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       f.degree?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      
//       {/* 📊 Header Stats (Optional) */}
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb="20px">
//         <StatsCard
//           icon={MdPeople}
//           title="Total Faculty"
//           stat={faculties.length}
//         />
//         <StatsCard
//           icon={MdSchool}
//           title="Academic Staff"
//           stat={faculties.filter(f => f.degree.includes('Ph.D') || f.degree.includes('Dr')).length}
//         />
//       </SimpleGrid>

//       {/* 🟢 Main Table Card */}
//       <Card
//         flexDirection="column"
//         w="100%"
//         px="25px"
//         py="25px"
//         boxShadow="lg"
//         borderRadius="20px"
//       >
//         <Flex
//           mb="30px"
//           justifyContent="space-between"
//           align="center"
//           direction={{ base: 'column', md: 'row' }}
//           gap={4}
//         >
//           <Box>
//             <Text color={textColor} fontSize="22px" fontWeight="700">
//               Faculty Directory
//             </Text>
//             <Text color="secondaryGray.600" fontSize="sm">
//               View and manage all registered faculty members
//             </Text>
//           </Box>

//           <InputGroup maxW="400px">
//             <InputLeftElement children={<SearchIcon color="gray.400" />} />
//             <Input
//               variant="filled"
//               placeholder="Search by Name or Degree..."
//               onChange={(e) => setSearchTerm(e.target.value)}
//               borderRadius="12px"
//             />
//           </InputGroup>
//         </Flex>

//         {loading ? (
//           <Flex justify="center" align="center" minH="300px">
//             <Spinner size="xl" color="brand.500" />
//           </Flex>
//         ) : (
//           <Box overflowX="auto">
//             <Table variant="simple" color="gray.500" mb="24px">
//               <Thead bg={bgItem}>
//                 <Tr>
//                   <Th color="gray.400">Faculty Member</Th>
//                   <Th color="gray.400">Degree</Th>
//                   <Th color="gray.400">Description</Th>
//                   <Th color="gray.400" textAlign="center">Actions</Th>
//                 </Tr>
//               </Thead>

//               <Tbody>
//                 {filteredData.map((row, i) => (
//                   <Tr key={i} _hover={{ bg: bgItem }} transition="0.2s">
//                     {/* Image & Name */}
//                     <Td>
//                       <Flex align="center">
//                         <Avatar
//                           size="md"
//                           src={`${baseUrl}${row.image}`}
//                           name={row.name}
//                           mr="15px"
//                           borderRadius="12px"
//                         />
//                         <Box>
//                           <Text color={textColor} fontSize="sm" fontWeight="700">
//                             {row.name}
//                           </Text>
//                           <Badge colorScheme="brand" variant="subtle" fontSize="10px">
//                             Faculty
//                           </Badge>
//                         </Box>
//                       </Flex>
//                     </Td>

//                     {/* Degree */}
//                     <Td>
//                       <Text color={textColor} fontSize="sm" fontWeight="600">
//                         {row.degree}
//                       </Text>
//                     </Td>

//                     {/* Description */}
//                     <Td maxW="300px">
//                       <Tooltip label={row.description} hasArrow>
//                         <Text fontSize="xs" noOfLines={2} color="secondaryGray.600">
//                           {row.description}
//                         </Text>
//                       </Tooltip>
//                     </Td>

//                     {/* Actions */}
//                     <Td>
//                       <Flex justify="center" gap={2}>
//                         <IconButton
//                           icon={<EditIcon />}
//                           size="sm"
//                           variant="ghost"
//                           colorScheme="blue"
//                           aria-label="Edit faculty"
//                         />
//                         <IconButton
//                           icon={<DeleteIcon />}
//                           size="sm"
//                           variant="ghost"
//                           colorScheme="red"
//                           aria-label="Delete faculty"
//                         />
//                       </Flex>
//                     </Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>

//             {filteredData.length === 0 && (
//               <Flex direction="column" align="center" py="10">
//                 <Text color="gray.500" fontWeight="600">No faculty members found.</Text>
//               </Flex>
//             )}
//           </Box>
//         )}
//       </Card>
//     </Box>
//   );
// }

// // Stats Card Component
// function StatsCard({ icon, title, stat }) {
//   const bgCard = useColorModeValue('white', 'navy.800');
//   const textColor = useColorModeValue('secondaryGray.900', 'white');

//   return (
//     <Card py="15px" bg={bgCard}>
//       <Flex align="center" px="15px">
//         <Icon as={icon} w="40px" h="40px" color="brand.500" mr="15px" />
//         <Box>
//           <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
//             {title}
//           </Text>
//           <Text color={textColor} fontSize="xl" fontWeight="700">
//             {stat}
//           </Text>
//         </Box>
//       </Flex>
//     </Card>
//   );
// }



/* eslint-disable */
'use client';

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  SimpleGrid,
  Icon,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
} from '@chakra-ui/react';
import { SearchIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { MdPeople, MdSchool } from 'react-icons/md';
import axios from 'axios';
import * as React from 'react';
import Card from 'components/card/Card';

export default function FacultyList() {
  const [faculties, setFaculties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Edit State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFaculty, setSelectedFaculty] = React.useState(null);
  const [editData, setEditData] = React.useState({ name: '', degree: '', description: '' });
  const [editImage, setEditImage] = React.useState(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgItem = useColorModeValue('gray.50', 'navy.700');
  
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/';
  const token = localStorage.getItem('token');

  // 1. Fetch List
const fetchFaculties = async () => {
  try {
    setLoading(true);
    // API call check karein (baseUrl ke baad slash ka dhyan rakhein)
    const response = await axios.get(`${baseUrl}api/faculty/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Backend Response:", response.data); // Debugging ke liye

    // Agar backend se { success: true, data: [...] } aa raha hai
    if (response.data && response.data.success) {
      setFaculties(response.data.data); 
    } else if (Array.isArray(response.data)) {
      // Agar backend se direct array [...] aa raha hai
      setFaculties(response.data);
    }
  } catch (err) {
    console.error('Error fetching faculty list:', err);
  } finally {
    setLoading(false);
  }
};

  React.useEffect(() => {
    fetchFaculties();
  }, []);

  // 2. Delete Function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        const response = await axios.delete(`${baseUrl}api/faculty/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          toast({ title: "Deleted!", status: "success", duration: 3000 });
          fetchFaculties(); // Refresh list
        }
      } catch (err) {
        toast({ title: "Delete Failed", status: "error", duration: 3000 });
      }
    }
  };

  // 3. Open Edit Modal
  const openEditModal = (faculty) => {
    setSelectedFaculty(faculty);
    setEditData({ name: faculty.name, degree: faculty.degree, description: faculty.description });
    onOpen();
  };

  // 4. Handle Update
  const handleUpdate = async () => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append('name', editData.name);
    formData.append('degree', editData.degree);
    formData.append('description', editData.description);
    if (editImage) formData.append('image', editImage);

    try {
      const response = await axios.put(`${baseUrl}api/faculty/edit/${selectedFaculty._id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      if (response.data.success) {
        toast({ title: "Updated Successfully", status: "success", duration: 3000 });
        onClose();
        fetchFaculties();
      }
    } catch (err) {
      toast({ title: "Update Failed", status: "error", duration: 3000 });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredData = faculties.filter(
    (f) =>
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.degree?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="20px" mb="20px">
        <StatsCard icon={MdPeople} title="Total Faculty" stat={faculties.length} />
        <StatsCard icon={MdSchool} title="Departments" stat="Academic" />
      </SimpleGrid>

      <Card flexDirection="column" w="100%" px="25px" py="25px" boxShadow="lg" borderRadius="20px">
        <Flex mb="30px" justifyContent="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
          <Box>
            <Text color={textColor} fontSize="22px" fontWeight="700">Faculty </Text>
            <Text color="secondaryGray.600" fontSize="sm">Manage all registered faculty members</Text>
          </Box>
          <InputGroup maxW="400px">
            <InputLeftElement children={<SearchIcon color="gray.400" />} />
            <Input variant="filled" placeholder="Search by Name..." onChange={(e) => setSearchTerm(e.target.value)} borderRadius="12px" />
          </InputGroup>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="300px"><Spinner size="xl" color="brand.500" /></Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px">
              <Thead bg={bgItem}>
                <Tr>
                  <Th color="gray.400">Faculty Member</Th>
                  <Th color="gray.400">Degree</Th>
                  <Th color="gray.400">Description</Th>
                  <Th color="gray.400" textAlign="center">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData.map((row, i) => (
                  <Tr key={i} _hover={{ bg: bgItem }} transition="0.2s">
                    <Td>
                      <Flex align="center">
                        <Avatar size="md" src={`${baseUrl}uploads/${row.image}`} name={row.name} mr="15px" borderRadius="12px" />
                        <Box>
                          <Text color={textColor} fontSize="sm" fontWeight="700">{row.name}</Text>
                          <Badge colorScheme="brand" variant="subtle" fontSize="10px">Faculty</Badge>
                        </Box>
                      </Flex>
                    </Td>
                    <Td><Text color={textColor} fontSize="sm" fontWeight="600">{row.degree}</Text></Td>
                    <Td maxW="300px">
                      <Tooltip label={row.description} hasArrow>
                        <Text fontSize="xs" noOfLines={2}>{row.description}</Text>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Flex justify="center" gap={2}>
                        <IconButton icon={<EditIcon />} size="sm" colorScheme="blue" variant="ghost" onClick={() => openEditModal(row)} />
                        <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => handleDelete(row._id)} />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      {/* --- EDIT MODAL --- */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius="20px">
          <ModalHeader>Edit Faculty Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Name</FormLabel>
              <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Degree</FormLabel>
              <Input value={editData.degree} onChange={(e) => setEditData({...editData, degree: e.target.value})} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Textarea value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Update Image (Optional)</FormLabel>
              <Input type="file" p={1} onChange={(e) => setEditImage(e.target.files[0])} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="brand" isLoading={isUpdating} onClick={handleUpdate}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function StatsCard({ icon, title, stat }) {
  const bgCard = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <Card py="15px" bg={bgCard}>
      <Flex align="center" px="15px">
        <Icon as={icon} w="40px" h="40px" color="brand.500" mr="15px" />
        <Box><Text color="secondaryGray.600" fontSize="sm">{title}</Text><Text color={textColor} fontSize="xl" fontWeight="700">{stat}</Text></Box>
      </Flex>
    </Card>
  );
}