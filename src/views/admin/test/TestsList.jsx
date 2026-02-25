import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Select,
  useToast,
  Spinner,
  VStack,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
  SimpleGrid,
  Tag,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon, SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TestsList() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const isQTestListPage = pathname.startsWith('/admin/q-test-list');
  const isTestListPage = pathname.startsWith('/admin/test-list');

  const fixedMode = isQTestListPage ? 'regular' : 'exam';

  const baseUrlRaw = process.env.REACT_APP_BASE_URL || 'http://localhost:4000';
  const baseUrl = baseUrlRaw.endsWith('/')
    ? baseUrlRaw.slice(0, -1)
    : baseUrlRaw;

  const token = localStorage.getItem('token') || '';
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    testMode: fixedMode,
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({ total: 0, pages: 0 });
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [coursesMap, setCoursesMap] = useState({});

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // Fetch tests (inside effect to avoid unstable deps)
  useEffect(() => {
    let isMounted = true;
    const fetchTests = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.testMode) params.append('testMode', filters.testMode);
        params.append('page', filters.page);
        params.append('limit', filters.limit);

        const res = await axios.get(
          `${baseUrl}/api/admin/tests?${params.toString()}`,
          axiosConfig,
        );
        if (!isMounted) return;
        const allTests = res.data?.tests || [];
        setTests(allTests);
        setPagination(
          res.data?.pagination || { total: allTests.length, pages: 1 },
        );
      } catch (err) {
        console.error('fetchTests error', err);
        if (!isMounted) return;
        toast({
          title: 'Error',
          description: err?.response?.data?.message || 'Failed to fetch tests',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setTests([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTests();
    return () => {
      isMounted = false;
    };
  }, [baseUrl, axiosConfig, filters, toast]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/admin/courses`,
          axiosConfig,
        );

        const list = res.data?.data || res.data?.courses || [];
        const map = {};
        list.forEach((c) => {
          map[c._id] = c.name;
        });

        setCoursesMap(map);
      } catch (err) {
        console.error('fetchCourses error', err);
      }
    };

    fetchCourses();
  }, [baseUrl, axiosConfig]);
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      testMode: fixedMode,
      page: 1,
    }));
  }, [fixedMode]);

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this test?')) return;
    try {
      await axios.delete(`${baseUrl}/api/admin/tests/${testId}`, axiosConfig);
      toast({
        title: 'Success',
        description: 'Test deleted successfully',
        status: 'success',
      });
      // refresh
      setFilters((p) => ({ ...p })); // re-trigger effect (or you can call fetch via other pattern)
    } catch (err) {
      console.error('delete test error', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to delete test',
        status: 'error',
      });
    }
  };

  const handleViewTest = async (testId) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/tests/${testId}`,
        axiosConfig,
      );
      setSelectedTest(res.data?.data || null);
      onViewOpen();
    } catch (err) {
      console.error('view test error', err);
      toast({
        title: 'Error',
        description:
          err?.response?.data?.message || 'Failed to fetch test details',
        status: 'error',
      });
    }
  };

  const handleOpenEdit = (test) => {
    setEditForm({
      testTitle: test.testTitle || '',
      month: test.month || '',
      academicYear: test.academicYear || '',
      testMode: fixedMode,
      mcqLimit: test.mcqLimit ?? 0,
      timeLimit: test.timeLimit ?? '',
      description: test.description || '',
      status: test.status || 'draft',
      id: test._id,
    });
    onEditOpen();
  };

  const handleEditChange = (field, value) =>
    setEditForm((p) => ({ ...p, [field]: value }));

  const handleUpdateTest = async () => {
    const {
      id,
      testTitle,
      month,
      academicYear,
      testMode,
      mcqLimit,
      timeLimit,
      description,
      status,
    } = editForm;
    if (!testTitle || !month || !academicYear) {
      toast({
        title: 'Missing fields',
        description: 'Please fill Title, Month and Academic Year',
        status: 'error',
      });
      return;
    }
    if (!mcqLimit || Number(mcqLimit) < 1) {
      toast({
        title: 'Invalid MCQ Limit',
        description: 'MCQ Limit must be at least 1',
        status: 'error',
      });
      return;
    }
    if (testMode === 'exam' && (!timeLimit || Number(timeLimit) < 1)) {
      toast({
        title: 'Invalid Time Limit',
        description: 'Time limit is required for Exam Mode',
        status: 'error',
      });
      return;
    }

    setEditLoading(true);
    try {
      const payload = {
        testTitle,
        month,
        academicYear,
        testMode,
        mcqLimit: Number(mcqLimit),
        timeLimit: testMode === 'exam' ? Number(timeLimit) : null,
        description: description || '',
        status,
      };
      await axios.put(`${baseUrl}/api/admin/tests/${id}`, payload, axiosConfig);
      toast({
        title: 'Success',
        description: 'Test updated',
        status: 'success',
      });
      onEditClose();
      // refresh list
      setFilters((p) => ({ ...p }));
    } catch (err) {
      console.error('update test error', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to update test',
        status: 'error',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddMcq = (test) => {
    const added = Number(test.totalQuestions || 0);
    const limit = Number(test.mcqLimit || 0);

    if (added >= limit) {
      toast({
        title: 'MCQ Limit Reached',
        description: `Is test me already ${added} MCQs hain. Limit ${limit} hai.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    navigate(`/admin/mcq/${test.testMode}`, {
      state: { testId: test._id },
    });
  };

  const handleViewMcqs = (testId) => {
    const targetPath = isQTestListPage
      ? '/admin/mcqs-q-test-list'
      : '/admin/mcqs-test-list';

    navigate(targetPath, {
      state: { testId },
    });
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading size="lg" color="gray.800">
            Test Management
          </Heading>

          <HStack spacing={3} flexWrap="wrap">
            <Select
              placeholder="All Status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value, page: 1 })
              }
              width={{ base: 'full', sm: '160px' }}
              bg="white"
              shadow="sm"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </Select>

            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              colorScheme="blue"
              variant="outline"
              isDisabled
            />
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="60vh">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        ) : (
          <Card shadow="md" borderRadius="lg" overflow="hidden">
            <CardHeader bg="white" py={4}>
              <Heading size="md">All Tests</Heading>
            </CardHeader>
            <CardBody p={0}>
              {tests.length === 0 ? (
                <Flex justify="center" py={10} color="gray.500">
                  No Tests found
                </Flex>
              ) : (
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>Test Title</Th>
                        <Th>Course</Th>
                        <Th>Mode</Th>
                        <Th>MCQs (added / limit)</Th>
                        <Th>Status</Th>
                        <Th>Created</Th>
                        <Th isNumeric>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tests.map((test) => (
                        <Tr key={test._id} _hover={{ bg: 'gray.50' }}>
                          <Td fontWeight="medium">{test.testTitle}</Td>
                          <Td>{coursesMap[test.courseId] || '-'}</Td>

                          <Td>
                            <Tag
                              colorScheme={
                                test.testMode === 'exam' ? 'orange' : 'cyan'
                              }
                              variant="subtle"
                            >
                              {test.testMode}
                            </Tag>
                          </Td>
                          <Td>
                            {Number(test.totalQuestions || 0)} /{' '}
                            {Number(test.mcqLimit || 0)}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                test.status === 'active'
                                  ? 'green'
                                  : test.status === 'draft'
                                    ? 'purple'
                                    : 'gray'
                              }
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              {test.status}
                            </Badge>
                          </Td>
                          <Td>
                            {new Date(test.createdAt).toLocaleDateString()}
                          </Td>
                          <Td isNumeric>
                            <HStack spacing={2} justify="flex-end">
                              <IconButton
                                icon={<ViewIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleViewTest(test._id)}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="purple"
                                onClick={() => handleViewMcqs(test._id)}
                              >
                                View MCQs
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => handleAddMcq(test)}
                                isDisabled={
                                  Number(test.totalQuestions || 0) >=
                                  Number(test.mcqLimit || 0)
                                }
                              >
                                Add MCQ
                              </Button>

                              <IconButton
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="yellow"
                                onClick={() => handleOpenEdit(test)}
                              />
                              <IconButton
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDeleteTest(test._id)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>

            <Flex justify="center" mt={6} p={4}>
              <HStack spacing={4}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.max(1, filters.page - 1),
                    })
                  }
                  isDisabled={filters.page === 1}
                >
                  Previous
                </Button>
                <Text fontWeight="medium">
                  Page {filters.page} of {pagination.pages || 1}
                </Text>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      page: Math.min(pagination.pages, filters.page + 1),
                    })
                  }
                  isDisabled={filters.page >= pagination.pages}
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </Card>
        )}

        {/* View Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
          <ModalOverlay />
          <ModalContent borderRadius="xl">
            <ModalHeader bg="gray.100" borderBottomWidth="1px">
              {selectedTest?.testTitle || 'Test Details'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              {selectedTest && (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <Text fontWeight="bold" color="gray.700">
                      Course
                    </Text>
                    <Text mt={1}>
                      {coursesMap[selectedTest.courseId] || '-'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.700">
                      Mode
                    </Text>
                    <Tag
                      mt={1}
                      colorScheme={
                        selectedTest.testMode === 'exam' ? 'orange' : 'cyan'
                      }
                    >
                      {selectedTest.testMode}
                    </Tag>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.700">
                      Month
                    </Text>
                    <Text mt={1}>{selectedTest.month || '-'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.700">
                      Academic Year
                    </Text>
                    <Text mt={1}>{selectedTest.academicYear || '-'}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" color="gray.700">
                      Questions
                    </Text>
                    <Text mt={1} fontSize="lg" fontWeight="semibold">
                      {selectedTest.totalQuestions ?? 0} /{' '}
                      {selectedTest.mcqLimit ?? '-'}
                    </Text>
                  </Box>
                  {selectedTest.timeLimit && (
                    <Box>
                      <Text fontWeight="bold" color="gray.700">
                        Time Limit
                      </Text>
                      <Text mt={1}>{selectedTest.timeLimit} minutes</Text>
                    </Box>
                  )}
                  {selectedTest.description && (
                    <Box gridColumn="1 / -1">
                      <Text fontWeight="bold" color="gray.700">
                        Description
                      </Text>
                      <Text mt={2} whiteSpace="pre-wrap">
                        {selectedTest.description}
                      </Text>
                    </Box>
                  )}
                </SimpleGrid>
              )}
            </ModalBody>
            <ModalFooter borderTopWidth="1px" bg="gray.50">
              <Button colorScheme="blue" onClick={onViewClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Test</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Test Title</FormLabel>
                  <Input
                    value={editForm.testTitle || ''}
                    onChange={(e) =>
                      handleEditChange('testTitle', e.target.value)
                    }
                  />
                </FormControl>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Month</FormLabel>
                    <Input
                      value={editForm.month || ''}
                      onChange={(e) =>
                        handleEditChange('month', e.target.value)
                      }
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Academic Year</FormLabel>
                    <Input
                      value={editForm.academicYear || ''}
                      onChange={(e) =>
                        handleEditChange('academicYear', e.target.value)
                      }
                    />
                  </FormControl>
                </SimpleGrid>
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel>Mode</FormLabel>
                    <Input value={fixedMode} isReadOnly />
                  </FormControl>

                  <FormControl>
                    <FormLabel>MCQ Limit</FormLabel>
                    <NumberInput
                      min={1}
                      value={editForm.mcqLimit ?? 0}
                      onChange={(val) => handleEditChange('mcqLimit', val)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
                {editForm.testMode === 'exam' && (
                  <FormControl>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <NumberInput
                      min={1}
                      value={editForm.timeLimit ?? ''}
                      onChange={(val) => handleEditChange('timeLimit', val)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={editForm.description || ''}
                    onChange={(e) =>
                      handleEditChange('description', e.target.value)
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={editForm.status || 'draft'}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleUpdateTest}
                isLoading={editLoading}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
