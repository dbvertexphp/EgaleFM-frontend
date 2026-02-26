import React, { useEffect, useMemo, useState } from 'react';
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
  Button,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Select,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Divider,
  Stack,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import axios from 'axios';
import Card from 'components/card/Card';
import { CheckCircleIcon, WarningIcon, TimeIcon } from '@chakra-ui/icons';

export default function StoryManagement() {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const hoveredBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  const baseUrl = process.env.REACT_APP_BASE_URL?.replace(/\/$/, '');
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token],
  );

  // =============================
  // FETCH ALL USERS WITH STORY COUNT
  // =============================
  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${baseUrl}/api/admin/users-with-stories`, {
        headers,
      });

      if (res.data?.success) {
        setUsers(res.data.data || []);
      } else {
        throw new Error(res.data?.message || 'Failed to fetch users');
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to load users';

      toast({
        title: 'Error loading users',
        description: errorMsg,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [headers]);

  // =============================
  // FETCH STORIES OF SELECTED USER
  // =============================
  const fetchUserStories = async (userId) => {
    setModalLoading(true);

    try {
      const res = await axios.get(
        `${baseUrl}/api/admin/user-stories/by-user/${userId}`,
        { headers },
      );

      if (res.data?.success) {
        setStories(res.data.data || []);
      } else {
        throw new Error(res.data?.message || 'Failed to fetch stories');
      }
    } catch (err) {
      toast({
        title: 'Error loading stories',
        description:
          err.response?.data?.message ||
          err.message ||
          'Failed to load stories',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });

      setStories([]);
    } finally {
      setModalLoading(false);
    }
  };

  // =============================
  // OPEN MODAL
  // =============================
  const handleViewStories = (user) => {
    setSelectedUser(user);
    fetchUserStories(user._id);
    onOpen();
  };

  // =============================
  // UPDATE STORY STATUS
  // =============================
  const updateStatus = async (storyId, newStatus) => {
    try {
      setUpdatingId(storyId);

      const res = await axios.patch(
        `${baseUrl}/api/admin/user-stories/${storyId}/status`,
        { status: newStatus },
        { headers },
      );

      if (res.data?.success) {
        setStories((prev) =>
          prev.map((s) =>
            s._id === storyId ? { ...s, status: newStatus } : s,
          ),
        );

        toast({
          title: 'Status updated successfully',
          status: 'success',
        });
      }
    } catch (err) {
      toast({
        title: 'Error updating status',
        description:
          err.response?.data?.message || err.message || 'Update failed',
        status: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const getColor = (status) => {
    if (status === 'approved') return 'green';
    if (status === 'rejected') return 'red';
    return 'yellow';
  };

  const getStatusIcon = (status) => {
    if (status === 'approved') return <CheckCircleIcon />;
    if (status === 'rejected') return <WarningIcon />;
    return <TimeIcon />;
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // =============================
  // UI
  // =============================
  return (
    <Card p="25px" mt="80px">
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="22px" fontWeight="700" color={textColor}>
          Story Management
        </Text>
        <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
          {users.length} Users
        </Badge>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="400px">
          <VStack spacing={4}>
            <Spinner size="lg" thickness="4px" color="blue.500" />
            <Text color={textColor}>Loading users...</Text>
          </VStack>
        </Flex>
      ) : users.length === 0 ? (
        <Flex justify="center" align="center" minH="400px">
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="500" color={textColor}>
              No users found
            </Text>
            <Text fontSize="sm" color="gray.500">
              No users have posted stories yet
            </Text>
          </VStack>
        </Flex>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr borderBottom={`2px solid ${borderColor}`}>
                <Th color={textColor} fontWeight="700" fontSize="12px">
                  USER NAME
                </Th>
                <Th color={textColor} fontWeight="700" fontSize="12px">
                  EMAIL
                </Th>
                <Th
                  color={textColor}
                  fontWeight="700"
                  fontSize="12px"
                  isNumeric
                >
                  STORIES
                </Th>
                <Th
                  color={textColor}
                  fontWeight="700"
                  fontSize="12px"
                  textAlign="center"
                >
                  ACTION
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {users.map((user) => (
                <Tr
                  key={user._id}
                  borderBottom={`1px solid ${borderColor}`}
                  _hover={{ bg: hoveredBg }}
                  transition="background-color 0.2s"
                >
                  <Td>
                    <Text fontSize="14px" fontWeight="600" color={textColor}>
                      {user.name}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="14px" color={textColor}>
                      {user.email}
                    </Text>
                  </Td>
                  <Td isNumeric>
                    <Badge
                      colorScheme="purple"
                      variant="subtle"
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="13px"
                      fontWeight="600"
                    >
                      {user.storyCount || 0}
                    </Badge>
                  </Td>
                  <Td textAlign="center">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      fontSize="12px"
                      fontWeight="600"
                      onClick={() => handleViewStories(user)}
                      _hover={{ bg: 'blue.50' }}
                    >
                      View Stories
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {/* ================= MODAL FOR STORIES ================= */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(6px)" />

        <ModalContent borderRadius="xl">
          {/* ================= HEADER ================= */}
          <ModalHeader borderBottom={`1px solid ${borderColor}`} py={5}>
            <VStack align="flex-start" spacing={1}>
              <Text fontSize="20px" fontWeight="800" color={textColor}>
                {selectedUser?.name}
              </Text>
              <Text fontSize="13px" color="gray.500">
                {selectedUser?.email}
              </Text>

              <Badge
                colorScheme="blue"
                mt={2}
                px={3}
                py={1}
                borderRadius="full"
              >
                {stories.length} {stories.length === 1 ? 'Story' : 'Stories'}
              </Badge>
            </VStack>
          </ModalHeader>

          <ModalCloseButton />

          {/* ================= BODY ================= */}
          <ModalBody py={6}>
            {modalLoading ? (
              <Flex justify="center" align="center" minH="300px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : stories.length === 0 ? (
              <Flex justify="center" align="center" minH="200px">
                <Text color="gray.500">No stories found</Text>
              </Flex>
            ) : (
              <VStack spacing={6} align="stretch">
                {stories.map((story, index) => (
                  <Box
                    key={story._id}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    p={5}
                    bg={hoveredBg}
                    transition="all .2s"
                    _hover={{ shadow: 'lg', borderColor: 'blue.400' }}
                  >
                    {/* ===== TOP ROW ===== */}
                    <Flex justify="space-between" align="flex-start" mb={3}>
                      <VStack align="flex-start" spacing={1}>
                        <Text fontSize="15px" color="gray.500" fontWeight="600">
                          Story #{index + 1}
                        </Text>

                        <Text
                          fontSize="18px"
                          fontWeight="700"
                          color={textColor}
                        >
                          {story.title}
                        </Text>
                      </VStack>

                      {/* STATUS BADGE */}
                      <Badge
                        colorScheme={getColor(story.status)}
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Icon boxSize={3}>{getStatusIcon(story.status)}</Icon>
                        {getStatusLabel(story.status)}
                      </Badge>
                    </Flex>

                    {/* ===== META INFO ===== */}
                    <Flex
                      gap={6}
                      wrap="wrap"
                      fontSize="13px"
                      color="gray.500"
                      mb={4}
                    >
                      {story.category && (
                        <HStack>
                          <Text fontWeight="600">Category:</Text>
                          <Badge colorScheme="cyan" variant="subtle">
                            {story.category?.name}
                          </Badge>
                        </HStack>
                      )}

                      {story.createdAt && (
                        <HStack>
                          <Text fontWeight="600">Posted:</Text>
                          <Text>
                            {new Date(story.createdAt).toLocaleDateString()}
                          </Text>
                        </HStack>
                      )}
                    </Flex>

                    <Divider mb={4} />

                    {/* ===== ACTION SECTION ===== */}
                    <Box>
                      <Text
                        fontSize="13px"
                        fontWeight="700"
                        mb={2}
                        color={textColor}
                      >
                        Update Status
                      </Text>

                      <Select
                        size="sm"
                        maxW="240px"
                        value={story.status}
                        isDisabled={updatingId === story._id}
                        onChange={(e) =>
                          updateStatus(story._id, e.target.value)
                        }
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="approved">✅ Approved</option>
                        <option value="rejected">❌ Rejected</option>
                      </Select>

                      {updatingId === story._id && (
                        <HStack mt={2}>
                          <Spinner size="sm" />
                          <Text fontSize="12px" color="gray.500">
                            Updating...
                          </Text>
                        </HStack>
                      )}
                    </Box>
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>

          {/* ================= FOOTER ================== */}
          <ModalFooter borderTop={`1px solid ${borderColor}`}>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
}
