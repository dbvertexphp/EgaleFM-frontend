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
//   IconButton,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
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
// import { DeleteIcon } from '@chakra-ui/icons';
// import defaultProfilePic from 'assets/img/profile/profile.webp';
// // Custom components
// import Card from 'components/card/Card';

// const columnHelper = createColumnHelper();

// export default function PromotionsTable() {
//   const [data, setData] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const [selectedImages, setSelectedImages] = React.useState([]);
//   const [selectedImage, setSelectedImage] = React.useState(null);
//   const [bannerToDelete, setBannerToDelete] = React.useState(null);
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
//   const {
//     isOpen: isDeleteOpen,
//     onOpen: onDeleteOpen,
//     onClose: onDeleteClose,
//   } = useDisclosure();
//   const cancelRef = React.useRef();
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

//   // Fetch promotions
//   const fetchPromotions = async () => {
//     try {
//       if (!baseUrl || !token) {
//         throw new Error('Missing base URL or authentication token');
//       }
//       setLoading(true);
//       const response = await axios.get(`${baseUrl}api/banner/getBanners`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.data) {
//         throw new Error('No data received from API');
//       }

//       const dataArray = Array.isArray(response.data)
//         ? response.data
//         : response.data
//         ? [response.data]
//         : [];

//       const formattedData = dataArray.map((item) => {
//         const images = Array.isArray(item.images)
//           ? item.images.map((img) => {
//               const fullImageUrl = `${baseUrl}${img}`;
//               return fullImageUrl;
//             })
//           : [];
//         return {
//           id: item._id || '',
//           title: capitalizeWords(item.title) || 'Untitled',
//           link: item.link || 'No description',
//           images,
//           userUniqueId: item.user_id?.unique_id || 'N/A',
//           user: capitalizeWords(item.user_id?.full_name) || 'Unknown',
//           userId: item.user_id?._id || '',
// 					days:item?.days || 'N/A',
// 					position:item?.position || 'N/A',
//           createdAt: item.createdAt
//             ? new Date(item.createdAt).toLocaleString()
//             : 'N/A',
//         };
//       });

//       setData(formattedData);
//       setLoading(false);
//     } catch (err) {
//       console.error(
//         'Fetch Promotions Error:',
//         err.response?.data || err.message,
//       );
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
//         setError(
//           err.response?.data?.message ||
//             err.message ||
//             'Failed to fetch promotions',
//         );
//         setLoading(false);
//       }
//     }
//   };

//   // Handle delete banner
//   const handleDelete = async (id) => {
//     try {
//       if (!baseUrl || !token) {
//         throw new Error('Missing base URL or authentication token');
//       }
//       await axios.delete(`${baseUrl}api/banner/deleteBanner/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setData((prevData) => prevData.filter((banner) => banner.id !== id));
//       onDeleteClose();
//     } catch (err) {
//       console.error(
//         'Delete Banner Error:',
//         err.response?.data || err.message,
//       );
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           'Failed to delete banner',
//       );
//       onDeleteClose();
//     }
//   };

//   // Handle delete confirmation
//   const handleConfirmDelete = (id) => {
//     setBannerToDelete(id);
//     onDeleteOpen();
//   };

//   // Handle image modal
//   const handleViewImages = (images) => {
//     setSelectedImages(images);
//     onImagesOpen();
//   };

//   // Handle single image click
//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//     onImageOpen();
//   };

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
//             User
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
//       columnHelper.accessor('userUniqueId', {
//         id: 'userUniqueId',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             User Id
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
//                 alt="Banner image"
//                 boxSize="50px"
//                 objectFit="cover"
//                 borderRadius="8px"
//                 cursor="pointer"
//                 onClick={() => handleImageClick(info.getValue()[0])}
//                 onError={(e) => {
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
//       columnHelper.accessor('link', {
//         id: 'link',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Link
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
// 			columnHelper.accessor('days', {
//         id: 'days',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             days
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
// 			columnHelper.accessor('position', {
//         id: 'position',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             position
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
//       columnHelper.display({
//         id: 'actions',
//         header: () => (
//           <Text
//             justifyContent="space-between"
//             align="center"
//             fontSize={{ sm: '10px', lg: '12px' }}
//             color="gray.400"
//             textTransform="uppercase"
//           >
//             Actions
//           </Text>
//         ),
//         cell: (info) => (
//           <Flex align="center">
//             <IconButton
//               aria-label="Delete banner"
//               icon={<DeleteIcon />}
//               colorScheme="red"
//               size="sm"
//               onClick={() => handleConfirmDelete(info.row.original.id)}
//             />
//           </Flex>
//         ),
//       }),
//     ],
//     [textColor],
//   );

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: {
//         pageSize: 10, // Fixed 10 users per page
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
//       <Flex px="0px" mb="20px" justifyContent="space-between" align="center">
//         <Text
//           color={textColor}
//           fontSize="22px"
//           fontWeight="700"
//           lineHeight="100%"
//         >
//           Banners
//         </Text>
//         <Button
//           colorScheme="teal"
//           onClick={() => navigate('/admin/addBanner')}
//           w={{ base: '100%', md: 'auto' }}
//         >
//           Add Banner
//         </Button>
//       </Flex>
//       <Box>
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
//               data.length,
//             )}{' '}
//             of {data.length} banners
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
//           <ModalHeader>Banner Images</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Flex wrap="wrap" gap="10px">
//               {selectedImages.map((image, index) => (
//                 <Image
//                   key={index}
//                   src={image}
//                   alt={`Banner image ${index + 1}`}
//                   boxSize="150px"
//                   objectFit="cover"
//                   borderRadius="8px"
//                   cursor="pointer"
//                   onClick={() => handleImageClick(image)}
//                   onError={(e) => {
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
//               alt="Enlarged Banner image"
//               maxH="500px"
//               w="100%"
//               objectFit="contain"
//               borderRadius="8px"
//               onError={(e) => {
//                 e.target.src = '/default-image.jpg';
//               }}
//             />
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog
//         isOpen={isDeleteOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={onDeleteClose}
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               Delete Banner
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               Are you sure you want to delete this banner? This action cannot be undone.
//             </AlertDialogBody>
//             <AlertDialogFooter>
//               <Button ref={cancelRef} onClick={onDeleteClose}>
//                 Cancel
//               </Button>
//               <Button
//                 colorScheme="red"
//                 onClick={() => handleDelete(bannerToDelete)}
//                 ml={3}
//               >
//                 Delete
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
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
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
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
import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons'; // <-- Added DownloadIcon
import defaultProfilePic from 'assets/img/profile/profile.webp';
// Custom components
import Card from 'components/card/Card';

const columnHelper = createColumnHelper();

export default function PromotionsTable() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [bannerToDelete, setBannerToDelete] = React.useState(null);
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
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
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

  // Fetch promotions
  const fetchPromotions = async () => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      setLoading(true);
      const response = await axios.get(`${baseUrl}api/banner/getBanners`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data) {
        throw new Error('No data received from API');
      }

      const dataArray = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];

      const formattedData = dataArray.map((item) => {
        const images = Array.isArray(item.images)
          ? item.images.map((img) => {
              const fullImageUrl = `${baseUrl}${img}`;
              return fullImageUrl;
            })
          : [];
        return {
          id: item._id || '',
          title: capitalizeWords(item.title) || 'Untitled',
          link: item.link || 'No description',
          images,
          userUniqueId: item.user_id?.unique_id || 'N/A',
          user: capitalizeWords(item.user_id?.full_name) || 'Unknown',
          userId: item.user_id?._id || '',
					days:item?.days || 'N/A',
					position:item?.position || 'N/A',
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : 'N/A',
        };
      });

      setData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error(
        'Fetch Promotions Error:',
        err.response?.data || err.message,
      );
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
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to fetch promotions',
        );
        setLoading(false);
      }
    }
  };

  // Handle delete banner
  const handleDelete = async (id) => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      await axios.delete(`${baseUrl}api/banner/deleteBanner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prevData) => prevData.filter((banner) => banner.id !== id));
      onDeleteClose();
    } catch (err) {
      console.error(
        'Delete Banner Error:',
        err.response?.data || err.message,
      );
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to delete banner',
      );
      onDeleteClose();
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = (id) => {
    setBannerToDelete(id);
    onDeleteOpen();
  };

  // Handle image modal
  const handleViewImages = (images) => {
    setSelectedImages(images);
    onImagesOpen();
  };

  // Handle single image click
  const handleImageClick = (image) => {
    setSelectedImage(image);
    onImageOpen();
  };

  // --- EXPORT FUNCTIONALITY START ---
  const handleExport = () => {
    if (!data || data.length === 0) {
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
      "Title",
      "User Name",
      "User ID",
      "Link",
      "Days",
      "Position",
      "Created At"
    ];

    // 2. Map Data to Rows
    const csvRows = data.map((item, index) => {
      // Helper to escape CSV characters
      const safe = (text) => {
        if (!text) return '""';
        return `"${String(text).replace(/"/g, '""')}"`;
      };

      return [
        index + 1,
        safe(item.title),
        safe(item.user),
        safe(item.userUniqueId),
        safe(item.link),
        safe(item.days),
        safe(item.position),
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
    link.setAttribute('download', `banners_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- EXPORT FUNCTIONALITY END ---

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
            User
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
      columnHelper.accessor('userUniqueId', {
        id: 'userUniqueId',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            User Id
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
                alt="Banner image"
                boxSize="50px"
                objectFit="cover"
                borderRadius="8px"
                cursor="pointer"
                onClick={() => handleImageClick(info.getValue()[0])}
                onError={(e) => {
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
      columnHelper.accessor('link', {
        id: 'link',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Link
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
			columnHelper.accessor('days', {
        id: 'days',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            days
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
			columnHelper.accessor('position', {
        id: 'position',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            position
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
      columnHelper.display({
        id: 'actions',
        header: () => (
          <Text
            justifyContent="space-between"
            align="center"
            fontSize={{ sm: '10px', lg: '12px' }}
            color="gray.400"
            textTransform="uppercase"
          >
            Actions
          </Text>
        ),
        cell: (info) => (
          <Flex align="center">
            <IconButton
              aria-label="Delete banner"
              icon={<DeleteIcon />}
              colorScheme="red"
              size="sm"
              onClick={() => handleConfirmDelete(info.row.original.id)}
            />
          </Flex>
        ),
      }),
    ],
    [textColor],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // Fixed 10 users per page
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
      <Flex px="0px" mb="20px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Banners
        </Text>
        
        {/* Buttons Wrapper */}
        <Flex gap="10px">
          <Button
            colorScheme="green"
            leftIcon={<DownloadIcon />}
            onClick={handleExport}
            w={{ base: '100%', md: 'auto' }}
          >
            Export
          </Button>
          <Button
            colorScheme="teal"
            onClick={() => navigate('/admin/addBanner')}
            w={{ base: '100%', md: 'auto' }}
          >
            Add Banner
          </Button>
        </Flex>

      </Flex>
      <Box>
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
              data.length,
            )}{' '}
            of {data.length} banners
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
          <ModalHeader>Banner Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex wrap="wrap" gap="10px">
              {selectedImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Banner image ${index + 1}`}
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="8px"
                  cursor="pointer"
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
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
              alt="Enlarged Banner image"
              maxH="500px"
              w="100%"
              objectFit="contain"
              borderRadius="8px"
              onError={(e) => {
                e.target.src = '/default-image.jpg';
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Banner
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDelete(bannerToDelete)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Card>
  );
}