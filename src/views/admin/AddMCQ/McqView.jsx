import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Image, Spinner, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';

const McqView = () => {
  const { mcqId } = useParams();

  const [mcq, setMcq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:4000';

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const cleanPath = path.startsWith('/') ? path : '/' + path;

    return `${cleanBase}${cleanPath}`;
  };

  useEffect(() => {
    const fetchMcq = async () => {
      try {
        setLoading(true);
        setError('');

        // 🔥 IMPORTANT: same key jo login me save hota hai
        const token =
          localStorage.getItem('token') || localStorage.getItem('adminToken');

        if (!token) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`${baseUrl}api/admin/mcqs/${mcqId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.data?.data) {
          throw new Error('Invalid API response');
        }

        setMcq(res.data.data);
      } catch (err) {
        console.error('MCQ load failed:', err);

        const msg =
          err.response?.data?.message || err.message || 'Failed to load MCQ';

        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (mcqId) fetchMcq();
  }, [mcqId]);

  if (loading) {
    return (
      <Box p="8" textAlign="center">
        <Spinner size="xl" />
        <Text mt="3">Loading MCQ...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="8">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!mcq) {
    return (
      <Box p="8">
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          MCQ not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="flex-start"
      justifyContent="center"
      pt="120px"
      px="4"
      bg="gray.50"
    >
      <Box
        w="full"
        maxW="900px"
        bg="white"
        borderRadius="16px"
        boxShadow="lg"
        p={{ base: 5, md: 8 }}
      >
        {/* Header */}
        <Box mb="6" pb="4" borderBottom="1px solid" borderColor="gray.200">
          <Text fontSize="2xl" fontWeight="800" color="gray.800">
            MCQ Preview
          </Text>
          <Text fontSize="sm" color="gray.500">
            Review question, options and explanation
          </Text>
        </Box>

        {/* Question */}
        <Box mb="6">
          <Text fontSize="lg" fontWeight="700" color="gray.700" mb="3">
            Question
          </Text>

          <Box
            p="4"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="12px"
            bg="gray.50"
          >
            <Text fontSize="md" fontWeight="600" color="gray.800">
              {mcq.question?.text || '—'}
            </Text>
          </Box>

          {mcq.question?.images?.length > 0 && (
            <Box
              mt="4"
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
              gap="4"
            >
              {mcq.question.images.map((img, i) => (
                <Image
                  key={i}
                  src={getImageUrl(img)}
                  borderRadius="12px"
                  objectFit="contain"
                  border="1px solid"
                  borderColor="gray.200"
                  p="2"
                  bg="white"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Options */}
        <Box mb="8">
          <Text fontSize="lg" fontWeight="700" color="gray.700" mb="3">
            Options
          </Text>

          <Box
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gap="4"
          >
            {mcq.options?.map((opt, i) => {
              const isCorrect = mcq.correctAnswer === i;

              return (
                <Box
                  key={i}
                  p="4"
                  borderRadius="14px"
                  border="2px solid"
                  borderColor={isCorrect ? 'green.400' : 'gray.200'}
                  bg={isCorrect ? 'green.50' : 'white'}
                  boxShadow={isCorrect ? 'md' : 'sm'}
                  transition="all 0.2s ease"
                >
                  <Text
                    fontWeight="700"
                    mb="2"
                    color={isCorrect ? 'green.700' : 'gray.700'}
                  >
                    {String.fromCharCode(65 + i)}. {opt.text || '—'}
                  </Text>

                  {opt.image && (
                    <Image
                      src={getImageUrl(opt.image)}
                      mt="2"
                      maxH="150px"
                      objectFit="contain"
                      borderRadius="10px"
                      border="1px solid"
                      borderColor="gray.200"
                      bg="gray.50"
                      p="2"
                    />
                  )}

                  {isCorrect && (
                    <Box mt="3">
                      <Text
                        display="inline-block"
                        px="3"
                        py="1"
                        fontSize="xs"
                        borderRadius="full"
                        bg="green.500"
                        color="white"
                        fontWeight="700"
                      >
                        ✔ Correct Answer
                      </Text>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Explanation */}
        <Box>
          <Text fontSize="lg" fontWeight="700" color="gray.700" mb="3">
            Explanation
          </Text>

          <Box
            p="4"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="14px"
            bg="gray.50"
          >
            {mcq.explanation?.text ? (
              <Box
                className="ql-editor"
                dangerouslySetInnerHTML={{
                  __html: mcq.explanation.text,
                }}
              />
            ) : (
              <Text color="gray.500">No explanation provided</Text>
            )}
          </Box>

          {mcq.explanation?.images?.length > 0 && (
            <Box
              mt="4"
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(180px, 1fr))"
              gap="4"
            >
              {mcq.explanation.images.map((img, i) => (
                <Image
                  key={i}
                  src={getImageUrl(img)}
                  borderRadius="12px"
                  objectFit="contain"
                  border="1px solid"
                  borderColor="gray.200"
                  p="2"
                  bg="white"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default McqView;
