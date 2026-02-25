/* eslint-disable */
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
//   Image,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   Link,
//   Button,
//   Input,
//   InputGroup,
//   InputLeftElement,
// } from '@chakra-ui/react';
// import {
//   createColumnHelper,
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import axios from 'axios';
// import * as React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SearchIcon } from '@chakra-ui/icons';
// import defaultProfilePic from 'assets/img/profile/profile.webp';
// // Custom components
// import Card from 'components/card/Card';

// const columnHelper = createColumnHelper();

// export default function PromotionsTable() {
//   const [data, setData] = React.useState([]);
//   const [filteredData, setFilteredData] = React.useState([]); // New state for filtered data
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const [selectedImages, setSelectedImages] = React.useState([]);
//   const [selectedImage, setSelectedImage] = React.useState(null);
//   const [searchTerm, setSearchTerm] = React.useState(''); // New search state
//   const {
//     isOpen: isImagesOpen,
//     onOpen: onImagesOpen,
//     onClose: onImagesClose,
//   } = useDisclosure();
//   const {
//     isOpen: isImageOpen,
//     onOpen: onImageOpen,
//     onClose: onImageClose,
//   } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
//   const navigate = useNavigate();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   // Capitalize first letter of each word
//   const capitalizeWords = (str) => {
//     if (!str) return str;
//     return str
//       .toLowerCase()
//       .split(' ')
//       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   // Search function
//   const handleSearch = (searchValue) => {
//     setSearchTerm(searchValue);
    
//     if (!searchValue.trim()) {
//       // If search is empty, show all data
//       setFilteredData(data);
//       return;
//     }

//     // Filter data based on multiple fields
//     const filtered = data.filter((item) =>
//       item.uniqueId?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       item.user?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       item.phone?.toLowerCase().includes(searchValue.toLowerCase())
//     );
    
//     setFilteredData(filtered);
//   };

//   // Clear search function
//   const handleClearSearch = () => {
//     setSearchTerm('');
//     setFilteredData(data);
//   };

//   // Fetch promotions
//   const fetchPromotions = async () => {
//     try {
//       if (!baseUrl || !token) {
//         throw new Error('Missing base URL or authentication token');
//       }
//       setLoading(true);
//       const response = await axios.get(
//         `${baseUrl}api/promotion/getAllPromotions`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );
//       console.log('API Response (Promotions):', response.data);

//       if (!response.data || !Array.isArray(response.data.data)) {
//         throw new Error(
//           'Invalid response format: Expected an array of promotions',
//         );
//       }

//       const formattedData = response.data.data.map((item) => {
//         const images =
//           item.images?.map((img) => {
//             const fullImageUrl = `${baseUrl}${img}`;
//             console.log('Constructed Image URL:', fullImageUrl);
//             return fullImageUrl;
//           }) || [];
//         return {
//           id: item._id,
//           title: capitalizeWords(item.title) || 'Untitled',
//           uniqueId: item.unique_id || 'N/A',
//           description: item.description || 'No description',
//           images,
//           date: item.date || 'N/A',
//           user: capitalizeWords(item.user_id?.full_name) || 'Unknown',
//           userId: item.user_id?._id || '',
//           paymentId: item.paymentId || 'N/A',
//           amount: item.amount || 'N/A',
//           phone: item.phone || 'N/A',
//           createdAt: new Date(item.createdAt).toLocaleString(),
//         };
//       });

//       setData(formattedData);
//       setFilteredData(formattedData); // Initialize filtered data with all data
//       setLoading(false);
//     } catch (err) {
//       console.error('Fetch Promotions Error:', err);
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
//         setError(err.message || 'Failed to fetch promotions');
//         setLoading(false);
//       }
//     }
//   };

//   // Handle image modal
//   const handleViewImages = (images) => {
//     console.log('Selected Images for Modal:', images);
//     setSelectedImages(images);
//     onImagesOpen();
//   };

//   // Handle single image click
//   const handleImageClick = (image) => {
//     console.log('Clicked Image:', image);
//     setSelectedImage(image);
//     onImageOpen();
//   };

//   // Update filtered data when search term changes
//   React.useEffect(() => {
//     handleSearch(searchTerm);
//   }, [searchTerm]);

//   // Initial data fetch
//   React.useEffect(() => {
//     fetchPromotions();
//   }, [navigate]);

//   const columns = React.useMemo(
//     () => [
//       columnHelper.accessor('id', {
//         id: 'sno',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             S.No
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.row.index + 1}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('uniqueId', {
//         id: 'uniqueId',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Unique ID
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('title', {
//         id: 'title',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Title
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('user', {
//         id: 'user',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Username
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Link
//               href={`/admin/UserDetails/${info.row.original.userId}`}
//               color="blue.500"
//               fontSize="sm"
//               fontWeight="500"
//               _hover={{ textDecoration: 'underline' }}
//             >
//               {info.getValue()}
//             </Link>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('phone', {
//         id: 'phone',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Phone
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('amount', {
//         id: 'amount',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Amount
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('images', {
//         id: 'images',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Images
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             {info.getValue().length === 1 ? (
//               <Image
//                 src={info.getValue()[0]}
//                 alt="Promotion image"
//                 boxSize="50px"
//                 objectFit="cover"
//                 borderRadius="8px"
//                 cursor="pointer"
//                 onClick={() => handleImageClick(info.getValue()[0])}
//                 onError={(e) => {
//                   console.error('Image Load Error:', info.getValue()[0]);
//                   e.target.src = defaultProfilePic;
//                 }}
//               />
//             ) : (
//               <Button
//                 size="sm"
//                 colorScheme="teal"
//                 onClick={() => handleViewImages(info.getValue())}
//               >
//                 View More ({info.getValue().length})
//               </Button>
//             )}
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('description', {
//         id: 'description',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Description
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('date', {
//         id: 'date',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Date
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('paymentId', {
//         id: 'paymentId',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             PaymentId
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//       columnHelper.accessor('createdAt', {
//         id: 'createdAt',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Created At
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <Text color={textColor} fontSize="sm" fontWeight="400">
//               {info.getValue()}
//             </Text>
//           </Flex>
//         ),
//       }),
//     ],
//     [textColor],
//   );

//   const table = useReactTable({
//     data: filteredData, // Use filtered data instead of raw data
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: {
//         pageSize: 10,
//       },
//     },
//   });

//   if (loading) {
//     return (
//       <Card
//         flexDirection="column"
//         w="100%"
//         px="25px"
//         py="25px"
//         overflowX={{ sm: 'scroll', lg: 'hidden' }}
//         borderRadius="20px"
//         boxShadow="lg"
//       >
//         <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
//           Loading...
//         </Text>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card
//         flexDirection="column"
//         w="100%"
//         px="25px"
//         py="25px"
//         overflowX={{ sm: 'scroll', lg: 'hidden' }}
//         borderRadius="20px"
//         boxShadow="lg"
//         style={{ marginTop: '80px' }}
//       >
//         <Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
//           Error: {error}
//         </Text>
//       </Card>
//     );
//   }

//   return (
//     <Card
//       flexDirection="column"
//       w="100%"
//       px="25px"
//       py="25px"
//       overflowX={{ sm: 'scroll', lg: 'hidden' }}
//       borderRadius="20px"
//       boxShadow="lg"
//       style={{ marginTop: '80px' }}
//     >
//       {/* Header with Search */}
//       <Flex px="0px" mb="20px" justifyContent="space-between" align="center" flexWrap="wrap" gap="4">
//         <Text
//           color={textColor}
//           fontSize="22px"
//           fontWeight="700"
//           lineHeight="100%"
//         >
//           Promotions
//         </Text>
        
//         {/* Search Input */}
//         <Flex gap="2" flex="1" maxW="400px" align="center">
//           <InputGroup>
//             <InputLeftElement pointerEvents="none">
//               <SearchIcon color="gray.300" />
//             </InputLeftElement>
//             <Input
//               placeholder="Search by Unique ID, Title, Username, or Phone..."
//               value={searchTerm}
//               onChange={(e) => handleSearch(e.target.value)}
//               borderRadius="md"
//               _focus={{
//                 borderColor: 'teal.500',
//                 boxShadow: '0 0 0 1px teal.500',
//               }}
//             />
//           </InputGroup>
          
//           {searchTerm && (
//             <Button
//               size="sm"
//               colorScheme="gray"
//               variant="outline"
//               onClick={handleClearSearch}
//               leftIcon={<SearchIcon />}
//             >
//               Clear
//             </Button>
//           )}
//         </Flex>
//       </Flex>

//       {/* Search Results Info */}
//       {searchTerm && (
//         <Flex mb="4" align="center" justifyContent="space-between" flexWrap="wrap">
//           <Text fontSize="sm" color="gray.500">
//             Found {filteredData.length} of {data.length} promotions
//           </Text>
//           <Button
//             size="sm"
//             colorScheme="teal"
//             variant="outline"
//             onClick={handleClearSearch}
//           >
//             Show All ({data.length})
//           </Button>
//         </Flex>
//       )}

//       <Box overflowX="auto" whiteSpace="nowrap">
//         <Table variant="simple" color="gray.500" mb="24px" mt="12px">
//           <Thead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <Tr key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <Th
//                     key={header.id}
//                     colSpan={header.colSpan}
//                     pe="10px"
//                     borderColor={borderColor}
//                     py="12px"
//                   >
//                     <Flex
//                       justifyContent="space-between"
//                       align="center"
//                       fontSize={{ sm: '10px', lg: '12px' }}
//                       color="gray.400"
//                     >
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                     </Flex>
//                   </Th>
//                 ))}
//               </Tr>
//             ))}
//           </Thead>
//           <Tbody>
//             {table.getRowModel().rows.map((row) => (
//               <Tr key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <Td
//                     key={cell.id}
//                     fontSize={{ sm: '14px' }}
//                     minW={{ sm: '150px', md: '200px', lg: 'auto' }}
//                     borderColor="transparent"
//                     py="12px"
//                   >
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </Td>
//                 ))}
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
        
//         {/* Pagination Controls */}
//         <Flex justifyContent="space-between" alignItems="center" mt="4">
//           <Text fontSize="sm" color="gray.500">
//             Showing{' '}
//             {table.getState().pagination.pageIndex *
//               table.getState().pagination.pageSize +
//               1}{' '}
//             to{' '}
//             {Math.min(
//               (table.getState().pagination.pageIndex + 1) *
//                 table.getState().pagination.pageSize,
//               filteredData.length, // Use filtered data length
//             )}{' '}
//             of {filteredData.length} promotions
//           </Text>
//           <Flex gap="2" alignItems="center">
//             <Button
//               size="sm"
//               colorScheme="teal"
//               onClick={() => table.previousPage()}
//               isDisabled={!table.getCanPreviousPage()}
//             >
//               Previous
//             </Button>
//             {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
//               (page) => (
//                 <Button
//                   key={page}
//                   size="sm"
//                   colorScheme="teal"
//                   variant={
//                     table.getState().pagination.pageIndex === page
//                       ? 'solid'
//                       : 'outline'
//                   }
//                   onClick={() => table.setPageIndex(page)}
//                 >
//                   {page + 1}
//                 </Button>
//               ),
//             )}
//             <Button
//               size="sm"
//               colorScheme="teal"
//               onClick={() => table.nextPage()}
//               isDisabled={!table.getCanNextPage()}
//             >
//               Next
//             </Button>
//           </Flex>
//         </Flex>
//       </Box>

//       {/* Modal for multiple images */}
//       <Modal isOpen={isImagesOpen} onClose={onImagesClose} size="xl">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Promotion Images</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Flex wrap="wrap" gap="10px">
//               {selectedImages.map((image, index) => (
//                 <Image
//                   key={index}
//                   src={image}
//                   alt={`Promotion image ${index + 1}`}
//                   boxSize="150px"
//                   objectFit="cover"
//                   borderRadius="8px"
//                   cursor="pointer"
//                   onClick={() => handleImageClick(image)}
//                   onError={(e) => {
//                     console.error('Modal Image Load Error:', image);
//                     e.target.src = defaultProfilePic;
//                   }}
//                 />
//               ))}
//             </Flex>
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//       {/* Modal for enlarged single image */}
//       <Modal isOpen={isImageOpen} onClose={onImageClose} size="lg">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Image Preview</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Image
//               src={selectedImage}
//               alt="Enlarged promotion image"
//               maxH="500px"
//               w="100%"
//               objectFit="contain"
//               borderRadius="8px"
//               onError={(e) => {
//                 console.error('Enlarged Image Load Error:', selectedImage);
//                 e.target.src = '/default-image.jpg';
//               }}
//             />
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Card>
//   );
// }


/* eslint-disable */
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
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  useToast, // <-- Added useToast
} from '@chakra-ui/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons'; // <-- Added DownloadIcon
import defaultProfilePic from 'assets/img/profile/profile.webp';
// Custom components
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function PromotionsTable() {
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]); // New state for filtered data
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState(''); // New search state
  const {
    isOpen: isImagesOpen,
    onOpen: onImagesOpen,
    onClose: onImagesClose,
  } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const navigate = useNavigate();
  const toast = useToast(); // <-- Initialize toast

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Capitalize first letter of each word
  const capitalizeWords = (str) => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Search function
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    
    if (!searchValue.trim()) {
      // If search is empty, show all data
      setFilteredData(data);
      return;
    }

    // Filter data based on multiple fields
    const filtered = data.filter((item) =>
      item.uniqueId?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.user?.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.phone?.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    setFilteredData(filtered);
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}api/promotion/getAllPromotions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log('API Response (Promotions):', response.data);

      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error(
          'Invalid response format: Expected an array of promotions',
        );
      }

      const formattedData = response.data.data.map((item) => {
        const images =
          item.images?.map((img) => {
            const fullImageUrl = `${baseUrl}${img}`;
            console.log('Constructed Image URL:', fullImageUrl);
            return fullImageUrl;
          }) || [];
        return {
          id: item._id,
          title: capitalizeWords(item.title) || 'Untitled',
          uniqueId: item.unique_id || 'N/A',
          description: item.description || 'No description',
          images,
          date: item.date || 'N/A',
          user: capitalizeWords(item.user_id?.full_name) || 'Unknown',
          userId: item.user_id?._id || '',
          paymentId: item.paymentId || 'N/A',
          amount: item.amount || 'N/A',
          phone: item.phone || 'N/A',
          createdAt: new Date(item.createdAt).toLocaleString(),
        };
      });

      setData(formattedData);
      setFilteredData(formattedData); // Initialize filtered data with all data
      setLoading(false);
    } catch (err) {
      console.error('Fetch Promotions Error:', err);
      if (
        err.response?.data?.message === 'Not authorized, token failed' ||
        err.response?.data?.message ===
          'Session expired or logged in on another device' ||
        err.response?.data?.message ===
          'Un-Authorized, You are not authorized to access this route.' ||
        err.response?.data?.message === 'Not authorized, token failed'
      ) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.message || 'Failed to fetch promotions');
        setLoading(false);
      }
    }
  };

  // Handle image modal
  const handleViewImages = (images) => {
    console.log('Selected Images for Modal:', images);
    setSelectedImages(images);
    onImagesOpen();
  };

  // Handle single image click
  const handleImageClick = (image) => {
    console.log('Clicked Image:', image);
    setSelectedImage(image);
    onImageOpen();
  };

  // --- EXPORT FUNCTIONALITY START ---
  const handleExport = () => {
    if (!filteredData || filteredData.length === 0) {
      toast({
        title: 'No Data',
        description: 'There is no data to export.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    // 1. Define Headers
    const headers = [
      "S.No",
      "Unique ID",
      "Title",
      "Username",
      "User ID",
      "Phone",
      "Amount",
      "Payment ID",
      "Description",
      "Date",
      "Created At"
    ];

    // 2. Map Data to Rows
    const csvRows = filteredData.map((item, index) => {
      // Helper to escape CSV characters
      const safe = (text) => {
        if (!text) return '""';
        return `"${String(text).replace(/"/g, '""')}"`;
      };

      return [
        index + 1,
        safe(item.uniqueId),
        safe(item.title),
        safe(item.user),
        safe(item.userId),
        safe(item.phone),
        safe(item.amount),
        safe(item.paymentId),
        safe(item.description),
        safe(item.date),
        safe(item.createdAt)
      ].join(",");
    });

    // 3. Create CSV String
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // 4. Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `promotions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- EXPORT FUNCTIONALITY END ---

  // Update filtered data when search term changes
  React.useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  // Initial data fetch
  React.useEffect(() => {
    fetchPromotions();
  }, [navigate]);

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('id', {
        id: 'sno',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            S.No
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.row.index + 1}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('uniqueId', {
        id: 'uniqueId',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Unique ID
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('title', {
        id: 'title',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Title
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('user', {
        id: 'user',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Username
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Link
              href={`/admin/UserDetails/${info.row.original.userId}`}
              color="blue.500"
              fontSize="sm"
              fontWeight="500"
              _hover={{ textDecoration: 'underline' }}
            >
              {info.getValue()}
            </Link>
          </Flex>
        ),
      }),
      columnHelper.accessor('phone', {
        id: 'phone',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Phone
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Amount
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('images', {
        id: 'images',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Images
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            {info.getValue().length === 1 ? (
              <Image
                src={info.getValue()[0]}
                alt="Promotion image"
                boxSize="50px"
                objectFit="cover"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => handleImageClick(info.getValue()[0])}
                onError={(e) => {
                  console.error('Image Load Error:', info.getValue()[0]);
                  e.target.src = defaultProfilePic;
                }}
              />
            ) : (
              <Button
                size="sm"
                colorScheme="teal"
                onClick={() => handleViewImages(info.getValue())}
              >
                View More ({info.getValue().length})
              </Button>
            )}
          </Flex>
        ),
      }),
      columnHelper.accessor('description', {
        id: 'description',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Description
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('date', {
        id: 'date',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Date
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('paymentId', {
        id: 'paymentId',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            PaymentId
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
      columnHelper.accessor('createdAt', {
        id: 'createdAt',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Created At
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <Text color={textColor} fontSize="sm" fontWeight="400">
              {info.getValue()}
            </Text>
          </Flex>
        ),
      }),
    ],
    [textColor],
  );

  const table = useReactTable({
    data: filteredData, // Use filtered data instead of raw data
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (loading) {
    return (
      <Card
        flexDirection="column"
        w="100%"
        px="25px"
        py="25px"
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
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
        overflowX={{ sm: 'scroll', lg: 'hidden' }}
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
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
      borderRadius="20px"
      boxShadow="lg"
      style={{ marginTop: '80px' }}
    >
      {/* Header with Search */}
      <Flex px="0px" mb="20px" justifyContent="space-between" align="center" flexWrap="wrap" gap="4">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Promotions
        </Text>
        
        {/* Right Side: Export + Search */}
        <Flex gap="2" flex="1" maxW="auto" align="center" justifyContent="flex-end">
          {/* EXPORT BUTTON */}
          <Button
            size="md"
            colorScheme="green"
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export
          </Button>

          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              borderRadius="md"
              _focus={{
                borderColor: 'teal.500',
                boxShadow: '0 0 0 1px teal.500',
              }}
            />
          </InputGroup>
          
          {searchTerm && (
            <Button
              size="md"
              colorScheme="gray"
              variant="outline"
              onClick={handleClearSearch}
            >
              Clear
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Search Results Info */}
      {searchTerm && (
        <Flex mb="4" align="center" justifyContent="space-between" flexWrap="wrap">
          <Text fontSize="sm" color="gray.500">
            Found {filteredData.length} of {data.length} promotions
          </Text>
          <Button
            size="sm"
            colorScheme="teal"
            variant="outline"
            onClick={handleClearSearch}
          >
            Show All ({data.length})
          </Button>
        </Flex>
      )}

      <Box overflowX="auto" whiteSpace="nowrap">
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    py="12px"
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                    py="12px"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        
        {/* Pagination Controls */}
        <Flex justifyContent="space-between" alignItems="center" mt="4">
          <Text fontSize="sm" color="gray.500">
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredData.length, // Use filtered data length
            )}{' '}
            of {filteredData.length} promotions
          </Text>
          <Flex gap="2" alignItems="center">
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => table.previousPage()}
              isDisabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
              (page) => (
                <Button
                  key={page}
                  size="sm"
                  colorScheme="teal"
                  variant={
                    table.getState().pagination.pageIndex === page
                      ? 'solid'
                      : 'outline'
                  }
                  onClick={() => table.setPageIndex(page)}
                >
                  {page + 1}
                </Button>
              ),
            )}
            <Button
              size="sm"
              colorScheme="teal"
              onClick={() => table.nextPage()}
              isDisabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Modal for multiple images */}
      <Modal isOpen={isImagesOpen} onClose={onImagesClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Promotion Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap" gap="10px">
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Promotion image ${index + 1}`}
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="8px"
                  cursor="pointer"
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    console.error('Modal Image Load Error:', image);
                    e.target.src = defaultProfilePic;
                  }}
                />
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal for enlarged single image */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src={selectedImage}
              alt="Enlarged promotion image"
              maxH="500px"
              w="100%"
              objectFit="contain"
              borderRadius="8px"
              onError={(e) => {
                console.error('Enlarged Image Load Error:', selectedImage);
                e.target.src = '/default-image.jpg';
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
}