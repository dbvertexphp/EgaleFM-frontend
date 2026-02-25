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

      if (!response.data?.payments) {
        throw new Error('Invalid response format');
      }

      setData(response.data.payments);
      setLoading(false);
    } catch (err) {
      console.error('Fetch Payments Error:', err);
      if (
        err.response?.data?.message?.includes('authorized') ||
        err.response?.data?.message?.includes('Session expired')
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
  }, []);

  if (loading) {
    return (
      <Card bg={cardBg} p="20px" borderRadius="20px" boxShadow="lg">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Loading payments data...
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card bg={cardBg} p="20px" borderRadius="20px" boxShadow="lg" mt="80px">
        <Text color={textColor} fontSize="22px" fontWeight="700" color="red.500">
          Error: {error}
        </Text>
      </Card>
    );
  }

  const { direct, bidding, emergency, subscriptions, totals } = data;

  // Extract years and months
  const allMonthlyKeys = Object.keys(totals?.monthly || {});
  const years = [...new Set(allMonthlyKeys.map(k => k.split('-')[0]))].sort((a, b) => b - a);
  const monthsForYear = selectedYear
    ? allMonthlyKeys
        .filter(k => k.startsWith(selectedYear + '-'))
        .map(k => k.split('-')[1])
        .sort()
    : [];

  // Determine display months based on filters
  const getDisplayMonths = () => {
    if (selectedMonth && selectedYear) return [`${selectedYear}-${selectedMonth.padStart(2, '0')}`];
    if (selectedYear) return allMonthlyKeys.filter(k => k.startsWith(selectedYear + '-'));
    return allMonthlyKeys;
  };

  const displayMonths = getDisplayMonths();
  const isSingleMonth = displayMonths.length === 1;

  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setSelectedMonth('');
  };

  const periodLabel = selectedMonth
    ? `${new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}`
    : selectedYear
    ? selectedYear
    : 'All Time';

  // Helper: Calculate proportional values for normal payment types
  const calculatePeriodTotals = (payment) => {
    const monthlyTotal = displayMonths.reduce((sum, m) => sum + (payment.monthly?.[m] || 0), 0);
    const totalAllTime = payment.total || 1;

    const proportion = (key) => {
      const value = payment[key] || 0;
      return totalAllTime > 0 ? (value / totalAllTime) * monthlyTotal : 0;
    };

    return {
      released: proportion('released'),
      release_request: proportion('release_request'),
      pending: proportion('pending'),
      refunded: payment.refunded || 0,
      rejected: payment.rejected || 0,
      total: monthlyTotal,
    };
  };

  // Chart data for regular payments
  const getRegularChartData = (payment) => {
    const monthlyData = payment.monthly || {};
    const total = payment.total || 1;

    const proportion = (key) => (value) => total > 0 ? ((payment[key] || 0) / total) * value : 0;

    return {
      labels: displayMonths.map(m => {
        const [y, mo] = m.split('-');
        return `${new Date(y, mo - 1).toLocaleString('default', { month: 'short' })} ${y}`;
      }),
      datasets: [
        {
          label: 'Released',
          data: displayMonths.map(m => proportion('released')(monthlyData[m] || 0)),
          backgroundColor: 'rgba(34, 197, 94, 0.6)',
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.3,
        },
        {
          label: 'Release Request',
          data: displayMonths.map(m => proportion('release_request')(monthlyData[m] || 0)),
          backgroundColor: 'rgba(251, 146, 60, 0.6)',
          borderColor: 'rgb(251, 146, 60)',
          tension: 0.3,
        },
        {
          label: 'Pending',
          data: displayMonths.map(m => proportion('pending')(monthlyData[m] || 0)),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.3,
        },
      ],
    };
  };

  // Chart data for subscriptions (simple total revenue)
  const getSubscriptionChartData = () => ({
    labels: displayMonths.map(m => {
      const [y, mo] = m.split('-');
      return `${new Date(y, mo - 1).toLocaleString('default', { month: 'short' })} ${y}`;
    }),
    datasets: [
      {
        label: 'Subscription Revenue',
        data: displayMonths.map(m => subscriptions?.monthly?.[m] || 0),
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgb(139, 92, 246)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(139, 92, 246)',
      },
    ],
  });

  const chartOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top'},
      title: { display: true, text: title, font: { size: 18 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: number) => `₹${value.toLocaleString()}` },
      },
    },
  });

  const paymentSections = [
    { key: 'direct', label: 'Direct Payments', data: direct },
    { key: 'bidding', label: 'Bidding Payments', data: bidding },
    { key: 'emergency', label: 'Emergency Payments', data: emergency },
    { key: 'subscriptions', label: 'Subscription Revenue', data: subscriptions, isSubscription: true },
    { key: 'totals', label: 'All Payments (Total)', data: totals },
  ];

  return (
    <Box p="20px" bg="white" minHeight="100vh" mt="80px">
      <Card bg={cardBg} borderRadius="20px" boxShadow="lg" mb="30px">
        <CardHeader>
          <Heading size="xl">Admin Payments Dashboard</Heading>
        </CardHeader>
        <CardBody>
          <Stack direction={{ base: 'column', md: 'row' }} spacing="4">
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              placeholder="All Years"
              w={{ base: '100%', md: '200px' }}
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Select>
            <Select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              placeholder="All Months"
              isDisabled={!selectedYear}
              w={{ base: '100%', md: '250px' }}
            >
              {monthsForYear.map(month => (
                <option key={month} value={month}>
                  {new Date(2025, parseInt(month) - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </Select>
          </Stack>
        </CardBody>
      </Card>

      <Stack spacing="30px">
        {paymentSections.map(({ key, label, data: payment, isSubscription }) => {
          if (!payment) return null;

          const ChartType = isSingleMonth ? Bar : Line;
          const periodTotal = displayMonths.reduce((sum, m) => sum + ((payment.monthly?.[m]) || 0), 0);
          const period = !isSubscription ? calculatePeriodTotals(payment) : null;

          return (
            <Card key={key} bg={cardBg} borderRadius="20px" boxShadow="lg">
              <CardHeader>
                <Heading size="md">{label} - {periodLabel}</Heading>
              </CardHeader>
              <CardBody>
                <Box h="400px" mb="24px">
                  <ChartType
                    data={isSubscription ? getSubscriptionChartData() : getRegularChartData(payment)}
                    options={chartOptions(`${label} Trend`)}
                  />
                </Box>

                <Box p="6" bg="gray.50" borderRadius="16px">
                  <Text fontSize="lg" fontWeight="bold" mb="3" color="blue.700">
                    Summary ({periodLabel})
                  </Text>
                  <Stack spacing="3">
                    {isSubscription ? (
                      <Text fontSize="2xl" fontWeight="700" color="purple.600">
                        ₹{Math.round(periodTotal).toLocaleString()}
                      </Text>
                    ) : key === 'totals' ? (
                      <>
                        <Text fontWeight="600" color="green.600">
                          Released: ₹{Math.round(period.released).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="orange.600">
                          Release Requests: ₹{Math.round(period.release_request).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="blue.600">
                          Pending: ₹{Math.round(period.pending).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="red.600">
                          Rejected/Refunded: ₹{Math.round((period.rejected || 0) + (period.refunded || 0)).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="purple.700" fontSize="xl">
                          Total Revenue: ₹{Math.round(period.total).toLocaleString()}
                        </Text>
                        {payment.subscription_revenue ? (
                          <Text fontWeight="600" color="pink.600">
                            + Subscriptions: ₹{payment.subscription_revenue.toLocaleString()}
                          </Text>
                        ) : null}
                        {payment.platform_fee !== undefined && (
                          <Text fontWeight="600" color="teal.600">
                            Platform Fee: ₹{payment.platform_fee.toLocaleString()}
                          </Text>
                        )}
                      </>
                    ) : (
                      <>
                        <Text fontWeight="600" color="green.600">
                          Released: ₹{Math.round(period.released).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="orange.600">
                          Release Requests: ₹{Math.round(period.release_request).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="blue.600">
                          Pending: ₹{Math.round(period.pending).toLocaleString()}
                        </Text>
                        <Text fontWeight="600" color="purple.700" fontSize="lg">
                          Total This Period: ₹{Math.round(period.total).toLocaleString()}
                        </Text>
                        {payment.platform_fee !== undefined && (
                          <Text fontWeight="600" color="teal.600">
                            Platform Fee Collected: ₹{payment.platform_fee.toLocaleString()}
                          </Text>
                        )}
                      </>
                    )}
                  </Stack>
                </Box>
              </CardBody>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
