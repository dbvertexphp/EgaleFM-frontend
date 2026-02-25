// /* eslint-disable */
// 'use client';

// import {
//   Box,
//   Button,
//   HStack,
//   Text,
//   Textarea,
//   useColorModeValue,
//   IconButton,
//   Select,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import * as React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {
//   FiBold,
//   FiItalic,
//   FiUnderline,
//   FiLink,
//   FiList,
//   FiAlignLeft,
//   FiAlignCenter,
//   FiAlignRight,
// } from 'react-icons/fi';
// import Card from 'components/card/Card';
// import DOMPurify from 'dompurify'; // Import DOMPurify for sanitization

// export default function AboutUs() {
//   const [content, setContent] = React.useState('');
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const [isEditing, setIsEditing] = React.useState(false);
//   const textareaRef = React.useRef(null);

//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const navigate = useNavigate();
//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   // Fetch About Us content on mount
//   React.useEffect(() => {
//     const fetchAboutUs = async () => {
//       try {
//         if (!baseUrl || !token) {
//           throw new Error('Missing base URL or authentication token');
//         }
//         const response = await axios.get(
//           `${baseUrl}api/CompanyDetails/getAboutUs`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           },
//         );
//         if (!response.data || typeof response.data.content !== 'string') {
//           throw new Error('Invalid response format: Expected a content string');
//         }
//         setContent(response.data.content);
//         setLoading(false);
//       } catch (err) {
//         console.error('Fetch About Us Error:', err);
//         if (
//           err.response?.data?.message === 'Not authorized, token failed' ||
//           err.response?.data?.message === 'Session expired or logged in on another device' ||
//           err.response?.data?.message === 'Un-Authorized, You are not authorized to access this route.' ||
//           err.response?.data?.message === 'Not authorized, token failed'
//         ) {
//           localStorage.removeItem('token');
//           navigate('/');
//         } else {
//           setError(err.message || 'Failed to fetch About Us content');
//           setLoading(false);
//         }
//       }
//     };

//     fetchAboutUs();
//   }, [navigate]);

//   // Handle saving the edited content
//   const handleSave = async () => {
//     try {
//       await axios.post(
//         `${baseUrl}api/CompanyDetails/addAboutUs`,
//         { content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success('About Us content updated successfully!', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       setIsEditing(false);
//     } catch (err) {
//       console.error('Update About Us Error:', err);
//       toast.error('Failed to update About Us content', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//     }
//   };

//   // Handle text formatting with HTML tags
//   const applyFormatting = (format) => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = content.slice(start, end);

//     if (!selectedText) {
//       toast.warn('Please select text to format', {
//         position: 'top-right',
//         autoClose: 2000,
//       });
//       return;
//     }

//     let newText = '';
//     switch (format) {
//       case 'bold':
//         newText = `<b>${selectedText}</b>`;
//         break;
//       case 'italic':
//         newText = `<i>${selectedText}</i>`;
//         break;
//       case 'underline':
//         newText = `<u>${selectedText}</u>`;
//         break;
//       case 'heading1':
//         newText = `<h1>${selectedText}</h1>`;
//         break;
//       case 'heading2':
//         newText = `<h2>${selectedText}</h2>`;
//         break;
//       default:
//         newText = selectedText;
//     }

//     const updatedContent =
//       content.slice(0, start) + newText + content.slice(end);
//     setContent(updatedContent);

//     // Restore cursor position
//     setTimeout(() => {
//       textarea.selectionStart = start;
//       textarea.selectionEnd = start + newText.length;
//       textarea.focus();
//     }, 0);
//   };

//   if (loading) {
//     return (
//       <Card
//         flexDirection="column"
//         w="100%"
//         px="0px"
//         overflowX={{ sm: 'scroll', lg: 'hidden' }}
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
//         px="0px"
//         overflowX={{ sm: 'scroll', lg: 'hidden' }}
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
//       px="0px"
//       mt="100px"
//       overflowX={{ sm: 'scroll', lg: 'hidden' }}
//     >
//       <Box px="25px" mb="20px">
//         <Text
//           color={textColor}
//           fontSize="22px"
//           fontWeight="700"
//           lineHeight="100%"
//           mb="20px"
//         >
//           About Us
//         </Text>
//         {isEditing ? (
//           <Box>
//             <HStack spacing={2} mb={2}>
//               <Select
//                 placeholder="Normal"
//                 size="sm"
//                 w="120px"
//                 onChange={(e) => {
//                   if (e.target.value === 'Heading 1') applyFormatting('heading1');
//                   if (e.target.value === 'Heading 2') applyFormatting('heading2');
//                 }}
//               >
//                 <option value="Heading 1">Heading 1</option>
//                 <option value="Heading 2">Heading 2</option>
//                 <option value="Normal">Normal</option>
//               </Select>
//               <IconButton
//                 icon={<FiBold />}
//                 size="sm"
//                 aria-label="Bold"
//                 onClick={() => applyFormatting('bold')}
//               />
//               <IconButton
//                 icon={<FiItalic />}
//                 size="sm"
//                 aria-label="Italic"
//                 onClick={() => applyFormatting('italic')}
//               />
//               <IconButton
//                 icon={<FiUnderline />}
//                 size="sm"
//                 aria-label="Underline"
//                 onClick={() => applyFormatting('underline')}
//               />
//               <IconButton icon={<FiLink />} size="sm" aria-label="Link" />
//               <IconButton icon={<FiList />} size="sm" aria-label="List" />
//               <IconButton icon={<FiAlignLeft />} size="sm" aria-label="Align Left" />
//               <IconButton icon={<FiAlignCenter />} size="sm" aria-label="Align Center" />
//               <IconButton icon={<FiAlignRight />} size="sm" aria-label="Align Right" />
//             </HStack>
//             <Textarea
//               ref={textareaRef}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               minH="200px"
//               placeholder="Enter About Us content here..."
//               mb={4}
//             />
//             <HStack spacing={3}>
//               <Button colorScheme="blue" onClick={handleSave}>
//                 Save
//               </Button>
//               <Button variant="outline" onClick={() => setIsEditing(false)}>
//                 Cancel
//               </Button>
//             </HStack>
//           </Box>
//         ) : (
//           <Box>
//             <Box
//               color={textColor}
//               fontSize="md"
//               lineHeight="1.8"
//               mb={4}
//               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
//             />
//             <Button colorScheme="teal" onClick={() => setIsEditing(true)}>
//               Edit About Us
//             </Button>
//           </Box>
//         )}
//       </Box>
//       <ToastContainer />
//     </Card>
//   );
// }


/* eslint-disable */
/* eslint-disable */
/* eslint-disable */
// 'use client';

// import {
//   Box, Button, HStack, Text, Textarea, useColorModeValue,
//   IconButton, Select, VStack, Flex, Spinner,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import * as React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FiBold, FiItalic, FiUnderline, FiEdit } from 'react-icons/fi';
// import Card from 'components/card/Card';
// import DOMPurify from 'dompurify';

// export default function AboutUs() {
//   const [content, setContent] = React.useState('');
//   const [loading, setLoading] = React.useState(true);
//   const [isEditing, setIsEditing] = React.useState(false);
//   const textareaRef = React.useRef(null);

//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
//   const navigate = useNavigate();

//   // --- SAHI API CONFIGURATION ---
//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');
  
//   // Aapke server.js ke 'app.use('/api/admin', AboutUs)' ke hisab se:
//   const apiUrl = `${baseUrl}api/admin/about-us`; 

//   // 1. Fetch Content (GET)
//   const fetchAboutUs = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(apiUrl, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Aapka controller agar { status: true, data: { content: "..." } } bhej raha hai:
//       if (response.data.status) {
//         const receivedData = response.data.data ? response.data.data.content : response.data.content;
//         setContent(receivedData || '');
//       }
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       if (err.response?.status === 401) {
//         toast.error("Session expired, please login again");
//         navigate('/');
//       } else {
//         toast.error("Failed to load content");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchAboutUs();
//   }, []);

//   // 2. Save Content (POST)
//   const handleSave = async () => {
//     if (!content.trim()) return toast.warning("Content cannot be empty");
    
//     try {
//       const response = await axios.post(
//         apiUrl,
//         { content },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.status) {
//         toast.success('About Us updated successfully!');
//         setIsEditing(false);
//         fetchAboutUs(); // Naya data refresh karne ke liye
//       }
//     } catch (err) {
//       toast.error('Failed to update content');
//       console.error(err);
//     }
//   };

//   // 3. Simple Formatting Logic
//   const applyFormatting = (tag) => {
//     const textarea = textareaRef.current;
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = content.slice(start, end);

//     if (!selectedText) return toast.info("Please select text to format");

//     let formatted = `<${tag}>${selectedText}</${tag}>`;
//     const newContent = content.slice(0, start) + formatted + content.slice(end);
//     setContent(newContent);
//   };

//   if (loading) return (
//     <Flex justify="center" align="center" minH="200px" mt="100px">
//       <Spinner size="xl" color="blue.500" thickness="4px" />
//     </Flex>
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
//       <Card p="25px">
//         <Flex justify="space-between" align="center" mb="25px">
//           <VStack align="start" spacing={0}>
//             <Text color={textColor} fontSize="22px" fontWeight="700">About Us</Text>
//             <Text color="gray.500" fontSize="sm">Manage your company's information</Text>
//           </VStack>
          
//           {!isEditing && (
//             <Button 
//               leftIcon={<FiEdit />} 
//               colorScheme="brand" 
//               variant="solid" 
//               onClick={() => setIsEditing(true)}
//             >
//               Edit Content
//             </Button>
//           )}
//         </Flex>

//         {isEditing ? (
//           <VStack align="stretch" spacing={4}>
//             {/* Toolbar */}
//             <HStack bg={useColorModeValue('gray.50', 'navy.800')} p={2} borderRadius="10px" border="1px solid" borderColor={borderColor}>
//                <Button size="sm" variant="outline" onClick={() => applyFormatting('b')}>Bold</Button>
//                <Button size="sm" variant="outline" onClick={() => applyFormatting('i')}>Italic</Button>
//                <Button size="sm" variant="outline" onClick={() => applyFormatting('u')}>Underline</Button>
//                <Button size="sm" variant="outline" onClick={() => applyFormatting('h2')}>Heading</Button>
//             </HStack>
            
//             <Textarea
//               ref={textareaRef}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               minH="350px"
//               placeholder="Type your company story here..."
//               borderRadius="12px"
//               _focus={{ borderColor: "blue.400" }}
//             />
            
//             <HStack justify="flex-end" spacing={4}>
//               <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
//               <Button colorScheme="brand" px="8" onClick={handleSave}>Update</Button>
//             </HStack>
//           </VStack>
//         ) : (
//           <Box 
//             p="6" 
//             bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
//             border="1px solid" 
//             borderColor={borderColor} 
//             borderRadius="15px"
//           >
//             {content ? (
//               <Box 
//                 className="about-content"
//                 dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
//                 sx={{
//                   'h1, h2': { fontWeight: 'bold', mb: 3 },
//                   'p': { mb: 3 },
//                   'b': { fontWeight: 'bold' }
//                 }}
//               />
//             ) : (
//               <Text color="gray.400" textAlign="center" py="10">No content found. Please click 'Edit' to add.</Text>
//             )}
//           </Box>
//         )}
//       </Card>
//       <ToastContainer position="bottom-right" theme="colored" />
//     </Box>
//   );
// }
/* eslint-disable */
'use client';

import {
  Box,
  Button,
  HStack,
  Text,
  Textarea,
  useColorModeValue,
  IconButton,
  Select,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiLink,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from 'react-icons/fi';
import Card from 'components/card/Card';
import DOMPurify from 'dompurify';

export default function AboutUs() {
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const textareaRef = React.useRef(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // API URL
  const apiUrl = `${baseUrl}api/admin/about-us`;

  // 1. Fetch Content
  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.status) {
        const receivedData = response.data.data ? response.data.data.content : response.data.content;
        setContent(receivedData || '');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch About Us Error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.message || 'Failed to fetch content');
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchAboutUs();
  }, [navigate]);

  // 2. Save Content
  const handleSave = async () => {
    try {
      const response = await axios.post(
        apiUrl,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        toast.success('About Us updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsEditing(false);
        fetchAboutUs();
      }
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('Failed to update content');
    }
  };

  // 3. Formatting Logic (Privacy Policy Style)
  const applyFormatting = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end);

    if (!selectedText) {
      toast.warn('Please select text to format');
      return;
    }

    let newText = '';
    switch (format) {
      case 'bold': newText = `<b>${selectedText}</b>`; break;
      case 'italic': newText = `<i>${selectedText}</i>`; break;
      case 'underline': newText = `<u>${selectedText}</u>`; break;
      case 'heading1': newText = `<h1>${selectedText}</h1>`; break;
      case 'heading2': newText = `<h2>${selectedText}</h2>`; break;
      default: newText = selectedText;
    }

    const updatedContent = content.slice(0, start) + newText + content.slice(end);
    setContent(updatedContent);

    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + newText.length;
      textarea.focus();
    }, 0);
  };

  if (loading) {
    return (
      <Card flexDirection="column" w="100%" px="0px" mt="100px">
        <Flex justify="center" align="center" p="50px">
          <Spinner size="xl" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      mt="100px"
      overflowX={{ sm: 'scroll', lg: 'hidden' }}
    >
      <Box px="25px" mb="20px">
        <Text color={textColor} fontSize="22px" fontWeight="700" mb="20px">
          About Us
        </Text>
        
        {isEditing ? (
          <Box>
            {/* Toolbar - Exactly like Privacy Policy */}
            <HStack spacing={2} mb={2}>
              <Select
                placeholder="Normal"
                size="sm"
                w="120px"
                onChange={(e) => {
                  if (e.target.value === 'Heading 1') applyFormatting('heading1');
                  if (e.target.value === 'Heading 2') applyFormatting('heading2');
                }}
              >
                <option value="Heading 1">Heading 1</option>
                <option value="Heading 2">Heading 2</option>
                <option value="Normal">Normal</option>
              </Select>
              <IconButton icon={<FiBold />} size="sm" onClick={() => applyFormatting('bold')} aria-label="Bold" />
              <IconButton icon={<FiItalic />} size="sm" onClick={() => applyFormatting('italic')} aria-label="Italic" />
              <IconButton icon={<FiUnderline />} size="sm" onClick={() => applyFormatting('underline')} aria-label="Underline" />
              <IconButton icon={<FiLink />} size="sm" aria-label="Link" />
              <IconButton icon={<FiList />} size="sm" aria-label="List" />
              <IconButton icon={<FiAlignLeft />} size="sm" aria-label="Align Left" />
              <IconButton icon={<FiAlignCenter />} size="sm" aria-label="Align Center" />
              <IconButton icon={<FiAlignRight />} size="sm" aria-label="Align Right" />
            </HStack>
            
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              minH="250px"
              placeholder="Enter About Us content here..."
              mb={4}
            />
            
            <HStack spacing={3}>
              <Button colorScheme="blue" onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </HStack>
          </Box>
        ) : (
          <Box>
            <Box
              color={textColor}
              fontSize="md"
              lineHeight="1.8"
              mb={4}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
            <Button colorScheme="teal" onClick={() => setIsEditing(true)}>
              Edit About Us
            </Button>
          </Box>
        )}
      </Box>
      <ToastContainer position="top-right" theme="colored" />
    </Card>
  );
}