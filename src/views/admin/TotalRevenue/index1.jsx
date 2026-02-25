/* eslint-disable */
'use client';

import {
  Box,
  Text,
  Card,
  CardBody,
  Stack,
  Select,
  useColorModeValue,
  CardHeader,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function PaymentsDashboard() {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedYear, setSelectedYear] = React.useState('');
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'gray.700');
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  const fetchPayments = async () => {
    try {
      if (!baseUrl || !token) {
        throw new Error('Missing base URL or authentication token');
      }
      setLoading(true);
      const response = await axios.get(`${baseUrl}api/admin/getAdminPayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API Response (Payments):', response.data);

      if (!response.data || !response.data.payments) {
        throw new Error('Invalid response format: Expected payment data');
      }
      console.log('Payment Data:', response.data);
      setData(response.data.payments);
      setLoading(false);
    } catch (err) {
      console.error('Fetch Payments Error:', err);
      if (
        err.response?.data?.message === 'Not authorized, token failed' ||
        err.response?.data?.message === 'Session expired or logged in on another device' ||
        err.response?.data?.message === 'Un-Authorized, You are not authorized to access this route.' ||
        err.response?.data?.message === 'Not authorized, token failed'
      ) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError(err.message || 'Failed to fetch payment data');
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, [navigate]);

  if (loading) {
    return (
      <Card bg={cardBg} p="20px" borderRadius="20px" boxShadow="lg">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Loading...
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card bg={cardBg} p="20px" borderRadius="20px" boxShadow="lg" mt="80px">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Error: {error}
        </Text>
      </Card>
    );
  }

  const paymentTypes = [
    { key: 'direct', label: 'Direct' },
    { key: 'bidding', label: 'Bidding' },
    { key: 'emergency', label: 'Emergency' },
    { key: 'totals', label: 'Totals' },
  ];

  // Extract unique years and available months from totals.monthly keys
  const allMonthKeys = Object.keys(data.totals?.monthly || {});
  const years = [...new Set(allMonthKeys.map((key) => key.split('-')[0]))].sort();
  const availableMonths = selectedYear
    ? [...new Set(allMonthKeys.filter((key) => key.startsWith(`${selectedYear}-`)).map((key) => key.split('-')[1]))].sort()
    : [];

  // Filtered months based on selection
  const getFilteredMonths = () => {
    if (selectedMonth && selectedYear) {
      return [`${selectedYear}-${selectedMonth}`];
    }
    if (selectedYear) {
      return allMonthKeys.filter((key) => key.startsWith(`${selectedYear}-`)).sort();
    }
    return allMonthKeys.sort();
  };

  const filteredMonths = getFilteredMonths();

  // Handle year change and reset month if necessary
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    if (newYear && availableMonths.length > 0 && !availableMonths.includes(selectedMonth)) {
      setSelectedMonth('');
    }
  };

  const getChartData = (paymentData) => {
    const total = paymentData.total || 1; // Avoid division by zero
    const labels = filteredMonths;
    const getProportionedData = (key) => {
      const totalValue = paymentData[key] || 0;
      return labels.map((month) => {
        const monthlyTotal = paymentData.monthly?.[month] || 0;
        return monthlyTotal > 0 ? (totalValue / total) * monthlyTotal : 0;
      });
    };

    return {
      labels,
      datasets: [
        {
          label: 'Released',
          data: getProportionedData('released'),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Release Request',
          data: getProportionedData('release_request'),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
        },
        {
          label: 'Pending',
          data: getProportionedData('pending'),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.1,
        },
      ],
    };
  };

  return (
    <Box p="20px" bg="white" minHeight="100vh" mt="80px">
      <Card bg={cardBg} p="20px" borderRadius="20px" boxShadow="lg" mb="30px">
        <CardHeader>
          <Heading size="xl">Admin Payments Overview</Heading>
        </CardHeader>
        <CardBody>
          <Stack direction={{ base: 'column', md: 'row' }} spacing="4">
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="Select Year ▼"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="Select Month ▼"
              borderRadius="8px"
              borderColor="gray.300"
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
              isDisabled={!selectedYear}
            >
              <option value="">All Months</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Select>
          </Stack>
        </CardBody>
      </Card>

      <Stack spacing="20px">
        {paymentTypes.map(({ key, label }) => {
          const payment = data[key] || {};
          const filteredMonths = getFilteredMonths();
          const isSingleMonth = filteredMonths.length === 1;

          const periodReleased = filteredMonths.reduce((acc, m) => acc + getProportionedDataForMonth(payment, m, 'released'), 0);
          const periodReleaseRequest = filteredMonths.reduce((acc, m) => acc + getProportionedDataForMonth(payment, m, 'release_request'), 0);
          const periodPending = filteredMonths.reduce((acc, m) => acc + getProportionedDataForMonth(payment, m, 'pending'), 0);
          const periodTotal = filteredMonths.reduce((acc, m) => acc + (payment.monthly?.[m] || 0), 0);

          const periodType = selectedMonth
            ? 'Monthly'
            : selectedYear
            ? 'Yearly'
            : 'Overall';

          const periodLabel = selectedMonth
            ? ` (${selectedYear}-${selectedMonth})`
            : selectedYear
            ? ` (${selectedYear})`
            : '';

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                text: `${label} Payments${periodLabel}`,
                font: { size: 18 },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { callback: (value) => `₹${value.toLocaleString()}` },
              },
            },
          };

          const ChartComponent = isSingleMonth ? Bar : Line;

          return (
            <Card
              key={key}
              bg={cardBg}
              borderRadius="20px"
              boxShadow="lg"
              p="20px"
            >
              <CardHeader>
                <Heading size="md">{label} Payments</Heading>
              </CardHeader>
              <CardBody>
                <Flex direction="column" align="stretch">
                  {/* Chart */}
                  <Box h="400px" mb="20px" w="100%">
                    <ChartComponent data={getChartData(payment)} options={chartOptions} />
                  </Box>
                  {/* Data Display - Improved styling */}
                  <Box p="20px" bg="gray.100" borderRadius="12px" boxShadow="md">
                    <Text fontSize="lg" fontWeight="bold" mb="10px" color="blue.600">
                      Payment Details{periodLabel}
                    </Text>
                    <Stack spacing="2">
                      <Text fontWeight="semibold" color="green.500">
                        Released: ₹{periodReleased.toLocaleString()}
                      </Text>
                      <Text fontWeight="semibold" color="red.500">
                        Release Request: ₹{periodReleaseRequest.toLocaleString()}
                      </Text>
                      <Text fontWeight="semibold" color="blue.500">
                        Pending: ₹{periodPending.toLocaleString()}
                      </Text>
                      <Text fontWeight="semibold" color="purple.500">
                        {periodType} Total: ₹{periodTotal.toLocaleString()}
                      </Text>
                    </Stack>
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}

// Helper function to proportion data for a specific month
function getProportionedDataForMonth(paymentData, month, key) {
  const total = paymentData.total || 1; // Avoid division by zero
  const monthlyTotal = paymentData.monthly?.[month] || 0;
  const totalValue = paymentData[key] || 0;
  return monthlyTotal > 0 ? (totalValue / total) * monthlyTotal : 0;
}
