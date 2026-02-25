'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Heading,
  useColorModeValue,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  VStack,
  HStack,
  Icon,
  Spinner,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { MdCheckCircle, MdSchool, MdOutlineQuiz } from 'react-icons/md';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MCQList({ mode = 'all' }) {
  const bgCard = useColorModeValue('white', 'gray.800');
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const secondaryText = useColorModeValue('gray.600', 'gray.400');
  const accentColor = useColorModeValue('purple.600', 'purple.300');
  const headerBg = useColorModeValue('purple.50', 'gray.800');
  const correctOptionBgColor = useColorModeValue('green.50', 'green.900');
  const tableBg = useColorModeValue('gray.100', 'gray.700');

  const rawBaseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:4000';
  const baseUrl = rawBaseUrl.endsWith('/')
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

  const token = localStorage.getItem('token') || '';
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  const [testsWithMcqs, setTestsWithMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTestId, setExpandedTestId] = useState(null);
  const [expandedChapterKey, setExpandedChapterKey] = useState(null);
  const [selectedMcq, setSelectedMcq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // 🔧 CHANGE 1 — safer testId
  const testIdFromList = useMemo(() => {
    return location.state?.testId ?? null;
  }, [location.state]);

  // 🔧 CHANGE 2 — include mode + testId deps
  const fetchMcqsTestWise = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${baseUrl}/api/admin/mcqs`;

      /**
       * STRICT FILTERING LOGIC FOR MCQ LISTING
       *
       * Mode 'manual': testId=null → Only manual MCQs
       * Mode 'exam': testMode=exam → Only exam-mode test MCQs
       * Mode 'regular': testMode=regular → Only Q-Test regular-mode MCQs
       * testIdFromList: ?testId={id} → Only specific test's MCQs
       *
       * ⚠️ CRITICAL: Different MCQ types must NEVER mix
       */

      if (mode === 'manual') {
        // Manual MCQs only (no test association)
        url += `?testId=null`;
      } else if (testIdFromList) {
        // Specific test's MCQs only
        url += `?testId=${testIdFromList}`;
      } else if (mode === 'exam') {
        // Exam mode tests only - NO manual MCQs, NO regular mode MCQs
        url += `?testMode=exam`;
      } else if (mode === 'regular') {
        // Q-Test (regular mode) only - NO manual MCQs, NO exam mode MCQs
        url += `?testMode=regular`;
      }

      console.log('Fetching MCQ URL:', url);
      const res = await axios.get(url, axiosConfig);
      const data = res.data?.data ?? [];

      if (res.data?.format === 'test-wise-grouped' && Array.isArray(data)) {
        setTestsWithMcqs(data);

        if (data.length === 1) {
          setExpandedTestId(data[0].testId ?? 'manual');
        }
      } else {
        setTestsWithMcqs([]);
      }
    } catch (err) {
      console.error('Failed to fetch MCQs:', err);
      setTestsWithMcqs([]);
      setError(
        err?.response?.data?.message ||
          'Failed to fetch MCQs. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [baseUrl, axiosConfig, testIdFromList, mode]);

  // 🔧 CHANGE 3 — refetch on route change
  useEffect(() => {
    setExpandedTestId(null);
    setExpandedChapterKey(null);
    setTestsWithMcqs([]);
    fetchMcqsTestWise();
  }, [location.key, fetchMcqsTestWise]);

  const getDifficultyColor = (diff) => {
    if (diff === 'easy') return 'green';
    if (diff === 'medium') return 'yellow';
    if (diff === 'hard') return 'red';
    return 'gray';
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}/${cleanPath}`;
  };

  const openModal = (mcq) => {
    setSelectedMcq(mcq);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMcq(null);
    setIsModalOpen(false);
  };

  // Helper function to group MCQs by Subject -> SubSubject -> Topic -> Chapter
  // Subject → SubSubject → Chapter → Topic
  const groupByHierarchy = useMemo(
    () => (mcqList) => {
      return mcqList.reduce((acc, mcq) => {
        const subject = mcq.subjectId?.name || 'Uncategorized';
        const subSubject = mcq.subSubjectId?.name || 'General';
        const chapter = mcq.chapterId?.name || 'No Chapter';
        const topic = mcq.topicId?.name || 'Miscellaneous';

        if (!acc[subject]) acc[subject] = {};
        if (!acc[subject][subSubject]) acc[subject][subSubject] = {};
        if (!acc[subject][subSubject][chapter])
          acc[subject][subSubject][chapter] = {};
        if (!acc[subject][subSubject][chapter][topic])
          acc[subject][subSubject][chapter][topic] = [];

        acc[subject][subSubject][chapter][topic].push(mcq);
        return acc;
      }, {});
    },
    [],
  );

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.900')}
      pt={{ base: '90px', md: '100px' }}
      pb="12"
      px={{ base: '4', md: '6', lg: '8' }}
    >
      <Button
        size="sm"
        variant="outline"
        colorScheme="blue"
        mb={4}
        alignSelf="flex-start"
        onClick={() => {
          if (mode === 'regular') {
            navigate('/admin/q-test-list');
          } else if (mode === 'exam') {
            navigate('/admin/test-list');
          } else {
            navigate('/admin/dashboard'); // ya manual route
          }
        }}
      >
        ← Back to Tests
      </Button>

      <Card
        bg={bgCard}
        shadow="2xl"
        borderRadius="2xl"
        overflow="hidden"
        border="1px solid"
        borderColor={borderColor}
        maxW="1400px"
        mx="auto"
      >
        <CardHeader bg={headerBg} py={6} px={8}>
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={MdOutlineQuiz} boxSize={7} color={accentColor} />
              <Heading size="lg" color={accentColor}>
                {mode === 'manual'
                  ? 'Manual MCQ Repository'
                  : mode === 'regular'
                    ? 'Q-Test MCQ Repository'
                    : 'Exam Test MCQ Repository'}
              </Heading>
            </HStack>
            <Badge fontSize="md" colorScheme="purple" px={4} py={1}>
              {testsWithMcqs.reduce((sum, test) => sum + test.totalMCQs, 0)}{' '}
              Questions
            </Badge>
          </HStack>
        </CardHeader>

        <CardBody p={{ base: 5, md: 8 }}>
          {loading ? (
            <Flex justify="center" align="center" minH="60vh">
              <VStack spacing={4}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color={accentColor}
                  size="xl"
                />
                <Text color={secondaryText}>Loading questions...</Text>
              </VStack>
            </Flex>
          ) : error ? (
            <Flex
              justify="center"
              align="center"
              minH="50vh"
              direction="column"
              gap={4}
            >
              <Text fontSize="lg" color="red.400">
                {error}
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={fetchMcqsTestWise}
              >
                Retry
              </Button>
            </Flex>
          ) : testsWithMcqs.length === 0 ? (
            <Flex
              justify="center"
              align="center"
              minH="50vh"
              direction="column"
              gap={4}
            >
              <Icon as={MdOutlineQuiz} boxSize={16} color="gray.400" />
              <Text fontSize="xl" color={secondaryText}>
                {testIdFromList
                  ? 'No MCQs found for this test'
                  : 'No tests with MCQs found'}
              </Text>
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={() =>
                  navigate(
                    mode === 'regular'
                      ? '/admin/q-test-list'
                      : '/admin/test-list',
                  )
                }
              >
                Back to Tests
              </Button>
            </Flex>
          ) : (
            testsWithMcqs.map((testGroup) => {
              const testKey = testGroup.testId ?? 'manual';
              return (
                <Box key={testKey} mb={10}>
                  {/* Test section header */}
                  <Box
                    p={5}
                    bg={headerBg}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={accentColor}
                    mb={6}
                    cursor="pointer"
                    onClick={() =>
                      setExpandedTestId(
                        expandedTestId === testKey ? null : testKey,
                      )
                    }
                    _hover={{ boxShadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between" align="center">
                      <HStack spacing={4}>
                        <Icon
                          as={MdOutlineQuiz}
                          boxSize={8}
                          color={accentColor}
                        />
                        <VStack align="start" spacing={0}>
                          <HStack>
                            <Heading size="md" color={accentColor}>
                              {testGroup.testName}
                            </Heading>

                            {(testGroup.testId === null ||
                              testKey === 'manual') && (
                              <Badge colorScheme="purple" variant="solid">
                                Manual
                              </Badge>
                            )}
                          </HStack>

                          <Text fontSize="sm" color={secondaryText}>
                            Click to expand/collapse
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge
                        fontSize="lg"
                        colorScheme="purple"
                        px={4}
                        py={2}
                        borderRadius="full"
                      >
                        {testGroup.totalMCQs} MCQs
                      </Badge>
                    </HStack>
                  </Box>

                  {expandedTestId === testKey && (
                    <VStack spacing={8} align="stretch" pl={{ base: 0, md: 4 }}>
                      {testGroup.totalMCQs === 0 ? (
                        <Box
                          p={8}
                          textAlign="center"
                          border="1px dashed"
                          borderColor={borderColor}
                          borderRadius="lg"
                        >
                          <Text color={secondaryText} fontSize="lg">
                            No MCQs found for this test
                          </Text>
                        </Box>
                      ) : (
                        Object.entries(groupByHierarchy(testGroup.mcqList)).map(
                          ([subject, subSubjects]) => (
                            <Box key={subject}>
                              <HStack mb={4}>
                                <Icon
                                  as={MdSchool}
                                  boxSize={6}
                                  color={accentColor}
                                />
                                <Heading size="md" color={accentColor}>
                                  {subject}
                                </Heading>
                              </HStack>
                              <Box
                                border="1px solid"
                                borderColor={borderColor}
                                borderRadius="xl"
                                overflow="hidden"
                                boxShadow="sm"
                              >
                                <Table variant="simple" size="md">
                                  <Thead bg={tableBg}>
                                    <Tr>
                                      <Th>Sub Subject</Th>
                                      <Th>Chapter</Th>
                                      <Th>Topic</Th>
                                      <Th>Tags</Th>
                                      <Th>Total Questions</Th>
                                      <Th>Action</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {Object.entries(subSubjects).flatMap(
                                      ([subSubject, chapters]) =>
                                        Object.entries(chapters).flatMap(
                                          ([chapter, topics]) =>
                                            Object.entries(topics).map(
                                              ([topic, items]) => {
                                                const chapterKey = `${subject}-${subSubject}-${chapter}-${topic}`;
                                                const tags = Array.from(
                                                  new Set(
                                                    items.flatMap(
                                                      (m) => m.tags || [],
                                                    ),
                                                  ),
                                                );

                                                return (
                                                  <React.Fragment
                                                    key={chapterKey}
                                                  >
                                                    <Tr
                                                      _hover={{ bg: bgHover }}
                                                    >
                                                      <Td fontWeight="medium">
                                                        {subSubject}
                                                      </Td>

                                                      {/* ✅ Chapter first */}
                                                      <Td>{chapter}</Td>

                                                      {/* ✅ Topic after Chapter */}
                                                      <Td>{topic}</Td>

                                                      <Td>
                                                        <Wrap>
                                                          {tags.length > 0 ? (
                                                            tags.map(
                                                              (tag, i) => (
                                                                <WrapItem
                                                                  key={i}
                                                                >
                                                                  <Badge
                                                                    colorScheme="teal"
                                                                    variant="subtle"
                                                                    px={2}
                                                                  >
                                                                    {tag}
                                                                  </Badge>
                                                                </WrapItem>
                                                              ),
                                                            )
                                                          ) : (
                                                            <Text
                                                              fontSize="sm"
                                                              color={
                                                                secondaryText
                                                              }
                                                            >
                                                              —
                                                            </Text>
                                                          )}
                                                        </Wrap>
                                                      </Td>

                                                      <Td>
                                                        <Badge
                                                          colorScheme="purple"
                                                          borderRadius="full"
                                                          px={3}
                                                        >
                                                          {items.length}
                                                        </Badge>
                                                      </Td>

                                                      <Td>
                                                        <Button
                                                          size="sm"
                                                          colorScheme="blue"
                                                          variant="outline"
                                                          borderRadius="full"
                                                          onClick={() =>
                                                            setExpandedChapterKey(
                                                              expandedChapterKey ===
                                                                chapterKey
                                                                ? null
                                                                : chapterKey,
                                                            )
                                                          }
                                                        >
                                                          {expandedChapterKey ===
                                                          chapterKey
                                                            ? 'Hide'
                                                            : 'View Questions'}
                                                        </Button>
                                                      </Td>
                                                    </Tr>

                                                    {expandedChapterKey ===
                                                      chapterKey && (
                                                      <Tr>
                                                        <Td colSpan={6} p={4}>
                                                          <Box
                                                            border="1px solid"
                                                            borderColor={
                                                              borderColor
                                                            }
                                                            borderRadius="xl"
                                                            overflow="hidden"
                                                            boxShadow="sm"
                                                          >
                                                            <Table
                                                              variant="simple"
                                                              size="sm"
                                                            >
                                                              <Thead
                                                                bg={tableBg}
                                                              >
                                                                <Tr>
                                                                  <Th>
                                                                    Question
                                                                  </Th>
                                                                  <Th>
                                                                    Correct
                                                                    Answer
                                                                  </Th>
                                                                  <Th>
                                                                    Difficulty
                                                                  </Th>
                                                                  <Th>Tags</Th>
                                                                  <Th>View</Th>
                                                                  <Th>Edit</Th>
                                                                </Tr>
                                                              </Thead>
                                                              <Tbody>
                                                                {items.map(
                                                                  (mcq) => (
                                                                    <Tr
                                                                      key={
                                                                        mcq._id
                                                                      }
                                                                      _hover={{
                                                                        bg: bgHover,
                                                                      }}
                                                                    >
                                                                      <Td maxW="420px">
                                                                        <Text
                                                                          noOfLines={
                                                                            2
                                                                          }
                                                                        >
                                                                          {mcq
                                                                            .question
                                                                            ?.text ||
                                                                            '—'}
                                                                        </Text>
                                                                      </Td>

                                                                      <Td
                                                                        color="green.600"
                                                                        fontWeight="semibold"
                                                                      >
                                                                        {mcq
                                                                          .options?.[
                                                                          mcq
                                                                            .correctAnswer
                                                                        ]
                                                                          ?.text ||
                                                                          '—'}
                                                                      </Td>

                                                                      <Td>
                                                                        <Badge
                                                                          colorScheme={getDifficultyColor(
                                                                            mcq.difficulty,
                                                                          )}
                                                                          px={3}
                                                                        >
                                                                          {
                                                                            mcq.difficulty
                                                                          }
                                                                        </Badge>
                                                                      </Td>

                                                                      <Td>
                                                                        <Wrap>
                                                                          {(
                                                                            mcq.tags ||
                                                                            []
                                                                          ).map(
                                                                            (
                                                                              tag,
                                                                              i,
                                                                            ) => (
                                                                              <WrapItem
                                                                                key={
                                                                                  i
                                                                                }
                                                                              >
                                                                                <Badge
                                                                                  colorScheme="teal"
                                                                                  variant="subtle"
                                                                                  px={
                                                                                    2
                                                                                  }
                                                                                >
                                                                                  {
                                                                                    tag
                                                                                  }
                                                                                </Badge>
                                                                              </WrapItem>
                                                                            ),
                                                                          )}
                                                                        </Wrap>
                                                                      </Td>

                                                                      <Td>
                                                                        <Button
                                                                          size="sm"
                                                                          colorScheme="blue"
                                                                          borderRadius="full"
                                                                          onClick={() =>
                                                                            openModal(
                                                                              mcq,
                                                                            )
                                                                          }
                                                                        >
                                                                          View
                                                                        </Button>
                                                                      </Td>

                                                                      <Td>
                                                                        <Button
                                                                          size="sm"
                                                                          colorScheme="orange"
                                                                          borderRadius="full"
                                                                          onClick={() =>
                                                                            navigate(
                                                                              `/admin/mcq/${mcq.testMode || 'manual'}`,
                                                                              {
                                                                                state:
                                                                                  {
                                                                                    editMcq:
                                                                                      mcq,
                                                                                    mode: 'edit',
                                                                                  },
                                                                              },
                                                                            )
                                                                          }
                                                                        >
                                                                          Edit
                                                                        </Button>
                                                                      </Td>
                                                                    </Tr>
                                                                  ),
                                                                )}
                                                              </Tbody>
                                                            </Table>
                                                          </Box>
                                                        </Td>
                                                      </Tr>
                                                    )}
                                                  </React.Fragment>
                                                );
                                              },
                                            ),
                                        ),
                                    )}
                                  </Tbody>
                                </Table>
                              </Box>
                            </Box>
                          ),
                        )
                      )}
                    </VStack>
                  )}
                </Box>
              );
            })
          )}
        </CardBody>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Question Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedMcq && (
              <VStack align="stretch" spacing={5}>
                <Box>
                  <Heading size="sm" mb={2}>
                    Question
                  </Heading>
                  <Text>{selectedMcq.question?.text}</Text>
                  {selectedMcq.question?.images?.map((img, i) => (
                    <Image
                      key={i}
                      src={getImageUrl(img)}
                      maxH="220px"
                      mt={3}
                      borderRadius="lg"
                      objectFit="contain"
                    />
                  ))}
                </Box>

                <Box>
                  <Heading size="sm" mb={3}>
                    Options
                  </Heading>
                  <VStack spacing={3} align="stretch">
                    {selectedMcq.options?.map((opt, i) => (
                      <Box
                        key={i}
                        p={4}
                        borderRadius="lg"
                        border="2px solid"
                        borderColor={
                          selectedMcq.correctAnswer === i
                            ? 'green.400'
                            : borderColor
                        }
                        bg={
                          selectedMcq.correctAnswer === i
                            ? correctOptionBgColor
                            : 'transparent'
                        }
                      >
                        <HStack align="start" gap={4}>
                          <Text fontWeight="bold">
                            {String.fromCharCode(65 + i)}.
                          </Text>
                          <Box flex={1}>
                            <Text>{opt.text}</Text>
                            {opt.image && (
                              <Image
                                src={getImageUrl(opt.image)}
                                maxH="140px"
                                mt={3}
                                borderRadius="md"
                                objectFit="contain"
                              />
                            )}
                          </Box>
                          {selectedMcq.correctAnswer === i && (
                            <Icon
                              as={MdCheckCircle}
                              boxSize={6}
                              color="green.500"
                            />
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>

                {(selectedMcq.explanation?.text ||
                  selectedMcq.explanation?.images?.length > 0) && (
                  <Box>
                    <Divider my={4} />
                    <Heading size="sm" mb={3} color={accentColor}>
                      Explanation
                    </Heading>
                    {selectedMcq.explanation?.text && (
                      <Box
                        dangerouslySetInnerHTML={{
                          __html: selectedMcq.explanation.text,
                        }}
                      />
                    )}
                    {selectedMcq.explanation?.images?.map((img, i) => (
                      <Image
                        key={i}
                        src={getImageUrl(img)}
                        maxH="240px"
                        mt={4}
                        borderRadius="lg"
                        objectFit="contain"
                      />
                    ))}
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
