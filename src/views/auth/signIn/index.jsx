// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {
//     Box,
//     Button,
//     Flex,
//     FormControl,
//     FormLabel,
//     Heading,
//     Icon,
//     Input,
//     InputGroup,
//     InputRightElement,
//     Text,
//     useColorModeValue,
// } from '@chakra-ui/react';
// import DefaultAuth from 'layouts/auth/Default';
// // import illustration from 'assets/img/auth/auth1.png';
// import { MdOutlineRemoveRedEye } from 'react-icons/md';
// import { RiEyeCloseLine } from 'react-icons/ri';

// const baseUrl = process.env.REACT_APP_BASE_URL;

// function SignIn() {
//     const textColor = useColorModeValue('navy.700', 'white');
//     const textColorSecondary = 'gray.400';
//     const brandStars = useColorModeValue('#045e14', '#045e14');
//     const [show, setShow] = useState(false);
//     const [emailOrMobile, setEmailOrMobile] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleClick = () => setShow(!show);

//     const handleSignIn = async () => {
//         setError('');
//         setIsLoading(true);

//         try {
//             // Payload keys should match backend expectations
//             const payload = {
//                 email: emailOrMobile.trim(),
//                 password: password
//             };

//             const response = await axios.post(`${baseUrl}api/admin/login`, payload, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             console.log('API response:', response.data);

//             // CHANGED: Flexible check for success (either success boolean or token existence)
//             if (response.data.success || response.data.token || response.data.message === 'Login successful') {

//                 // Store token and user data
//                 localStorage.setItem('token', response.data.token);

//                 // Use optional chaining to prevent errors if admin object is nested differently
//                 const adminData = response.data.admin || response.data.user;
//                 localStorage.setItem('AdminData', JSON.stringify(adminData));

//                 // Final Navigation
//                 navigate('/admin/dashboard');
//             } else {
//                 // Handle cases where 200 OK but success is false
//                 setError(response.data.message || 'Invalid credentials');
//             }
//         } catch (err) {
//             console.error('Error Details:', err.response || err);

//             // Handle specific backend error messages
//             const backendMessage = err.response?.data?.message;

//             if (backendMessage === 'OTP not verified.') {
//                 setError(`OTP not verified. Please verify using OTP: ${err.response.data.otp}`);
//             } else {
//                 setError(backendMessage || 'Failed to sign in. Please try again.');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <DefaultAuth
//             illustrationBackground={illustration}
//             image={illustration}
//             hideBackButton={true}
//         >
//             <Flex
//                 maxW={{ base: '100%', md: 'max-content' }}
//                 w="100%"
//                 mx={{ base: 'auto', lg: '0px' }}
//                 me="auto"
//                 h="100%"
//                 alignItems="start"
//                 justifyContent="center"
//                 mb={{ base: '30px', md: '60px' }}
//                 px={{ base: '25px', md: '0px' }}
//                 mt={{ base: '40px', md: '14vh' }}
//                 flexDirection="column"
//             >
//                 <Box me="auto">
//                     <Heading color={textColor} fontSize="36px" mb="10px">
//                         Sign In
//                     </Heading>
//                     <Text
//                         mb="36px"
//                         ms="4px"
//                         color={textColorSecondary}
//                         fontWeight="400"
//                         fontSize="md"
//                     >
//                         Enter your email and password to sign in!
//                     </Text>
//                 </Box>
//                 <Flex
//                     zIndex="2"
//                     direction="column"
//                     w={{ base: '100%', md: '420px' }}
//                     maxW="100%"
//                     background="transparent"
//                     borderRadius="15px"
//                     mx={{ base: 'auto', lg: 'unset' }}
//                     me="auto"
//                     mb={{ base: '20px', md: 'auto' }}
//                 >
//                     <FormControl>
//                         <FormLabel display="flex" ms="4px" fontSize="sm" fontWeight="500" color={textColor} mb="8px">
//                             Email<Text color={brandStars}>*</Text>
//                         </FormLabel>
//                         <Input
//                             isRequired={true}
//                             variant="auth"
//                             fontSize="sm"
//                             type="text"
//                             placeholder="mail@gmail.com"
//                             mb="24px"
//                             fontWeight="500"
//                             size="lg"
//                             value={emailOrMobile}
//                             onChange={(e) => setEmailOrMobile(e.target.value)}
//                             isDisabled={isLoading}
//                         />
//                         <FormLabel ms="4px" fontSize="sm" fontWeight="500" color={textColor} display="flex">
//                             Password<Text color={brandStars}>*</Text>
//                         </FormLabel>
//                         <InputGroup size="md">
//                             <Input
//                                 isRequired={true}
//                                 fontSize="sm"
//                                 placeholder="Min. 6 characters"
//                                 mb="24px"
//                                 size="lg"
//                                 type={show ? 'text' : 'password'}
//                                 variant="auth"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
//                                 isDisabled={isLoading}
//                             />
//                             <InputRightElement display="flex" alignItems="center" mt="4px">
//                                 <Icon
//                                     color={textColorSecondary}
//                                     _hover={{ cursor: 'pointer' }}
//                                     as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
//                                     onClick={handleClick}
//                                 />
//                             </InputRightElement>
//                         </InputGroup>
//                         {error && (
//                             <Text color="red.500" mb="24px" fontSize="sm" fontWeight="600">
//                                 {error}
//                             </Text>
//                         )}
//                         <Button
//                             fontSize="sm"
//                             fontWeight="500"
//                             w="100%"
//                             h="50"
//                             mb="24px"
//                             bg="#045e14"
//                             color="white"
//                             _hover={{ bg: '#036b18' }}
//                             _active={{ bg: '#045e14' }}
//                             _focus={{ bg: '#045e14' }}
//                             onClick={handleSignIn}
//                             isLoading={isLoading}
//                             isDisabled={isLoading || !emailOrMobile || !password}
//                         >
//                             Sign In
//                         </Button>
//                     </FormControl>
//                 </Flex>
//             </Flex>
//         </DefaultAuth>
//     );
// }

// export default SignIn;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
// image import hata di gayi hai
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

const baseUrl = process.env.REACT_APP_BASE_URL;

function SignIn() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('#045e14', '#045e14');
  const [show, setShow] = useState(false);
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const payload = {
        email: emailOrMobile.trim(),
        password: password,
      };

      const response = await axios.post(`${baseUrl}/api/admin/login`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (
        response.data.success ||
        response.data.token ||
        response.data.message === 'Login successful'
      ) {
        localStorage.setItem('token', response.data.token);
        const adminData = response.data.admin || response.data.user;
        localStorage.setItem('AdminData', JSON.stringify(adminData));
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultAuth
      // Yahan se image aur illustrationBackground props hata diye hain
      hideBackButton={true}
    >
      <Flex
        maxW={{ base: '100%', md: 'max-content' }}
        w="100%"
        mx={{ base: 'auto', lg: 'auto' }} // lg: '0px' ko 'auto' kiya taaki form center mein rahe
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: '30px', md: '60px' }}
        px={{ base: '25px', md: '0px' }}
        mt={{ base: '40px', md: '14vh' }}
        flexDirection="column"
      >
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Sign In
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Enter your email and password to sign in!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: '100%', md: '420px' }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: 'auto', lg: 'unset' }}
          me="auto"
          mb={{ base: '20px', md: 'auto' }}
        >
          <FormControl>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="text"
              placeholder="mail@gmail.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              isDisabled={isLoading}
            />
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Password<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired={true}
                fontSize="sm"
                placeholder="Min. 6 characters"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                isDisabled={isLoading}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            {error && (
              <Text color="red.500" mb="24px" fontSize="sm" fontWeight="600">
                {error}
              </Text>
            )}
            <Button
              fontSize="sm"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              bg="#045e14"
              color="white"
              _hover={{ bg: '#036b18' }}
              _active={{ bg: '#045e14' }}
              _focus={{ bg: '#045e14' }}
              onClick={handleSignIn}
              isLoading={isLoading}
              isDisabled={isLoading || !emailOrMobile || !password}
            >
              Sign In
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
