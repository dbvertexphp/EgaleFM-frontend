/* eslint-disable */
'use client';

import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
  Avatar,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import {
  SearchIcon,
  CheckCircleIcon,
  TimeIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { MdAttachMoney, MdPeople } from 'react-icons/md';
import axios from 'axios';
import * as React from 'react';
import Card from 'components/card/Card';
import { format } from 'date-fns';

export default function SubscriptionHistory() {
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgItem = useColorModeValue('gray.50', 'navy.700');

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}api/admin/payments-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setTransactions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔎 Search Filter (backend ke fields ke hisaab se)
  const filteredData = transactions.filter(
    (t) =>
      t.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // 📊 Stats
  const totalRevenue = transactions.reduce(
    (acc, curr) => acc + (curr.status === 'success' ? curr.amount : 0),
    0,
  );

  const activeSubs = transactions.filter(
    (t) => new Date(t.expiryDate) > new Date() && t.status === 'success',
  ).length;

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* 🟢 Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        <StatsCard
          icon={MdAttachMoney}
          title="Total Revenue"
          stat={`₹${totalRevenue}`}
        />
        <StatsCard
          icon={MdPeople}
          title="Active Subscriptions"
          stat={activeSubs}
        />
      </SimpleGrid>

      {/* 🟢 Main Table Card */}
      <Card
        flexDirection="column"
        w="100%"
        px="25px"
        py="25px"
        boxShadow="lg"
        borderRadius="20px"
      >
        <Flex
          mb="30px"
          justifyContent="space-between"
          align="center"
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Box>
            <Text color={textColor} fontSize="22px" fontWeight="700">
              User Payments
            </Text>
            <Text color="secondaryGray.600" fontSize="sm">
              Monitor all subscription payments
            </Text>
          </Box>

          <InputGroup maxW="400px">
            <InputLeftElement children={<SearchIcon color="gray.400" />} />
            <Input
              variant="filled"
              placeholder="Search by User, Email or Txn ID..."
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="12px"
            />
          </InputGroup>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="brand.500" />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" color="gray.500" mb="24px">
              <Thead bg={bgItem}>
                <Tr>
                  <Th color="gray.400">Transaction ID</Th>
                  <Th color="gray.400">User & Contact</Th>
                  <Th color="gray.400">Plan</Th>
                  <Th color="gray.400">Amount</Th>
                  <Th color="gray.400">Duration</Th>
                  <Th color="gray.400">Buy Date</Th>
                  <Th color="gray.400">Expiry Date</Th>
                  <Th color="gray.400">Status</Th>
                </Tr>
              </Thead>

              <Tbody>
                {filteredData.map((row, i) => {
                  const isExpired = new Date(row.expiryDate) < new Date();

                  return (
                    <Tr key={i} _hover={{ bg: bgItem }} transition="0.2s">
                      <Td fontSize="xs" fontWeight="700" color={textColor}>
                        {row.transactionId}
                      </Td>

                      <Td>
                        <Flex align="center">
                          <Avatar size="sm" name={row.userName} mr="10px" />
                          <Box>
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="600"
                            >
                              {row.userName}
                            </Text>
                            <Text fontSize="xs" color="secondaryGray.600">
                              {row.userEmail}
                            </Text>
                          </Box>
                        </Flex>
                      </Td>

                      <Td>
                        <Tag
                          size="sm"
                          colorScheme="purple"
                          variant="subtle"
                          borderRadius="full"
                        >
                          <TagLabel fontWeight="bold">{row.planName}</TagLabel>
                        </Tag>
                      </Td>

                      <Td fontWeight="700" color={textColor}>
                        ₹{row.amount}
                      </Td>

                      <Td fontWeight="600">{row.duration}</Td>

                      <Td>
                        <Text fontSize="sm" fontWeight="600">
                          {format(new Date(row.buyDate), 'MMM dd, yyyy')}
                        </Text>
                      </Td>

                      <Td>
                        <Box>
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color={isExpired ? 'red.400' : textColor}
                          >
                            {format(new Date(row.expiryDate), 'MMM dd, yyyy')}
                          </Text>

                          {isExpired ? (
                            <Badge
                              colorScheme="red"
                              variant="subtle"
                              fontSize="10px"
                            >
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              colorScheme="green"
                              variant="subtle"
                              fontSize="10px"
                            >
                              Active
                            </Badge>
                          )}
                        </Box>
                      </Td>

                      <Td>
                        <Flex align="center">
                          <Icon
                            as={
                              row.status === 'success'
                                ? CheckCircleIcon
                                : row.status === 'failed'
                                  ? WarningIcon
                                  : TimeIcon
                            }
                            color={
                              row.status === 'success'
                                ? 'green.500'
                                : row.status === 'failed'
                                  ? 'red.500'
                                  : 'orange.500'
                            }
                            mr="5px"
                          />
                          <Text fontSize="sm" fontWeight="600">
                            {row.status.charAt(0).toUpperCase() +
                              row.status.slice(1)}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            {filteredData.length === 0 && (
              <Text textAlign="center" py="5" color="gray.500">No transactions found.</Text>
            )}
          </Box>
        )}
      </Card>
    </Box>
  );
}

// 🟢 Stats Card
function StatsCard({ icon, title, stat }) {
  const bgCard = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Card py="15px" bg={bgCard}>
      <Flex align="center" px="15px">
        <Icon as={icon} w="40px" h="40px" color="brand.500" mr="15px" />
        <Box>
          <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
            {title}
          </Text>
          <Text color={textColor} fontSize="xl" fontWeight="700">
            {stat}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
