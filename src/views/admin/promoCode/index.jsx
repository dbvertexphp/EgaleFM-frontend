/* eslint-disable */
'use client';

import {
  Box, Flex, Text, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td,
  Button, Input, FormControl, FormLabel, useToast, IconButton,
  Select, Badge, SimpleGrid, Icon, NumberInput, NumberInputField,
  Checkbox, CheckboxGroup, Stack, Spinner
} from '@chakra-ui/react';
import { MdLocalOffer, MdDelete, MdAddCircle } from 'react-icons/md';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'components/card/Card';

export default function PromoManagement() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    maxDiscount: 0,
    minPurchase: 0,
    usageLimit: 100,
    expiryDate: '',
    applicableMonths: [] // [1, 3, 6, 12]
  });

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const toast = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}api/promo/list`, { headers });
      setPromos(res.data.data || []);
    } catch (err) {
      toast({ title: 'Error fetching promos', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPromos(); }, []);

  const handleAddPromo = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      await axios.post(`${baseUrl}api/promo/add`, formData, { headers });
      toast({ title: 'Promo Code Added!', status: 'success' });
      setFormData({
        code: '', discountType: 'percentage', discountValue: 0,
        maxDiscount: 0, minPurchase: 0, usageLimit: 100, expiryDate: '', applicableMonths: []
      });
      fetchPromos();
    } catch (err) {
      toast({ title: err.response?.data?.message || 'Error', status: 'error' });
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this promo code?")) {
      try {
        await axios.delete(`${baseUrl}api/promo/delete/${id}`, { headers });
        fetchPromos();
      } catch (err) { toast({ title: 'Delete failed', status: 'error' }); }
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        {/* ADD PROMO FORM */}
        <Card p="20px" gridColumn={{ md: "span 1" }}>
          <Text color={textColor} fontSize="xl" fontWeight="700" mb="20px">
            Create Promo Code
          </Text>
          <form onSubmit={handleAddPromo}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Promo Code</FormLabel>
                <Input 
                  placeholder="EX: NEET2024" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </FormControl>

              <Flex gap={3}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Type</FormLabel>
                  <Select value={formData.discountType} onChange={(e) => setFormData({...formData, discountType: e.target.value})}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Value</FormLabel>
                  <Input type="number" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: e.target.value})} />
                </FormControl>
              </Flex>

              <Flex gap={3}>
                <FormControl>
                  <FormLabel fontSize="sm">Min Purchase</FormLabel>
                  <Input type="number" value={formData.minPurchase} onChange={(e) => setFormData({...formData, minPurchase: e.target.value})} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm">Max Discount</FormLabel>
                  <Input type="number" value={formData.maxDiscount} onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})} />
                </FormControl>
              </Flex>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Expiry Date</FormLabel>
                <Input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Applicable for (Months)</FormLabel>
                <CheckboxGroup colorScheme="brand" value={formData.applicableMonths} onChange={(val) => setFormData({...formData, applicableMonths: val.map(Number)})}>
                  <Stack direction="row" wrap="wrap" spacing={4}>
                    {[1, 3, 6, 12].map(m => <Checkbox key={m} value={m}>{m}m</Checkbox>)}
                  </Stack>
                </CheckboxGroup>
              </FormControl>

              <Button colorScheme="brand" type="submit" isLoading={btnLoading} leftIcon={<MdAddCircle />}>
                Save Promo Code
              </Button>
            </Stack>
          </form>
        </Card>

        {/* PROMO LIST TABLE */}
        <Card p="20px" gridColumn={{ md: "span 2" }} overflowX="auto">
          <Text color={textColor} fontSize="xl" fontWeight="700" mb="20px">Existing Promos</Text>
          {loading ? <Spinner /> : (
            <Table variant="simple" size="sm">
              <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
                <Tr>
                  <Th>Code</Th>
                  <Th>Discount</Th>
                  <Th>Usage</Th>
                  <Th>Expiry</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {promos.map((p) => (
                  <Tr key={p._id}>
                    <Td fontWeight="bold">{p.code}</Td>
                    <Td>
                      {p.discountType === 'percentage' ? `${p.discountValue}%` : `₹${p.discountValue}`}
                      <Text fontSize="xs" color="gray.500">Min: ₹{p.minPurchase}</Text>
                    </Td>
                    <Td>{p.usedCount || 0} / {p.usageLimit}</Td>
                    <Td>
                      <Badge colorScheme={new Date(p.expiryDate) < new Date() ? 'red' : 'green'}>
                        {new Date(p.expiryDate).toLocaleDateString()}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton icon={<MdDelete />} colorScheme="red" size="sm" onClick={() => handleDelete(p._id)} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Card>
      </SimpleGrid>
    </Box>
  );
}