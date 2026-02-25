/* eslint-disable */
'use client';

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Tag,
  HStack,
  Alert,
  AlertIcon,
  IconButton,
  HStack as ChakraHStack,
} from '@chakra-ui/react';
import { ViewIcon, ChevronLeftIcon, ChevronRightIcon, DownloadIcon } from '@chakra-ui/icons';
import axios from 'axios';
import * as React from 'react';
import Card from 'components/card/Card';

export default function ReferralAdminPaymentTable() {
  const [referralData, setReferralData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReferrer, setSelectedReferrer] = React.useState(null);
  const [paymentIdInput, setPaymentIdInput] = React.useState('');
  const [payingUser, setPayingUser] = React.useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const recordsPerPage = 10;

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgHover = useColorModeValue('gray.50', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}api/referral/getAllReferralSummaries`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setReferralData(res.data.data);
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openReferredModal = (user) => {
    setSelectedReferrer(user);
    onViewOpen();
  };

  const openPayModal = (user) => {
    if (user.wallet_balance <= 0) return;
    setPayingUser(user);
    setPaymentIdInput('');
    onPayOpen();
  };

  const confirmPayment = async () => {
    if (!paymentIdInput.trim()) {
      toast({ title: 'Error', description: 'Payment ID is required', status: 'warning' });
      return;
    }

    try {
      const payload = {
        referralCodeId: payingUser.referralCodeId,
        amount: payingUser.wallet_balance.toString(),
        paymentId: paymentIdInput.trim(),
      };

      const res = await axios.post(
        `${baseUrl}api/referral/adminPayReferral`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        toast({
          title: 'Payment Success',
          description: `₹${payingUser.wallet_balance} paid to ${payingUser.full_name}`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
        fetchData();
        onPayClose();
      }
    } catch (err) {
      toast({
        title: 'Payment Failed',
        description: err.response?.data?.message || 'Try again',
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    }
  };

  const handleExport = () => {
    if (!referralData || referralData.length === 0) {
      toast({
        title: 'No Data',
        description: 'There is no data to export.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 1. Define Headers
    const headers = [
      "User Name",
      "Phone",
      "Referral Code",
      "Total Referred",
      "Max Referrals",
      "Wallet Balance (INR)",
      "Bank Name",
      "Account Holder",
      "Account Number",
      "IFSC Code",
      "UPI ID",
      "Payment Status"
    ];

    // 2. Map Data to Rows
    const csvRows = referralData.map((user) => {
      // Helper to escape CSV characters
      const safe = (text) => {
        if (!text) return '""';
        return `"${String(text).replace(/"/g, '""')}"`;
      };

      const bank = user.bankdetails || {};
      const hasBank = bank.upiId || bank.accountNumber;

      return [
        safe(user.full_name),
        safe(user.phone),
        safe(user.referralCode),
        user.totalReferred,
        user.maxReferrals,
        user.wallet_balance,
        safe(bank.bankName),
        safe(bank.accountHolderName),
        // Force account number as string to prevent scientific notation in Excel
        safe(bank.accountNumber ? `'${bank.accountNumber}` : ''),
        safe(bank.ifscCode),
        safe(bank.upiId),
        safe(hasBank ? (user.wallet_balance > 0 ? "Pending Payment" : "Settled/No Balance") : "Bank Missing")
      ].join(",");
    });

    // 3. Create CSV String
    const csvString = [headers.join(","), ...csvRows].join("\n");

    // 4. Download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `referral_payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  React.useEffect(() => {
    fetchData();
  }, []);

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = referralData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(referralData.length / recordsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Card mt="100px">
        <Flex px="25px" py="20px" justify="space-between" align="center">
          <Text color={textColor} fontSize="28px" fontWeight="800">
            Referral Payments (Main Users)
          </Text>
          <HStack spacing={4}>
            {/* EXPORT BUTTON */}
            <Button
              size="sm"
              colorScheme="green"
              leftIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export 
            </Button>
          
          <Badge colorScheme="green" fontSize="lg">
            {referralData.filter(u => u.wallet_balance > 0).length} Pending
          </Badge>
          </HStack>
        </Flex>
        

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr bg={useColorModeValue('gray.50', 'navy.800')}>
                <Th>User</Th>
                <Th>Referral Code</Th>
                <Th>Referred</Th>
                <Th>Wallet Balance</Th>
                <Th>Bank/UPI</Th>
                <Th>Referred Details</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr><Td colSpan={7} textAlign="center">Loading...</Td></Tr>
              ) : referralData.length === 0 ? (
                <Tr><Td colSpan={7} textAlign="center" color="gray.500">No data</Td></Tr>
              ) : currentRecords.length === 0 ? (
                <Tr><Td colSpan={7} textAlign="center" color="gray.500">No records on this page</Td></Tr>
              ) : (
                currentRecords.map((user) => {
                  const hasBank = user.bankdetails && (user.bankdetails.upiId || user.bankdetails.accountNumber);

                  return (
                    <Tr key={user.userId} _hover={{ bg: bgHover }}>
                      <Td>
                        <Text fontWeight="600">{user.full_name}</Text>
                      </Td>
                      <Td>
                        <Tag colorScheme="blue">{user.referralCode}</Tag>
                      </Td>
                      <Td>
                        <Badge colorScheme={user.totalReferred === user.maxReferrals ? 'red' : 'green'}>
                          {user.totalReferred}/{user.maxReferrals}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="bold" color={user.wallet_balance > 0 ? 'green.600' : 'gray.500'}>
                          ₹{user.wallet_balance}
                        </Text>
                      </Td>
                      <Td>
                        {hasBank ? (
                          <Badge colorScheme="green">Ready</Badge>
                        ) : (
                          <Badge colorScheme="orange">Missing</Badge>
                        )}
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          leftIcon={<ViewIcon />}
                          variant="outline"
                          onClick={() => openReferredModal(user)}
                        >
                          View {user.totalReferred} Users
                        </Button>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => openPayModal(user)}
                          isDisabled={user.wallet_balance <= 499}
                        >
                          Pay ₹{user.wallet_balance}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Pagination Controls */}
        {referralData.length > recordsPerPage && (
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderTopWidth="1px"
            borderColor={borderColor}
            flexWrap="wrap"
            gap={3}
          >
            <Text fontSize="sm" color="gray.600">
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, referralData.length)} of {referralData.length} entries
            </Text>

            <HStack spacing={2}>
              <IconButton
                icon={<ChevronLeftIcon />}
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                isDisabled={currentPage === 1}
                aria-label="Previous page"
              />

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  size="sm"
                  variant={currentPage === i + 1 ? 'solid' : 'outline'}
                  colorScheme={currentPage === i + 1 ? 'teal' : 'gray'}
                  onClick={() => goToPage(i + 1)}
                  minW="36px"
                >
                  {i + 1}
                </Button>
              ))}

              <IconButton
                icon={<ChevronRightIcon />}
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                isDisabled={currentPage === totalPages}
                aria-label="Next page"
              />
            </HStack>
          </Flex>
        )}
      </Card>

      {/* Modal: View Referred Users */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Referred Users by {selectedReferrer?.full_name}
            <Text fontSize="sm" color="gray.500" mt="2">
              Referral Code: {selectedReferrer?.referralCode} • Total: {selectedReferrer?.totalReferred}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {selectedReferrer?.referredUsers.map((ref) => (
                <Box key={ref._id} p={4} borderWidth="1px" borderRadius="lg">
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="600">{ref.full_name}</Text>
                      <Text fontSize="sm" color="gray.600">{ref.phone}</Text>
                      <Text fontSize="xs" color="gray.500">
                        Joined: {new Date(ref.createdAt).toLocaleString()}
                      </Text>
                    </Box>
                    <Badge colorScheme="teal">₹50 Earned</Badge>
                  </Flex>
                  {Object.keys(ref.bankdetails || {}).length > 0 && (
                    <Box mt={3} fontSize="sm" color="gray.600">
                      <Text><strong>Bank:</strong> {ref.bankdetails.bankName || '—'}</Text>
                      <Text><strong>UPI:</strong> {ref.bankdetails.upiId || '—'}</Text>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Pay Modal with Bank Details */}
      <Modal isOpen={isPayOpen} onClose={onPayClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pay Referral Bonus</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={5}>
              <Box>
                <Text fontSize="sm" color="gray.600">Paying to</Text>
                <Text fontWeight="bold" fontSize="lg">{payingUser?.full_name}</Text>
                <Text fontSize="sm" color="gray.500">Phone: {payingUser?.phone}</Text>
              </Box>

              <Box>
                <Text fontSize="sm" color="gray.600">Amount</Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  ₹{payingUser?.wallet_balance}
                </Text>
              </Box>

              {/* Bank/UPI Details */}
              {payingUser?.bankdetails ? (
                <Box p={4} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                  <Text fontWeight="bold" mb={3} color="blue.700">
                    Payment Details (Send money here)
                  </Text>

                  {payingUser.bankdetails.upiId ? (
                    <HStack align="center" spacing={3}>
                      <Text fontWeight="600">UPI ID:</Text>
                      <Tag size="lg" colorScheme="purple" fontFamily="mono" p={2}>
                        {payingUser.bankdetails.upiId}
                      </Tag>
                    </HStack>
                  ) : null}

                  {payingUser.bankdetails.accountNumber ? (
                    <Stack spacing={2} fontSize="sm" mt={payingUser.bankdetails.upiId ? 3 : 0}>
                      <HStack>
                        <Text fontWeight="600">Bank Name:</Text>
                        <Text>{payingUser.bankdetails.bankName || '—'}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="600">Account Holder:</Text>
                        <Text fontWeight="bold">{payingUser.bankdetails.accountHolderName}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="600">A/c Number:</Text>
                        <Tag fontFamily="mono">{payingUser.bankdetails.accountNumber}</Tag>
                      </HStack>
                      <HStack>
                        <Text fontWeight="600">IFSC Code:</Text>
                        <Tag colorScheme="teal" fontFamily="mono">{payingUser.bankdetails.ifscCode}</Tag>
                      </HStack>
                    </Stack>
                  ) : null}

                  {!payingUser.bankdetails.upiId && !payingUser.bankdetails.accountNumber && (
                    <Text color="orange.600">No valid payment method found</Text>
                  )}
                </Box>
              ) : (
                <Alert status="error">
                  <AlertIcon />
                  <Text fontWeight="bold">No Bank/UPI Details Added!</Text>
                  <Text fontSize="sm">User must add payment details before payout.</Text>
                </Alert>
              )}

              <FormControl isRequired>
                <FormLabel>Enter Payment ID / Transaction Reference</FormLabel>
                <Input
                  placeholder="e.g. pay_ABC123xyz or UTR: 9876543210"
                  value={paymentIdInput}
                  onChange={(e) => setPaymentIdInput(e.target.value)}
                  fontFamily="mono"
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPayClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmPayment}
              isDisabled={!paymentIdInput.trim()}
            >
              Confirm & Pay ₹{payingUser?.wallet_balance}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

