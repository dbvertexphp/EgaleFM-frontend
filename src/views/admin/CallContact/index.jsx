// // /* eslint-disable */
// // 'use client';

// // import {
// //   Box,
// //   Flex,
// //   Table,
// //   Tbody,
// //   Td,
// //   Text,
// //   Th,
// //   Thead,
// //   Tr,
// //   useColorModeValue,
// //   Input,
// //   InputGroup,
// //   InputLeftElement,
// //   Icon,
// //   useToast,
// //   Modal,
// //   ModalOverlay,
// //   ModalContent,
// //   ModalHeader,
// //   ModalBody,
// //   ModalFooter,
// //   ModalCloseButton,
// //   Button,
// //   Link,
// //   HStack,
// // } from '@chakra-ui/react';
// // import {
// //   createColumnHelper,
// //   flexRender,
// //   getCoreRowModel,
// //   useReactTable,
// // } from '@tanstack/react-table';
// // import axios from 'axios';
// // import * as React from 'react';
// // import { useNavigate, Link as RouterLink } from 'react-router-dom';
// // import {
// //   SearchIcon,
// //   ChevronLeftIcon,
// //   ChevronRightIcon,
// // } from '@chakra-ui/icons';

// // // Custom components
// // import Card from 'components/card/Card';

// // const columnHelper = createColumnHelper();

// // export default function ContactInquiriesTable() {
// //   const [data, setData] = React.useState([]);
// //   const [filteredData, setFilteredData] = React.useState([]);
// //   const [searchQuery, setSearchQuery] = React.useState('');
// //   const [loading, setLoading] = React.useState(true);
// //   const [error, setError] = React.useState(null);
// //   const [isModalOpen, setIsModalOpen] = React.useState(false);
// //   const [selectedMessage, setSelectedMessage] = React.useState('');
// //   const [currentPage, setCurrentPage] = React.useState(1);
// //   const itemsPerPage = 10;
// //   const textColor = useColorModeValue('gray.800', 'white');
// //   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
// //   const bgHover = useColorModeValue('gray.50', 'gray.700');
// //   const navigate = useNavigate();
// //   const toast = useToast();

// //   const baseUrl = process.env.REACT_APP_BASE_URL;
// //   const token = localStorage.getItem('token');

// //   // Fetch contact inquiries
// //   const fetchContactInquiries = async () => {
// //     try {
// //       if (!baseUrl || !token) {
// //         throw new Error('Missing base URL or authentication token');
// //       }
// //       setLoading(true);
// //       const response = await axios.get(
// //         `${baseUrl}api/CompanyDetails/contact/mobile`,
// //         {
// //           headers: { Authorization: `Bearer ${token}` },
// //         },
// //       );
// //       console.log('API Response (Contact Inquiries):', response.data);

// //       if (!response.data || !Array.isArray(response.data.data)) {
// //         throw new Error(
// //           'Invalid response format: Expected an array of contact inquiries',
// //         );
// //       }

// //       const formattedData = response.data.data.map((item) => ({
// //         id: item._id,
// //         subject: item.subject || 'N/A',
// //         mobile_number: item.mobile_number || item.user_id?.phone || 'N/A',
// //         message: item.message || 'N/A',
// //         user_name: item.user_id?.full_name || 'N/A',
// //         user_id: item.user_id?._id || 'N/A',
// //         timestamp: item.timestamp
// //           ? new Date(item.timestamp).toLocaleString() || 'N/A'
// //           : 'N/A',
// //       }));

// //       setData(formattedData);
// //       setFilteredData(formattedData);
// //       setLoading(false);
// //     } catch (err) {
// //       console.error('Fetch Contact Inquiries Error:', err);
// //       if (
// //         err.response?.data?.message === 'Not authorized, token failed' ||
// //         err.response?.data?.message ===
// //           'Session expired or logged in on another device' ||
// //         err.response?.data?.message ===
// //           'Un-Authorized, You are not authorized to access this route.' ||
// //         err.response?.data?.message === 'Not authorized, token failed'
// //       ) {
// //         localStorage.removeItem('token');
// //         navigate('/');
// //       } else {
// //         setError(err.message || 'Failed to fetch contact inquiries');
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   // Handle search filtering
// //   const handleSearch = (query) => {
// //     setSearchQuery(query);
// //     setCurrentPage(1); // Reset to first page on search
// //     if (!query) {
// //       setFilteredData(data);
// //       return;
// //     }
// //     const lowerQuery = query.toLowerCase();
// //     const filtered = data.filter(
// //       (item) =>
// //         item.subject.toLowerCase().includes(lowerQuery) ||
// //         item.mobile_number.toLowerCase().includes(lowerQuery) ||
// //         item.message.toLowerCase().includes(lowerQuery) ||
// //         item.user_name.toLowerCase().includes(lowerQuery),
// //     );
// //     setFilteredData(filtered);
// //   };

// //   // Pagination logic
// //   const totalItems = filteredData.length;
// //   const totalPages = Math.ceil(totalItems / itemsPerPage);
// //   const startIndex = (currentPage - 1) * itemsPerPage;
// //   const endIndex = startIndex + itemsPerPage;
// //   const paginatedData = React.useMemo(
// //     () => filteredData.slice(startIndex, endIndex),
// //     [filteredData, startIndex, endIndex],
// //   );

// //   // Handle page navigation
// //   const goToPage = (page) => {
// //     const newPage = Math.min(Math.max(1, page), totalPages);
// //     if (newPage !== currentPage) {
// //       setCurrentPage(newPage);
// //     }
// //   };

// //   // Reset page to 1 when total pages change
// //   React.useEffect(() => {
// //     if (totalPages > 0 && currentPage > totalPages) {
// //       setCurrentPage(1);
// //     }
// //   }, [totalPages, currentPage]);

// //   // Handle modal open/close
// //   const openModal = (message) => {
// //     setSelectedMessage(message);
// //     setIsModalOpen(true);
// //   };

// //   const closeModal = () => {
// //     setIsModalOpen(false);
// //     setSelectedMessage('');
// //   };

// //   React.useEffect(() => {
// //     fetchContactInquiries();
// //   }, [navigate]);

// //   const columns = React.useMemo(
// //     () => [
// //       columnHelper.display({
// //         id: 'sno',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             S.No
// //           </Text>
// //         ),
// //         cell: ({ row }) => {
// //           const serialNumber = (currentPage - 1) * itemsPerPage + row.index + 1;
// //           return (
// //             <Text color={textColor} fontSize="sm" fontWeight="500">
// //               {serialNumber}
// //             </Text>
// //           );
// //         },
// //       }),
// //       columnHelper.accessor('subject', {
// //         id: 'subject',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             Subject
// //           </Text>
// //         ),
// //         cell: (info) => (
// //           <Text color={textColor} fontSize="sm" fontWeight="500">
// //             {info.getValue()}
// //           </Text>
// //         ),
// //       }),
// //       columnHelper.accessor('user_name', {
// //         id: 'user_name',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             User Name
// //           </Text>
// //         ),
// //         cell: (info) => (
// //           <Flex align="center">
// //             {info.row.original.user_id !== 'N/A' ? (
// //               <Link
// //                 as={RouterLink}
// //                 to={`/admin/Dispute/UserDetails/${info.row.original.user_id}`}
// //                 color="blue.500"
// //                 textDecoration="underline"
// //                 fontSize="sm"
// //                 fontWeight="500"
// //                 _hover={{ textDecoration: 'underline' }}
// //               >
// //                 {info.getValue()}
// //               </Link>
// //             ) : (
// //               <Text color={textColor} fontSize="sm" fontWeight="500">
// //                 {info.getValue()}
// //               </Text>
// //             )}
// //           </Flex>
// //         ),
// //       }),
// //       columnHelper.accessor('mobile_number', {
// //         id: 'mobile_number',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             Mobile Number
// //           </Text>
// //         ),
// //         cell: (info) => (
// //           <Text color={textColor} fontSize="sm" fontWeight="500">
// //             {info.getValue()}
// //           </Text>
// //         ),
// //       }),
// //       columnHelper.accessor('message', {
// //         id: 'message',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             Message
// //           </Text>
// //         ),
// //         cell: (info) => {
// //           const message = info.getValue();
// //           const previewLength = 30;
// //           const isLongMessage = message.length > previewLength;
// //           const preview = isLongMessage
// //             ? `${message.slice(0, previewLength)}...`
// //             : message;
// //           return (
// //             <Flex align="center">
// //               <Text color={textColor} fontSize="sm" fontWeight="500">
// //                 {preview}
// //               </Text>
// //               {isLongMessage && (
// //                 <Link
// //                   color="blue.500"
// //                   fontSize="sm"
// //                   fontWeight="500"
// //                   ml="5px"
// //                   onClick={() => openModal(message)}
// //                   _hover={{ textDecoration: 'underline' }}
// //                 >
// //                   Read More
// //                 </Link>
// //               )}
// //             </Flex>
// //           );
// //         },
// //       }),
// //       columnHelper.accessor('timestamp', {
// //         id: 'timestamp',
// //         header: () => (
// //           <Text
// //             fontSize={{ sm: '12px', lg: '14px' }}
// //             fontWeight="bold"
// //             color="gray.500"
// //             textTransform="uppercase"
// //           >
// //             Timestamp
// //           </Text>
// //         ),
// //         cell: (info) => (
// //           <Text color={textColor} fontSize="sm" fontWeight="500">
// //             {info.getValue()}
// //           </Text>
// //         ),
// //       }),
// //     ],
// //     [textColor],
// //   );

// //   const table = useReactTable({
// //     data: paginatedData,
// //     columns,
// //     getCoreRowModel: getCoreRowModel(),
// //   });

// //   if (loading) {
// //     return (
// //       <Card
// //         w="100%"
// //         px={{ base: '15px', md: '25px' }}
// //         py="25px"
// //         borderRadius="16px"
// //         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
// //         bg={useColorModeValue('white', 'gray.800')}
// //         style={{ marginTop: '80px' }}
// //       >
// //         <Text color={textColor} fontSize="xl" fontWeight="700" p="15px">
// //           Loading...
// //         </Text>
// //       </Card>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Card
// //         w="100%"
// //         px={{ base: '15px', md: '25px' }}
// //         py="25px"
// //         borderRadius="16px"
// //         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
// //         bg={useColorModeValue('white', 'gray.800')}
// //         style={{ marginTop: '80px' }}
// //       >
// //         <Text color={textColor} fontSize="xl" fontWeight="700" p="15px">
// //           Error: {error}
// //         </Text>
// //       </Card>
// //     );
// //   }

// //   return (
// //     <>
// //       <Card
// //         w="100%"
// //         px={['15px', null, '25px']}
// //         py="25px"
// //         borderRadius="16px"
// //         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
// //         bg={useColorModeValue('white', 'gray.800')}
// //         style={{ marginTop: '80px' }}
// //       >
// //         <Flex
// //           direction={{ base: 'column', md: 'row' }}
// //           justify="space-between"
// //           align="center"
// //           mb="20px"
// //           px="10px"
// //         >
// //           <Text
// //             color={textColor}
// //             fontSize={{ base: 'xl', md: '2xl' }}
// //             fontWeight="700"
// //             lineHeight="100%"
// //           >
// //             Contact Inquiries
// //           </Text>
// //           <InputGroup
// //             maxW={{ base: '100%', md: '300px' }}
// //             mt={{ base: '10px', md: '0' }}
// //           >
// //             <InputLeftElement pointerEvents="none">
// //               <Icon as={SearchIcon} color="gray.400" />
// //             </InputLeftElement>
// //             <Input
// //               placeholder="Search by subject, user, mobile, or message"
// //               value={searchQuery}
// //               onChange={(e) => handleSearch(e.target.value)}
// //               borderRadius="12px"
// //               bg={useColorModeValue('gray.100', 'gray.700')}
// //               _focus={{
// //                 borderColor: 'blue.500',
// //                 boxShadow: '0 0 0 1px blue.500',
// //               }}
// //             />
// //           </InputGroup>
// //         </Flex>
// //         <Box overflowX="auto">
// //           <Table
// //             variant="simple"
// //             color="gray.500"
// //             mb="24px"
// //             mt="12px"
// //             borderRadius="12px"
// //             overflow="hidden"
// //           >
// //             <Thead bg={useColorModeValue('gray.100', 'gray.700')}>
// //               {table.getHeaderGroups().map((headerGroup) => (
// //                 <Tr key={headerGroup.id}>
// //                   {headerGroup.headers.map((header) => (
// //                     <Th
// //                       key={header.id}
// //                       pe="10px"
// //                       py="12px"
// //                       borderColor={borderColor}
// //                       fontSize={{ sm: '12px', lg: '14px' }}
// //                       textTransform="uppercase"
// //                       color="gray.500"
// //                       fontWeight="bold"
// //                     >
// //                       {flexRender(
// //                         header.column.columnDef.header,
// //                         header.getContext(),
// //                       )}
// //                     </Th>
// //                   ))}
// //                 </Tr>
// //               ))}
// //             </Thead>
// //             <Tbody>
// //               {table.getRowModel().rows.map((row) => (
// //                 <Tr
// //                   key={row.id}
// //                   _hover={{
// //                     bg: bgHover,
// //                     transition: 'background-color 0.2s ease',
// //                     cursor: 'pointer',
// //                   }}
// //                 >
// //                   {row.getVisibleCells().map((cell) => (
// //                     <Td
// //                       key={cell.id}
// //                       fontSize={{ sm: '14px' }}
// //                       minW={{ sm: '150px', md: '200px', lg: 'auto' }}
// //                       borderColor={borderColor}
// //                       py="12px"
// //                       px="10px"
// //                     >
// //                       {flexRender(
// //                         cell.column.columnDef.cell,
// //                         cell.getContext(),
// //                       )}
// //                     </Td>
// //                   ))}
// //                 </Tr>
// //               ))}
// //             </Tbody>
// //           </Table>
// //         </Box>
// //         <Flex
// //           justifyContent="space-between"
// //           alignItems="center"
// //           px="25px"
// //           py="10px"
// //         >
// //           <Text fontSize="sm" color={textColor}>
// //             Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
// //             {totalItems} inquiries
// //           </Text>
// //           <HStack>
// //             <Button
// //               size="sm"
// //               onClick={() => goToPage(currentPage - 1)}
// //               isDisabled={currentPage === 1}
// // 							colorScheme="teal"
// //               leftIcon={<ChevronLeftIcon />}
// //             >
// //               Previous
// //             </Button>
// //             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //               <Button
// //                 key={page}
// //                 size="sm"
// //                 onClick={() => goToPage(page)}
// // 								colorScheme="teal"
// //                 variant={currentPage === page ? 'solid' : 'outline'}
// //               >
// //                 {page}
// //               </Button>
// //             ))}
// //             <Button
// //               size="sm"
// //               onClick={() => goToPage(currentPage + 1)}
// // 							colorScheme="teal"
// //               isDisabled={currentPage === totalPages}
// //               rightIcon={<ChevronRightIcon />}
// //             >
// //               Next
// //             </Button>
// //           </HStack>
// //         </Flex>
// //       </Card>

// //       {/* Modal for full message */}
// //       <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
// //         <ModalOverlay bg="blackAlpha.600" />
// //         <ModalContent
// //           maxW={{ base: '90%', md: '600px' }}
// //           borderRadius="16px"
// //           bg={useColorModeValue('white', 'gray.800')}
// //           boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
// //         >
// //           <ModalHeader
// //             fontSize="lg"
// //             fontWeight="700"
// //             color={textColor}
// //             borderBottom="1px"
// //             borderColor={borderColor}
// //           >
// //             Full Message
// //           </ModalHeader>
// //           <ModalCloseButton color={textColor} />
// //           <ModalBody py="20px">
// //             <Text color={textColor} fontSize="sm" whiteSpace="pre-wrap">
// //               {selectedMessage}
// //             </Text>
// //           </ModalBody>
// //           <ModalFooter borderTop="1px" borderColor={borderColor}>
// //             <Button
// //               colorScheme="blue"
// //               onClick={closeModal}
// //               borderRadius="12px"
// //               size="sm"
// //               bg="blue.600"
// //               _hover={{ bg: 'blue.700' }}
// //             >
// //               Close
// //             </Button>
// //           </ModalFooter>
// //         </ModalContent>
// //       </Modal>
// //     </>
// //   );
// // }
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
//   Input,
//   InputGroup,
//   InputLeftElement,
//   Icon,
//   useToast,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   Button,
//   Link,
//   HStack,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import axios from 'axios';
// import * as React from 'react';
// import { useNavigate, Link as RouterLink } from 'react-router-dom';
// import {
//   SearchIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
// } from '@chakra-ui/icons';
// import { FaFileCsv } from 'react-icons/fa'; // Import CSV icon

// // Custom components
// import Card from 'components/card/Card';

// const columnHelper = createColumnHelper();

// export default function ContactInquiriesTable() {
//   const [data, setData] = React.useState([]);
//   const [filteredData, setFilteredData] = React.useState([]);
//   const [searchQuery, setSearchQuery] = React.useState('');
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [selectedMessage, setSelectedMessage] = React.useState('');
//   const [currentPage, setCurrentPage] = React.useState(1);
//   const itemsPerPage = 10;
//   const textColor = useColorModeValue('gray.800', 'white');
//   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
//   const bgHover = useColorModeValue('gray.50', 'gray.700');
//   const navigate = useNavigate();
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   // Fetch contact inquiries
//   const fetchContactInquiries = async () => {
//     try {
//       if (!baseUrl || !token) {
//         throw new Error('Missing base URL or authentication token');
//       }
//       setLoading(true);
//       const response = await axios.get(
//         `${baseUrl}api/CompanyDetails/contact/mobile`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       console.log('API Response (Contact Inquiries):', response.data);

//       if (!response.data || !Array.isArray(response.data.data)) {
//         throw new Error(
//           'Invalid response format: Expected an array of contact inquiries',
//         );
//       }

//       const formattedData = response.data.data.map((item) => ({
//         id: item._id,
//         subject: item.subject || 'N/A',
//         mobile_number: item.mobile_number || item.user_id?.phone || 'N/A',
//         message: item.message || 'N/A',
//         user_name: item.user_id?.full_name || 'N/A',
//         user_id: item.user_id?._id || 'N/A',
//         timestamp: item.timestamp
//           ? new Date(item.timestamp).toLocaleString() || 'N/A'
//           : 'N/A',
//       }));

//       setData(formattedData);
//       setFilteredData(formattedData);
//       setLoading(false);
//     } catch (err) {
//       console.error('Fetch Contact Inquiries Error:', err);
//       if (
//         err.response?.data?.message === 'Not authorized, token failed' ||
//         err.response?.data?.message ===
//           'Session expired or logged in on another device' ||
//         err.response?.data?.message ===
//           'Un-Authorized, You are not authorized to access this route.' ||
//         err.response?.data?.message === 'Not authorized, token failed'
//       ) {
//         localStorage.removeItem('token');
//         navigate('/');
//       } else {
//         setError(err.message || 'Failed to fetch contact inquiries');
//         setLoading(false);
//       }
//     }
//   };

//   // Handle search filtering
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     setCurrentPage(1); // Reset to first page on search
//     if (!query) {
//       setFilteredData(data);
//       return;
//     }
//     const lowerQuery = query.toLowerCase();
//     const filtered = data.filter(
//       (item) =>
//         item.subject.toLowerCase().includes(lowerQuery) ||
//         item.mobile_number.toLowerCase().includes(lowerQuery) ||
//         item.message.toLowerCase().includes(lowerQuery) ||
//         item.user_name.toLowerCase().includes(lowerQuery),
//     );
//     setFilteredData(filtered);
//   };

//   // Pagination logic
//   const totalItems = filteredData.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = React.useMemo(
//     () => filteredData.slice(startIndex, endIndex),
//     [filteredData, startIndex, endIndex],
//   );

//   // Handle page navigation
//   const goToPage = (page) => {
//     const newPage = Math.min(Math.max(1, page), totalPages);
//     if (newPage !== currentPage) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Reset page to 1 when total pages change
//   React.useEffect(() => {
//     if (totalPages > 0 && currentPage > totalPages) {
//       setCurrentPage(1);
//     }
//   }, [totalPages, currentPage]);

//   // Handle modal open/close
//   const openModal = (message) => {
//     setSelectedMessage(message);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedMessage('');
//   };

//   const handleExportCSV = () => {
//     if (data.length === 0) {
//       toast({
//         title: 'No data to export',
//         description: 'There are no contact inquiries to export.',
//         status: 'info',
//         duration: 3000,
//         isClosable: true,
//         position: 'top-right',
//       });
//       return;
//     }

//     // Define CSV headers
//     const headers = [
//       'S.No', 'Subject', 'User Name', 'Mobile Number', 'Message', 'Timestamp'
//     ];

//     // Map all data (not just paginated) to CSV rows
//     const csvRows = data.map((item, index) => [
//       index + 1, // S.No
//       `"${item.subject}"`,
//       `"${item.user_name}"`,
//       `"${item.mobile_number}"`,
//       `"${item.message.replace(/"/g, '""')}"`, // Handle quotes in message
//       `"${item.timestamp}"`,
//     ].join(','));

//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...csvRows
//     ].join('\n');

//     // Create a Blob and download it
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', 'contact_inquiries.csv');
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       toast({
//         title: 'Export Successful',
//         description: 'Contact inquiries exported to CSV.',
//         status: 'success',
//         duration: 3000,
//         isClosable: true,
//         position: 'top-right',
//       });
//     } else {
//       toast({
//         title: 'Export Failed',
//         description: 'Your browser does not support downloading files directly.',
//         status: 'error',
//         duration: 5000,
//         isClosable: true,
//         position: 'top-right',
//       });
//     }
//   };

//   React.useEffect(() => {
//     fetchContactInquiries();
//   }, [navigate]);

//   const columns = React.useMemo(
//     () => [
//       columnHelper.display({
//         id: 'sno',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             S.No
//           </Text>
//         ),
//         cell: ({ row }) => {
//           const serialNumber = (currentPage - 1) * itemsPerPage + row.index + 1;
//           return (
//             <Text color={textColor} fontSize="sm" fontWeight="500">
//               {serialNumber}
//             </Text>
//           );
//         },
//       }),
//       columnHelper.accessor('subject', {
//         id: 'subject',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             Subject
//           </Text>
//         ),
//         cell: (info) => (
//           <Text color={textColor} fontSize="sm" fontWeight="500">
//             {info.getValue()}
//           </Text>
//         ),
//       }),
//       columnHelper.accessor('user_name', {
//         id: 'user_name',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             User Name
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             {info.row.original.user_id !== 'N/A' ? (
//               <Link
//                 as={RouterLink}
//                 to={`/admin/Dispute/UserDetails/${info.row.original.user_id}`}
//                 color="blue.500"
//                 textDecoration="underline"
//                 fontSize="sm"
//                 fontWeight="500"
//                 _hover={{ textDecoration: 'underline' }}
//               >
//                 {info.getValue()}
//               </Link>
//             ) : (
//               <Text color={textColor} fontSize="sm" fontWeight="500">
//                 {info.getValue()}
//               </Text>
//             )}
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('mobile_number', {
//         id: 'mobile_number',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             Mobile Number
//           </Text>
//         ),
//         cell: (info) => (
//           <Text color={textColor} fontSize="sm" fontWeight="500">
//             {info.getValue()}
//           </Text>
//         ),
//       }),
//       columnHelper.accessor('message', {
//         id: 'message',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             Message
//           </Text>
//         ),
//         cell: (info) => {
//           const message = info.getValue();
//           const previewLength = 30;
//           const isLongMessage = message.length > previewLength;
//           const preview = isLongMessage
//             ? `${message.slice(0, previewLength)}...`
//             : message;
//           return (
//             <Flex align="center">
//               <Text color={textColor} fontSize="sm" fontWeight="500">
//                 {preview}
//               </Text>
//               {isLongMessage && (
//                 <Link
//                   color="blue.500"
//                   fontSize="sm"
//                   fontWeight="500"
//                   ml="5px"
//                   onClick={() => openModal(message)}
//                   _hover={{ textDecoration: 'underline' }}
//                 >
//                   Read More
//                 </Link>
//               )}
//             </Flex>
//           );
//         },
//       }),
//       columnHelper.accessor('timestamp', {
//         id: 'timestamp',
//         header: () => (
//           <Text
//             fontSize={{ sm: '12px', lg: '14px' }}
//             fontWeight="bold"
//             color="gray.500"
//             textTransform="uppercase"
//           >
//             Timestamp
//           </Text>
//         ),
//         cell: (info) => (
//           <Text color={textColor} fontSize="sm" fontWeight="500">
//             {info.getValue()}
//           </Text>
//         ),
//       }),
//     ],
//     [textColor, currentPage], // Added currentPage to dependency array for S.No
//   );

//   const table = useReactTable({
//     data: paginatedData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   if (loading) {
//     return (
//       <Card
//         w="100%"
//         px={{ base: '15px', md: '25px' }}
//         py="25px"
//         borderRadius="16px"
//         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
//         bg={useColorModeValue('white', 'gray.800')}
//         style={{ marginTop: '80px' }}
//       >
//         <Text color={textColor} fontSize="xl" fontWeight="700" p="15px">
//           Loading...
//         </Text>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card
//         w="100%"
//         px={{ base: '15px', md: '25px' }}
//         py="25px"
//         borderRadius="16px"
//         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
//         bg={useColorModeValue('white', 'gray.800')}
//         style={{ marginTop: '80px' }}
//       >
//         <Text color={textColor} fontSize="xl" fontWeight="700" p="15px">
//           Error: {error}
//         </Text>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <Card
//         w="100%"
//         px={['15px', null, '25px']}
//         py="25px"
//         borderRadius="16px"
//         boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)"
//         bg={useColorModeValue('white', 'gray.800')}
//         style={{ marginTop: '80px' }}
//       >
//         <Flex
//           direction={{ base: 'column', md: 'row' }}
//           justify="space-between"
//           align="center"
//           mb="20px"
//           px="10px"
//         >
//           <Text
//             color={textColor}
//             fontSize={{ base: 'xl', md: '2xl' }}
//             fontWeight="700"
//             lineHeight="100%"
//           >
//             Contact Inquiries
//           </Text>
//           <HStack spacing="10px" mt={{ base: '10px', md: '0' }}>
//             <InputGroup maxW={{ base: '100%', md: '300px' }}>
//               <InputLeftElement pointerEvents="none">
//                 <Icon as={SearchIcon} color="gray.400" />
//               </InputLeftElement>
//               <Input
//                 placeholder="Search by subject, user, mobile, or message"
//                 value={searchQuery}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 borderRadius="12px"
//                 bg={useColorModeValue('gray.100', 'gray.700')}
//                 _focus={{
//                   borderColor: 'blue.500',
//                   boxShadow: '0 0 0 1px blue.500',
//                 }}
//               />
//             </InputGroup>
//             <Button
//               leftIcon={<Icon as={FaFileCsv} />}
//               colorScheme="green"
//               onClick={handleExportCSV}
//               borderRadius="12px"
//               size={{ base: 'sm', md: 'md' }}
//             >
//               Export
//             </Button>
//           </HStack>
//         </Flex>
//         <Box overflowX="auto">
//           <Table
//             variant="simple"
//             color="gray.500"
//             mb="24px"
//             mt="12px"
//             borderRadius="12px"
//             overflow="hidden"
//           >
//             <Thead bg={useColorModeValue('gray.100', 'gray.700')}>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <Tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <Th
//                       key={header.id}
//                       pe="10px"
//                       py="12px"
//                       borderColor={borderColor}
//                       fontSize={{ sm: '12px', lg: '14px' }}
//                       textTransform="uppercase"
//                       color="gray.500"
//                       fontWeight="bold"
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                     </Th>
//                   ))}
//                 </Tr>
//               ))}
//             </Thead>
//             <Tbody>
//               {table.getRowModel().rows.map((row) => (
//                 <Tr
//                   key={row.id}
//                   _hover={{
//                     bg: bgHover,
//                     transition: 'background-color 0.2s ease',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <Td
//                       key={cell.id}
//                       fontSize={{ sm: '14px' }}
//                       minW={{ sm: '150px', md: '200px', lg: 'auto' }}
//                       borderColor={borderColor}
//                       py="12px"
//                       px="10px"
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </Td>
//                   ))}
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </Box>
//         <Flex
//           justifyContent="space-between"
//           alignItems="center"
//           px="25px"
//           py="10px"
//         >
//           <Text fontSize="sm" color={textColor}>
//             Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
//             {totalItems} inquiries
//           </Text>
//           <HStack>
//             <Button
//               size="sm"
//               onClick={() => goToPage(currentPage - 1)}
//               isDisabled={currentPage === 1}
// 							colorScheme="teal"
//               leftIcon={<ChevronLeftIcon />}
//             >
//               Previous
//             </Button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 size="sm"
//                 onClick={() => goToPage(page)}
// 								colorScheme="teal"
//                 variant={currentPage === page ? 'solid' : 'outline'}
//               >
//                 {page}
//               </Button>
//             ))}
//             <Button
//               size="sm"
//               onClick={() => goToPage(currentPage + 1)}
// 							colorScheme="teal"
//               isDisabled={currentPage === totalPages}
//               rightIcon={<ChevronRightIcon />}
//             >
//               Next
//             </Button>
//           </HStack>
//         </Flex>
//       </Card>

//       {/* Modal for full message */}
//       <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
//         <ModalOverlay bg="blackAlpha.600" />
//         <ModalContent
//           maxW={{ base: '90%', md: '600px' }}
//           borderRadius="16px"
//           bg={useColorModeValue('white', 'gray.800')}
//           boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
//         >
//           <ModalHeader
//             fontSize="lg"
//             fontWeight="700"
//             color={textColor}
//             borderBottom="1px"
//             borderColor={borderColor}
//           >
//             Full Message
//           </ModalHeader>
//           <ModalCloseButton color={textColor} />
//           <ModalBody py="20px">
//             <Text color={textColor} fontSize="sm" whiteSpace="pre-wrap">
//               {selectedMessage}
//             </Text>
//           </ModalBody>
//           <ModalFooter borderTop="1px" borderColor={borderColor}>
//             <Button
//               colorScheme="blue"
//               onClick={closeModal}
//               borderRadius="12px"
//               size="sm"
//               bg="blue.600"
//               _hover={{ bg: 'blue.700' }}
//             >
//               Close
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }

/* eslint-disable */
'use client';

import {
  Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
  Input, InputGroup, InputLeftElement, useToast, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  Button, HStack, IconButton, Badge, useDisclosure, Tabs, TabList, Tab
} from '@chakra-ui/react';
import {
  createColumnHelper, flexRender, getCoreRowModel, useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import * as React from 'react';
import { MdSearch, MdVisibility, MdDelete } from 'react-icons/md';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// Custom component for styling
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function UserComplaintsTable() {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedMessage, setSelectedMessage] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(0); // 0 for Mobile, 1 for Email

  const itemsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgHover = useColorModeValue('gray.50', 'gray.700');

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = React.useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // --- Fetch Data ---
  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      // Aapke backend endpoints ke hisab se condition
      const endpoint = activeTab === 0 
        ? 'api/CompanyDetails/get-mobile-queries' 
        : 'api/CompanyDetails/get-email-queries';

      const res = await axios.get(`${baseUrl}${endpoint}`, { headers });
      
      if (res.data.success) {
        const formatted = res.data.data.map((item) => ({
          id: item._id,
          userName: item.user_id?.full_name || 'Anonymous',
          contactInfo: activeTab === 0 ? item.mobile_number : item.email,
          subject: item.subject,
          message: item.message,
          date: item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'
        }));
        setData(formatted);
        setFilteredData(formatted);
      }
    } catch (err) {
      toast({ title: "Failed to load inquiries", status: "error", isClosable: true });
    } finally {
      setLoading(false);
    }
  }, [activeTab, baseUrl, headers, toast]);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  // --- Delete Logic ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const delEndpoint = activeTab === 0 
        ? `api/CompanyDetails/delete-mobile-query/${id}` 
        : `api/CompanyDetails/delete-email-query/${id}`;

      await axios.delete(`${baseUrl}${delEndpoint}`, { headers });
      toast({ title: "Deleted Successfully", status: "success" });
      fetchData();
    } catch (err) {
      toast({ title: "Delete Failed", status: "error" });
    }
  };

  // --- Search & Pagination ---
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = data.filter(item => 
      item.userName.toLowerCase().includes(query.toLowerCase()) ||
      item.contactInfo.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // --- Table Columns ---
  const columns = React.useMemo(() => [
    columnHelper.display({
      id: 'sno',
      header: 'S.No',
      cell: (info) => <Text color={textColor} fontSize="sm" fontWeight="600">{(currentPage - 1) * itemsPerPage + info.row.index + 1}</Text>
    }),
    columnHelper.accessor('userName', { 
      header: 'Customer Name',
      cell: (info) => <Text color={textColor} fontSize="sm" fontWeight="700">{info.getValue()}</Text>
    }),
    columnHelper.accessor('contactInfo', { 
      header: activeTab === 0 ? 'Mobile No.' : 'Email Address',
      cell: (info) => <Text fontSize="sm">{info.getValue()}</Text>
    }),
    columnHelper.accessor('subject', { 
      header: 'Complaint Subject',
      cell: (info) => <Badge colorScheme="blue" borderRadius="8px">{info.getValue()}</Badge>
    }),
    columnHelper.accessor('date', { header: 'Received On' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <HStack spacing="2">
          <IconButton 
            icon={<MdVisibility />} 
            size="sm" 
            colorScheme="brand" 
            variant="light" 
            onClick={() => { setSelectedMessage(info.row.original.message); onOpen(); }} 
          />
          <IconButton 
            icon={<MdDelete />} 
            size="sm" 
            colorScheme="red" 
            variant="light" 
            onClick={() => handleDelete(info.row.original.id)} 
          />
        </HStack>
      )
    }),
  ], [currentPage, textColor, activeTab]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Card p="20px">
        <Flex direction="column" mb="24px">
          <Flex justify="space-between" align="center" mb="15px">
             <Text fontSize="22px" fontWeight="700" color={textColor}>User Inquiries & Complaints</Text>
             <InputGroup maxW="250px">
               <InputLeftElement children={<MdSearch color="gray.400" />} />
               <Input placeholder="Search name/contact..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} borderRadius="10px" />
             </InputGroup>
          </Flex>

          <Tabs variant="soft-rounded" colorScheme="brand" onChange={(index) => setActiveTab(index)}>
            <TabList>
              <Tab fontSize="sm">Mobile Queries</Tab>
              <Tab fontSize="sm">Email Queries</Tab>
            </TabList>
          </Tabs>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" color="gray.500">
            <Thead>
              {table.getHeaderGroups().map(hg => (
                <Tr key={hg.id}>
                  {hg.headers.map(header => (
                    <Th key={header.id} borderColor={borderColor}>{flexRender(header.column.columnDef.header, header.getContext())}</Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody>
              {loading ? <Tr><Td colSpan={6} textAlign="center">Loading...</Td></Tr> : 
                table.getRowModel().rows.map(row => (
                  <Tr key={row.id} _hover={{ bg: bgHover }}>
                    {row.getVisibleCells().map(cell => (
                      <Td key={cell.id} borderColor={borderColor} fontSize="sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))
              }
            </Tbody>
          </Table>
        </Box>

        {/* Pagination */}
        <Flex justify="space-between" align="center" mt="20px" px="10px">
          <Text fontSize="sm">Showing page {currentPage}</Text>
          <HStack>
            <IconButton icon={<ChevronLeftIcon />} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} isDisabled={currentPage === 1} />
            <IconButton icon={<ChevronRightIcon />} onClick={() => setCurrentPage(p => p + 1)} isDisabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)} />
          </HStack>
        </Flex>
      </Card>

      {/* View Message Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="15px">
          <ModalHeader>User Message Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p="4" bg={useColorModeValue('gray.50', 'navy.900')} borderRadius="10px">
              <Text fontSize="md">{selectedMessage || "No message content available."}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}