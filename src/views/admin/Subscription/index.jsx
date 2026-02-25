/* eslint-disable */
'use client';

import {
  Box, Flex, Text, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td,
  Badge, Button, Input, Switch, useToast, Modal, ModalOverlay, Select,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  FormControl, FormLabel, useDisclosure, Textarea, IconButton, Stack, Spinner
} from '@chakra-ui/react';
import axios from 'axios';
import * as React from 'react';
import { EditIcon, AddIcon, DeleteIcon, SmallAddIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';

export default function SubscriptionPlans() {
  const [plans, setPlans] = React.useState([]);
  const [editingPlan, setEditingPlan] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Form Initial State
  const initialForm = {
    name: '',
    features: '',
    pricing: [{ months: 1, price: '' }],
    isActive: true,
  };

  const [formData, setFormData] = React.useState(initialForm);

  // 🟢 1. Fetch Plans (Backend Endpoint: /api/plans/admin/all-plans)
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}api/plans/admin/all-plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status) {
        setPlans(response.data.data);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast({ title: 'Error loading plans', description: 'Backend connection failed', status: 'error', position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => { fetchPlans(); }, []);

  // 🟢 2. Pricing Row Handlers
  const addPricingRow = () => {
    setFormData({ ...formData, pricing: [...formData.pricing, { months: 1, price: '' }] });
  };

  const removePricingRow = (index) => {
    const newPricing = formData.pricing.filter((_, i) => i !== index);
    setFormData({ ...formData, pricing: newPricing });
  };

  const handlePricingChange = (index, field, value) => {
    const newPricing = [...formData.pricing];
    newPricing[index][field] = field === 'price' ? value : Number(value);
    setFormData({ ...formData, pricing: newPricing });
  };

  // 🟢 3. Modal Controls
  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        isActive: plan.isActive,
        features: plan.features?.join(', ') || '',
        pricing: plan.pricing?.length > 0 ? plan.pricing : [{ months: 1, price: '' }],
      });
    } else {
      setEditingPlan(null);
      setFormData(initialForm);
    }
    onOpen();
  };

  // 🟢 4. Save Logic (Backend Endpoints: /create-plan & /update-plan)
  const handleSave = async () => {
    if (!formData.name || formData.pricing.some(p => !p.price)) {
      return toast({ title: "Validation Error", description: "Please fill all fields", status: "warning" });
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        pricing: formData.pricing.map(p => ({ months: Number(p.months), price: Number(p.price) })),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f !== ''),
      };

      // Match your backend route structure
      const url = editingPlan 
        ? `${baseUrl}api/plans/update-plan/${editingPlan._id}` 
        : `${baseUrl}api/plans/create-plan`;
      
      const method = editingPlan ? 'put' : 'post';

      const response = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        toast({ title: 'Plan Saved Successfully', status: 'success' });
        fetchPlans();
        onClose();
      }
    } catch (err) {
      toast({ title: 'Operation failed', description: err.response?.data?.message || 'Server Error', status: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card flexDirection="column" w="100%" px="25px" py="25px" mt="80px" boxShadow="lg" borderRadius="20px">
      <Flex mb="30px" justifyContent="space-between" align="center">
        <Box>
          <Text color={textColor} fontSize="22px" fontWeight="700">Subscription Plans</Text>
          <Text color="secondaryGray.600" fontSize="sm">Manage plan pricing and features</Text>
        </Box>
        <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={() => handleOpenModal()}>
          Create Plan
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px"><Spinner /></Flex>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple" color={textColor}>
            <Thead bg={useColorModeValue('gray.50', 'navy.800')}>
              <Tr>
                <Th>Plan Name</Th>
                <Th>Pricing Tiers (Months : Price)</Th>
                <Th>Features</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {plans.map((plan) => (
                <Tr key={plan._id}>
                  <Td fontWeight="bold" fontSize="sm">{plan.name}</Td>
                  <Td>
                    <Stack direction="row" flexWrap="wrap" gap={2}>
                      {plan.pricing?.map((p, i) => (
                        <Badge key={i} colorScheme="purple" variant="subtle" borderRadius="full" px={2}>
                          {p.months}M : ₹{p.price}
                        </Badge>
                      ))}
                    </Stack>
                  </Td>
                  <Td>
                    <Text noOfLines={1} fontSize="xs" maxW="200px" color="gray.500">
                      {plan.features?.join(', ')}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={plan.isActive ? 'green' : 'red'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton icon={<EditIcon />} size="sm" variant="outline" onClick={() => handleOpenModal(plan)} aria-label="Edit" />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* 🟢 Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent borderRadius="15px">
          <ModalHeader borderBottom="1px solid" borderColor="gray.100">
            {editingPlan ? 'Update Plan Details' : 'Create New Subscription'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="600">Plan Name</FormLabel>
                <Input placeholder="e.g. Professional Plus" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </FormControl>

              <Box p={4} bg={useColorModeValue('gray.50', 'whiteAlpha.100')} borderRadius="12px">
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="700" fontSize="sm">Pricing Variants</Text>
                  <Button size="xs" colorScheme="brand" variant="ghost" leftIcon={<SmallAddIcon />} onClick={addPricingRow}>
                    Add New Row
                  </Button>
                </Flex>

                {formData.pricing.map((tier, index) => (
                  <Flex key={index} gap={3} mb={3} align="center">
                    <Select flex="1" value={tier.months} onChange={(e) => handlePricingChange(index, 'months', e.target.value)}>
                      <option value={1}>1 Month</option>
                      <option value={3}>3 Months</option>
                      <option value={6}>6 Months</option>
                      <option value={12}>1 Year</option>
                      <option value={24}>2 Year</option>
                    </Select>
                    <Input flex="1" type="number" placeholder="Price (₹)" value={tier.price} onChange={(e) => handlePricingChange(index, 'price', e.target.value)} />
                    <IconButton icon={<DeleteIcon />} size="sm" colorScheme="red" variant="ghost" onClick={() => removePricingRow(index)} isDisabled={formData.pricing.length === 1} />
                  </Flex>
                ))}
              </Box>

              <FormControl>
                <FormLabel fontWeight="600">Plan Features</FormLabel>
                <Textarea placeholder="24/7 Support, Premium Content, Unlimited Downloads (Comma separated)" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0" fontWeight="600">Is Plan Active?</FormLabel>
                <Switch isChecked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor="gray.100">
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="brand" isLoading={saving} onClick={handleSave} px={8}>
              {editingPlan ? 'Update Plan' : 'Save Plan'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}