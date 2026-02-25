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
// 	const fetchAboutUs = async () => {
// 	  try {
// 		if (!baseUrl || !token) {
// 		  throw new Error('Missing base URL or authentication token');
// 		}
// 		const response = await axios.get(
// 		  `${baseUrl}api/CompanyDetails/getPrivacyPolicy`,
// 		  {
// 			headers: { Authorization: `Bearer ${token}` },
// 		  },
// 		);
// 		if (!response.data || typeof response.data.content !== 'string') {
// 		  throw new Error('Invalid response format: Expected a content string');
// 		}
// 		setContent(response.data.content);
// 		setLoading(false);
// 	  } catch (err) {
// 		console.error('Fetch About Us Error:', err);
// 		if (
// 		  err.response?.data?.message === 'Not authorized, token failed' ||
// 		  err.response?.data?.message === 'Session expired or logged in on another device' ||
// 		  err.response?.data?.message === 'Un-Authorized, You are not authorized to access this route.' ||
// 		  err.response?.data?.message === 'Not authorized, token failed'
// 		) {
// 		  localStorage.removeItem('token');
// 		  navigate('/');
// 		} else {
// 		  setError(err.message || 'Failed to fetch About Us content');
// 		  setLoading(false);
// 		}
// 	  }
// 	};

// 	fetchAboutUs();
//   }, [navigate]);

//   // Handle saving the edited content
//   const handleSave = async () => {
// 	try {
// 	  await axios.post(
// 		`${baseUrl}api/CompanyDetails/addPrivacyPolicy`,
// 		{ content },
// 		{ headers: { Authorization: `Bearer ${token}` } }
// 	  );
// 	  toast.success('Privacy Policy content updated successfully!', {
// 		position: 'top-right',
// 		autoClose: 3000,
// 	  });
// 	  setIsEditing(false);
// 	} catch (err) {
// 	  console.error('Privacy Policy Us Error:', err);
// 	  toast.error('Failed to update Privacy Policy content', {
// 		position: 'top-right',
// 		autoClose: 3000,
// 	  });
// 	}
//   };

//   // Handle text formatting with HTML tags
//   const applyFormatting = (format) => {
// 	const textarea = textareaRef.current;
// 	if (!textarea) return;

// 	const start = textarea.selectionStart;
// 	const end = textarea.selectionEnd;
// 	const selectedText = content.slice(start, end);

// 	if (!selectedText) {
// 	  toast.warn('Please select text to format', {
// 		position: 'top-right',
// 		autoClose: 2000,
// 	  });
// 	  return;
// 	}

// 	let newText = '';
// 	switch (format) {
// 	  case 'bold':
// 		newText = `<b>${selectedText}</b>`;
// 		break;
// 	  case 'italic':
// 		newText = `<i>${selectedText}</i>`;
// 		break;
// 	  case 'underline':
// 		newText = `<u>${selectedText}</u>`;
// 		break;
// 	  case 'heading1':
// 		newText = `<h1>${selectedText}</h1>`;
// 		break;
// 	  case 'heading2':
// 		newText = `<h2>${selectedText}</h2>`;
// 		break;
// 	  default:
// 		newText = selectedText;
// 	}

// 	const updatedContent =
// 	  content.slice(0, start) + newText + content.slice(end);
// 	setContent(updatedContent);

// 	// Restore cursor position
// 	setTimeout(() => {
// 	  textarea.selectionStart = start;
// 	  textarea.selectionEnd = start + newText.length;
// 	  textarea.focus();
// 	}, 0);
//   };

//   if (loading) {
// 	return (
// 	  <Card
// 		flexDirection="column"
// 		w="100%"
// 		px="0px"
// 		overflowX={{ sm: 'scroll', lg: 'hidden' }}
// 	  >
// 		<Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
// 		  Loading...
// 		</Text>
// 	  </Card>
// 	);
//   }

//   if (error) {
// 	return (
// 	  <Card
// 		flexDirection="column"
// 		w="100%"
// 		px="0px"
// 		overflowX={{ sm: 'scroll', lg: 'hidden' }}
// 	  >
// 		<Text color={textColor} fontSize="22px" fontWeight="700" p="25px">
// 		  Error: {error}
// 		</Text>
// 	  </Card>
// 	);
//   }

//   return (
// 	<Card
// 	  flexDirection="column"
// 	  w="100%"
// 	  px="0px"
// 	  mt="100px"
// 	  overflowX={{ sm: 'scroll', lg: 'hidden' }}
// 	>
// 	  <Box px="25px" mb="20px">
// 		<Text
// 		  color={textColor}
// 		  fontSize="22px"
// 		  fontWeight="700"
// 		  lineHeight="100%"
// 		  mb="20px"
// 		>
// 		 Privacy Policy
// 		</Text>
// 		{isEditing ? (
// 		  <Box>
// 			<HStack spacing={2} mb={2}>
// 			  <Select
// 				placeholder="Normal"
// 				size="sm"
// 				w="120px"
// 				onChange={(e) => {
// 				  if (e.target.value === 'Heading 1') applyFormatting('heading1');
// 				  if (e.target.value === 'Heading 2') applyFormatting('heading2');
// 				}}
// 			  >
// 				<option value="Heading 1">Heading 1</option>
// 				<option value="Heading 2">Heading 2</option>
// 				<option value="Normal">Normal</option>
// 			  </Select>
// 			  <IconButton
// 				icon={<FiBold />}
// 				size="sm"
// 				aria-label="Bold"
// 				onClick={() => applyFormatting('bold')}
// 			  />
// 			  <IconButton
// 				icon={<FiItalic />}
// 				size="sm"
// 				aria-label="Italic"
// 				onClick={() => applyFormatting('italic')}
// 			  />
// 			  <IconButton
// 				icon={<FiUnderline />}
// 				size="sm"
// 				aria-label="Underline"
// 				onClick={() => applyFormatting('underline')}
// 			  />
// 			  <IconButton icon={<FiLink />} size="sm" aria-label="Link" />
// 			  <IconButton icon={<FiList />} size="sm" aria-label="List" />
// 			  <IconButton icon={<FiAlignLeft />} size="sm" aria-label="Align Left" />
// 			  <IconButton icon={<FiAlignCenter />} size="sm" aria-label="Align Center" />
// 			  <IconButton icon={<FiAlignRight />} size="sm" aria-label="Align Right" />
// 			</HStack>
// 			<Textarea
// 			  ref={textareaRef}
// 			  value={content}
// 			  onChange={(e) => setContent(e.target.value)}
// 			  minH="200px"
// 			  placeholder="Enter Privacy Policy content here..."
// 			  mb={4}
// 			/>
// 			<HStack spacing={3}>
// 			  <Button colorScheme="blue" onClick={handleSave}>
// 				Save
// 			  </Button>
// 			  <Button variant="outline" onClick={() => setIsEditing(false)}>
// 				Cancel
// 			  </Button>
// 			</HStack>
// 		  </Box>
// 		) : (
// 		  <Box>
// 			<Box
// 			  color={textColor}
// 			  fontSize="md"
// 			  lineHeight="1.8"
// 			  mb={4}
// 			  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
// 			/>
// 			<Button colorScheme="teal" onClick={() => setIsEditing(true)}>
// 			  Edit Privacy Policy
// 			</Button>
// 		  </Box>
// 		)}
// 	  </Box>
// 	  <ToastContainer />
// 	</Card>
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

export default function PrivacyPolicy() {
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const textareaRef = React.useRef(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // NAYA API ENDPOINT (According to your controller/route)
  const apiUrl = `${baseUrl}api/admin/privacy/privacy-policy`;

  // 1. Fetch Privacy Policy content on mount
  const fetchPrivacyPolicy = async () => {
    try {
      setLoading(true);
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fix: response.data.data.content as per your new controller
      if (response.data && response.data.status) {
        const receivedData = response.data.data ? response.data.data.content : response.data.content;
        setContent(receivedData || '');
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch Privacy Policy Error:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.message || 'Failed to fetch Privacy Policy content');
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchPrivacyPolicy();
  }, [navigate]);

  // 2. Handle saving the edited content
  const handleSave = async () => {
    try {
      const response = await axios.post(
        apiUrl,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        toast.success('Privacy Policy updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsEditing(false);
        fetchPrivacyPolicy(); // UI refresh
      }
    } catch (err) {
      console.error('Update Privacy Policy Error:', err);
      toast.error('Failed to update content', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  // 3. Handle text formatting
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

  if (error) {
    return (
      <Card flexDirection="column" w="100%" px="0px" mt="100px">
        <Text color="red.500" fontSize="18px" fontWeight="700" p="25px">
          Error: {error}
        </Text>
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
          Privacy Policy
        </Text>
        {isEditing ? (
          <Box>
            <HStack spacing={2} mb={2}>
              <Select
                placeholder="Style"
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
              <IconButton icon={<FiBold />} size="sm" aria-label="Bold" onClick={() => applyFormatting('bold')} />
              <IconButton icon={<FiItalic />} size="sm" aria-label="Italic" onClick={() => applyFormatting('italic')} />
              <IconButton icon={<FiUnderline />} size="sm" aria-label="Underline" onClick={() => applyFormatting('underline')} />
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
              minH="300px"
              placeholder="Enter Privacy Policy content here..."
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
              Edit Privacy Policy
            </Button>
          </Box>
        )}
      </Box>
      <ToastContainer theme="colored" />
    </Card>
  );
}
