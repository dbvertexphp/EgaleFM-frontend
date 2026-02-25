// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   SimpleGrid,
//   useColorModeValue,
//   Icon,
//   Spinner,
//   Center,
//   useToast,
// } from '@chakra-ui/react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// // Custom components
// import MiniStatistics from 'components/card/MiniStatistics';
// import IconBox from 'components/icons/IconBox';

// // Icons
// import { MdPeople } from 'react-icons/md';
// import { FaFileInvoiceDollar, FaMoneyBillWave } from 'react-icons/fa';

// export default function UserReports() {
//   const brandColor = useColorModeValue('#045e14', 'white');
//   const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

//   const toast = useToast();

//   const baseUrl = (
//     process.env.REACT_APP_BASE_URL || 'http://localhost:4000'
//   ).replace(/\/$/, '');

//   const token = localStorage.getItem('token');

//   const headers = {
//     Authorization: `Bearer ${token}`,
//   };

//   const [dashboardData, setDashboardData] = useState({
//     users: 0,
//     tags: 0,
//     tests: 0,
//     videos: 0,
//     courses: 0,
//     chapters: 0,
//     subjects: 0,
//     payments: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   // 🔹 Fetch Dashboard Stats
//   useEffect(() => {
//     const fetchDashboardStats = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(`${baseUrl}/api/admin/dashboard/stats`, {
//           headers,
//         });

//         const data = res.data?.data || {};

//         setDashboardData({
//           users: data.users || 0,
//           tags: data.tags || 0,
//           tests: data.tests || 0,
//           videos: data.videos || 0,
//           courses: data.courses || 0,
//           chapters: data.chapters || 0,
//           subjects: data.subjects || 0,
//           payments: data.payments || 0,
//         });
//       } catch (err) {
//         console.error('Dashboard Stats Error:', err);

//         toast({
//           title: 'Failed to load dashboard stats',
//           description: err.response?.data?.message || 'Server error',
//           status: 'error',
//           duration: 4000,
//           isClosable: true,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchDashboardStats();
//     } else {
//       toast({
//         title: 'Unauthorized',
//         description: 'Please login again',
//         status: 'warning',
//       });
//       setLoading(false); // 👈 IMPORTANT
//     }
//   }, []);

//   if (loading) {
//     return (
//       <Center pt="150px">
//         <Spinner size="xl" thickness="4px" color="brand.500" />
//       </Center>
//     );
//   }

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
//       <SimpleGrid
//         columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
//         gap="20px"
//         mb="20px"
//       >
//         {/* USERS */}
//         <Link to="/admin/users">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
//                 }
//               />
//             }
//             name="Users"
//             value={dashboardData.users}
//           />
//         </Link>

//         {/* TAGS */}
//         <Link to="/admin/tags">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
//                 }
//               />
//             }
//             name="Tags"
//             value={dashboardData.tags}
//           />
//         </Link>

//         {/* TESTS */}
//         <Link to="/admin/test">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
//                 }
//               />
//             }
//             name="Tests"
//             value={dashboardData.tests}
//           />
//         </Link>

//         {/* VIDEOS */}
//         <Link to="/admin/video">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
//                 }
//               />
//             }
//             name="Video Lectures"
//             value={dashboardData.videos}
//           />
//         </Link>

//         {/* COURSES */}
//         <Link to="/admin/course">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
//                 }
//               />
//             }
//             name="Courses"
//             value={dashboardData.courses}
//           />
//         </Link>

//         {/* CHAPTERS */}
//         <Link to="/admin/chapter">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon
//                     as={FaMoneyBillWave}
//                     w="32px"
//                     h="32px"
//                     color={brandColor}
//                   />
//                 }
//               />
//             }
//             name="Chapters"
//             value={dashboardData.chapters}
//           />
//         </Link>

//         {/* SUBJECTS */}
//         <Link to="/admin/subject">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon
//                     as={FaFileInvoiceDollar}
//                     w="32px"
//                     h="32px"
//                     color={brandColor}
//                   />
//                 }
//               />
//             }
//             name="Subjects"
//             value={dashboardData.subjects}
//           />
//         </Link>

//         {/* PAYMENTS */}
//         <Link to="/admin/payment">
//           <MiniStatistics
//             startContent={
//               <IconBox
//                 w="56px"
//                 h="56px"
//                 bg={boxBg}
//                 icon={
//                   <Icon
//                     as={FaFileInvoiceDollar}
//                     w="32px"
//                     h="32px"
//                     color={brandColor}
//                   />
//                 }
//               />
//             }
//             name="Payments"
//             value={dashboardData.payments}
//           />
//         </Link>
//       </SimpleGrid>
//     </Box>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';

// Icons
import { MdPeople, MdCategory } from 'react-icons/md';
import { FaBookOpen, FaMicrophone, FaMoneyBillWave } from 'react-icons/fa';

export default function UserReports() {
  const brandColor = useColorModeValue('#045e14', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const toast = useToast();

  const baseUrl = (
    process.env.REACT_APP_BASE_URL || 'http://localhost:4000'
  ).replace(/\/$/, '');

  const token = localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ✅ Updated state (Story system)
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    categories: 0,
    chapters: 0,
    topics: 0,
    payments: 0,
  });

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Dashboard Stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${baseUrl}/api/admin/dashboard/stats`, {
          headers,
        });

        const data = res.data?.data || {};

        setDashboardData({
          users: data.users || 0,
          categories: data.categories || 0,
          chapters: data.chapters || 0,
          topics: data.topics || 0,
          payments: data.payments || 0,
        });
      } catch (err) {
        console.error('Dashboard Stats Error:', err);

        toast({
          title: 'Failed to load dashboard stats',
          description: err.response?.data?.message || 'Server error',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardStats();
    } else {
      toast({
        title: 'Unauthorized',
        description: 'Please login again',
        status: 'warning',
      });
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Center pt="150px">
        <Spinner size="xl" thickness="4px" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 5 }}
        gap="20px"
        mb="20px"
      >
        {/* USERS */}
        <Link to="/admin/users">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon as={MdPeople} w="32px" h="32px" color={brandColor} />
                }
              />
            }
            name="Users"
            value={dashboardData.users}
          />
        </Link>

        {/* CATEGORIES */}
        <Link to="/admin/story-category">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon as={MdCategory} w="32px" h="32px" color={brandColor} />
                }
              />
            }
            name="Categories"
            value={dashboardData.categories}
          />
        </Link>

        {/* CHAPTERS */}
        <Link to="/admin/story-chapter">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon as={FaBookOpen} w="32px" h="32px" color={brandColor} />
                }
              />
            }
            name="Chapters"
            value={dashboardData.chapters}
          />
        </Link>

        {/* TOPICS */}
        <Link to="/admin/story-topic">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    as={FaMicrophone}
                    w="32px"
                    h="32px"
                    color={brandColor}
                  />
                }
              />
            }
            name="Topics"
            value={dashboardData.topics}
          />
        </Link>

        {/* PAYMENTS */}
        <Link to="/admin/payment">
          <MiniStatistics
            startContent={
              <IconBox
                w="56px"
                h="56px"
                bg={boxBg}
                icon={
                  <Icon
                    as={FaMoneyBillWave}
                    w="32px"
                    h="32px"
                    color={brandColor}
                  />
                }
              />
            }
            name="Payments"
            value={dashboardData.payments}
          />
        </Link>
      </SimpleGrid>
    </Box>
  );
}
