// /* eslint-disable */
// 'use client';

// import {
//   Box, Flex, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue,
//   Button, Input, FormControl, FormLabel, useToast, IconButton,
//   Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
//   useDisclosure, InputGroup, InputLeftElement, Select
// } from '@chakra-ui/react';
// import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Card from 'components/card/Card';

// export default function CollarManagement() {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [collars, setCollars] = useState([]); // All data list
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Form States
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedState, setSelectedState] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [collarName, setCollarName] = useState('');
//   const [editData, setEditData] = useState({ id: '', name: '', cityId: '' });

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const textColor = useColorModeValue('secondaryGray.900', 'white');
//   const toast = useToast();

//   const baseUrl = process.env.REACT_APP_BASE_URL;
//   const token = localStorage.getItem('token');

//   // 1. Initial Load: Get Countries and All Collars
//   const fetchData = async () => {
//     try {
//       const [countryRes, collarRes] = await Promise.all([
//         axios.get(`${baseUrl}api/country/getAll`, { headers: { Authorization: `Bearer ${token}` } }),
//         axios.get(`${baseUrl}api/collar/getAll`, { headers: { Authorization: `Bearer ${token}` } })
//       ]);
//       setCountries(countryRes.data.countries || []);
//       setCollars(collarRes.data.collars || []);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // 2. Cascading Logic: Country -> State
//   const handleCountryChange = async (countryId) => {
//     setSelectedCountry(countryId);
//     setSelectedState('');
//     setSelectedCity('');
//     setStates([]);
//     setCities([]);
//     try {
//       const res = await axios.get(`${baseUrl}api/state/getByCountry/${countryId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStates(res.data.states || []);
//     } catch (err) { console.error(err); }
//   };

//   // 3. Cascading Logic: State -> City
//   const handleStateChange = async (stateId) => {
//     setSelectedState(stateId);
//     setSelectedCity('');
//     setCities([]);
//     try {
//       const res = await axios.get(`${baseUrl}api/city/getByState/${stateId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setCities(res.data.cities || []);
//     } catch (err) { console.error(err); }
//   };

//   // 4. Add Collar
//   const handleAddCollar = async () => {
//     if (!collarName || !selectedCity) {
//       return toast({ title: 'Please select City and enter Collar name', status: 'warning' });
//     }
//     setLoading(true);
//     try {
//       await axios.post(`${baseUrl}api/collar/add`,
//         { name: collarName, cityId: selectedCity },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast({ title: 'Collar Added!', status: 'success' });
//       setCollarName('');
//       fetchData();
//     } catch (err) { toast({ title: 'Error adding collar', status: 'error' }); }
//     finally { setLoading(false); }
//   };

//   // 5. Search Filter for Table
//   const filteredCollars = collars.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     c.cityId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>

//       {/* ADD SECTION - 4 Fields Row */}
//       <Card mb='20px' p='20px'>
//         <Text color={textColor} fontSize='22px' fontWeight='700' mb='20px'>College Management</Text>
//         <Flex gap='10px' align='flex-end' wrap='wrap'>
//           <FormControl flex='1' minW='150px'>
//             <FormLabel fontSize='sm'>Country</FormLabel>
//             <Select placeholder='Country' onChange={(e) => handleCountryChange(e.target.value)}>
//               {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//             </Select>
//           </FormControl>

//           <FormControl flex='1' minW='150px'>
//             <FormLabel fontSize='sm'>State</FormLabel>
//             <Select placeholder='State' value={selectedState} onChange={(e) => handleStateChange(e.target.value)} isDisabled={!selectedCountry}>
//               {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
//             </Select>
//           </FormControl>

//           <FormControl flex='1' minW='150px'>
//             <FormLabel fontSize='sm'>City</FormLabel>
//             <Select placeholder='City' value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} isDisabled={!selectedState}>
//               {cities.map(ct => <option key={ct._id} value={ct._id}>{ct.name}</option>)}
//             </Select>
//           </FormControl>

//           <FormControl flex='1' minW='150px'>
//             <FormLabel fontSize='sm'>College Name</FormLabel>
//             <Input value={collarName} onChange={(e) => setCollarName(e.target.value)} placeholder='Ex: Area Name' />
//           </FormControl>

//           <Button colorScheme='blue' onClick={handleAddCollar} isLoading={loading} px='30px'>Add</Button>
//         </Flex>
//       </Card>

//       {/* TABLE SECTION */}
//       <Card p='20px'>
//         <Flex justify='space-between' align='center' mb='20px' wrap='wrap' gap='10px'>
//           <Text color={textColor} fontSize='18px' fontWeight='700'>All College</Text>
//           <InputGroup maxW='300px'>
//             <InputLeftElement><MdSearch color='gray.300' /></InputLeftElement>
//             <Input placeholder='Search collar or city...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </InputGroup>
//         </Flex>

//         <Box overflowX='auto'>
//           <Table variant='simple'>
//             <Thead bg='gray.50'>
//               <Tr>
//                 <Th>S.No</Th>
//                 <Th>Collage Name</Th>
//                 <Th>City</Th>
//                 <Th>State</Th>
//                 <Th>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {filteredCollars.map((c, i) => (
//                 <Tr key={c._id}>
//                   <Td>{i + 1}</Td>
//                   <Td fontWeight='600' color='blue.600'>{c.name}</Td>
//                   <Td>{c.cityId?.name || 'N/A'}</Td>
//                   <Td>{c.cityId?.stateId?.name || 'N/A'}</Td>
//                   <Td>
//                     <IconButton icon={<MdEdit />} colorScheme='green' size='sm' mr='2' />
//                     <IconButton icon={<MdDelete />} colorScheme='red' size='sm' />
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </Box>
//       </Card>

//     </Box>
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
} from '@chakra-ui/react';
import { MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function CollegeManagement() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Modal specific states for cascading
  const [editStates, setEditStates] = useState([]);
  const [editCities, setEditCities] = useState([]);

  // Form States
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [collegeName, setCollegeName] = useState('');

  // Edit State
  const [editData, setEditData] = useState({ id: '', name: '', countryId: '', stateId: '', cityId: '' });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  // 1. Initial Load
  const fetchData = async () => {
    try {
      const [countryRes, collegeRes] = await Promise.all([
        axios.get(`${baseUrl}api/location/country`, getHeaders()),
        axios.get(`${baseUrl}api/location/college`, getHeaders())
      ]);
      setCountries(countryRes.data.data || []);
      setColleges(collegeRes.data.data || []);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Cascading Logic (Add Form)
  const handleCountryChange = async (countryId) => {
    setSelectedCountry(countryId);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);
    if (!countryId) return;
    const res = await axios.get(`${baseUrl}api/location/state?countryId=${countryId}`, getHeaders());
    setStates(res.data.data || []);
  };

  const handleStateChange = async (stateId) => {
    setSelectedState(stateId);
    setSelectedCity('');
    setCities([]);
    if (!stateId) return;
    const res = await axios.get(`${baseUrl}api/location/city?stateId=${stateId}`, getHeaders());
    setCities(res.data.data || []);
  };

  // 3. Edit Modal Cascading Logic
  const handleEditCountryChange = async (countryId) => {
    setEditData({ ...editData, countryId, stateId: '', cityId: '' });
    setEditCities([]);
    const res = await axios.get(`${baseUrl}api/location/state?countryId=${countryId}`, getHeaders());
    setEditStates(res.data.data || []);
  };

  const handleEditStateChange = async (stateId) => {
    setEditData({ ...editData, stateId, cityId: '' });
    const res = await axios.get(`${baseUrl}api/location/city?stateId=${stateId}`, getHeaders());
    setEditCities(res.data.data || []);
  };

  // 4. Open Edit Modal and Pre-fill
  const openEditModal = async (college) => {
    setEditData({
      id: college._id,
      name: college.name,
      countryId: college.countryId?._id,
      stateId: college.stateId?._id,
      cityId: college.cityId?._id
    });

    // Load states and cities for the current college's location
    try {
      const [sRes, cRes] = await Promise.all([
        axios.get(`${baseUrl}api/location/state?countryId=${college.countryId?._id}`, getHeaders()),
        axios.get(`${baseUrl}api/location/city?stateId=${college.stateId?._id}`, getHeaders())
      ]);
      setEditStates(sRes.data.data || []);
      setEditCities(cRes.data.data || []);
      onOpen();
    } catch (err) {
      toast({ title: "Error loading edit data", status: "error" });
    }
  };

  // 5. Update College API call
  const handleUpdate = async () => {
    if (!editData.name || !editData.cityId) return toast({ title: "Fields cannot be empty", status: "warning" });
    setLoading(true);
    try {
      await axios.put(`${baseUrl}api/location/college/${editData.id}`, editData, getHeaders());
      toast({ title: 'College Updated!', status: 'success' });
      onClose();
      fetchData();
    } catch (err) {
      toast({ title: 'Update failed', status: 'error' });
    } finally { setLoading(false); }
  };

  // 6. Add College
  const handleAddCollege = async () => {
    if (!collegeName || !selectedCity) return toast({ title: 'Fill all fields', status: 'warning' });
    setLoading(true);
    try {
      await axios.post(`${baseUrl}api/location/college`,
        { name: collegeName, countryId: selectedCountry, stateId: selectedState, cityId: selectedCity },
        getHeaders()
      );
      toast({ title: 'College Added!', status: 'success' });
      setCollegeName('');
      fetchData();
    } catch (err) { toast({ title: 'Error adding college', status: 'error' }); }
    finally { setLoading(false); }
  };

  // 7. Delete College
  const handleDelete = async (id) => {
    if (window.confirm("Delete this college?")) {
      try {
        await axios.delete(`${baseUrl}api/location/college/${id}`, getHeaders());
        toast({ title: 'Deleted!', status: 'success' });
        fetchData();
      } catch (err) { toast({ title: 'Delete Failed', status: 'error' }); }
    }
  };

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* ADD SECTION */}
      <Card mb='20px' p='20px'>
        <Text color={textColor} fontSize='22px' fontWeight='700' mb='20px'>College Management</Text>
        <Flex gap='10px' align='flex-end' wrap='wrap'>
          <FormControl flex='1' minW='150px'>
            <FormLabel fontSize='sm'>Country</FormLabel>
            <Select placeholder='Select Country' value={selectedCountry} onChange={(e) => handleCountryChange(e.target.value)}>
              {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Select>
          </FormControl>
          <FormControl flex='1' minW='150px'>
            <FormLabel fontSize='sm'>State</FormLabel>
            <Select placeholder='Select State' value={selectedState} onChange={(e) => handleStateChange(e.target.value)} isDisabled={!selectedCountry}>
              {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </Select>
          </FormControl>
          <FormControl flex='1' minW='150px'>
            <FormLabel fontSize='sm'>City</FormLabel>
            <Select placeholder='Select City' value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} isDisabled={!selectedState}>
              {cities.map(ct => <option key={ct._id} value={ct._id}>{ct.name}</option>)}
            </Select>
          </FormControl>
          <FormControl flex='2' minW='200px'>
            <FormLabel fontSize='sm'>College Name</FormLabel>
            <Input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} placeholder='Enter College Name' />
          </FormControl>
          <Button colorScheme='blue' onClick={handleAddCollege} isLoading={loading} px='30px'>Add College</Button>
        </Flex>
      </Card>

      {/* TABLE SECTION */}
      <Card p='20px'>
        <Flex justify='space-between' align='center' mb='20px'>
          <Text color={textColor} fontSize='18px' fontWeight='700'>All Colleges</Text>
          <InputGroup maxW='300px'>
            <InputLeftElement><MdSearch color='gray.300' /></InputLeftElement>
            <Input placeholder='Search college...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Flex>
        <Box overflowX='auto'>
          <Table variant='simple'>
            <Thead bg='gray.50'>
              <Tr>
                <Th>S.No</Th>
                <Th>College Name</Th>
                <Th>City</Th>
                <Th>State</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredColleges.map((c, i) => (
                <Tr key={c._id}>
                  <Td>{i + 1}</Td>
                  <Td fontWeight="600" color="blue.600">
                    {c.name}
                  </Td>
                  <Td>{c.cityId?.name || 'N/A'}</Td>
                  <Td>{c.stateId?.name || 'N/A'}</Td>
                  <Td>
                    <IconButton icon={<MdEdit />} colorScheme='green' size='sm' mr='2' onClick={() => openEditModal(c)} />
                    <IconButton icon={<MdDelete />} colorScheme='red' size='sm' onClick={() => handleDelete(c._id)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>

      {/* UPDATE MODAL */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update College</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb='3'>
              <FormLabel>College Name</FormLabel>
              <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
            </FormControl>
            <FormControl mb='3'>
              <FormLabel>Country</FormLabel>
              <Select value={editData.countryId} onChange={(e) => handleEditCountryChange(e.target.value)}>
                {countries.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Select>
            </FormControl>
            <FormControl mb='3'>
              <FormLabel>State</FormLabel>
              <Select value={editData.stateId} onChange={(e) => handleEditStateChange(e.target.value)}>
                {editStates.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </Select>
            </FormControl>
            <FormControl mb='3'>
              <FormLabel>City</FormLabel>
              <Select value={editData.cityId} onChange={(e) => setEditData({...editData, cityId: e.target.value})}>
                {editCities.map(ct => <option key={ct._id} value={ct._id}>{ct.name}</option>)}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleUpdate} isLoading={loading}>Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
