import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Heading,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CreateTest({ mode }) {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subSubjects, setSubSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);

  const [fetchingSubjects, setFetchingSubjects] = useState(false);
  const [fetchingSubSubjects, setFetchingSubSubjects] = useState(false);
  const [fetchingChapters, setFetchingChapters] = useState(false);

  const [errorCourses, setErrorCourses] = useState('');

  const baseUrlRaw = process.env.REACT_APP_BASE_URL || 'http://localhost:4000';
  const baseUrl = baseUrlRaw.endsWith('/')
    ? baseUrlRaw.slice(0, -1)
    : baseUrlRaw;

  const token = localStorage.getItem('token') || '';
  const axiosConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  const queryParams = new URLSearchParams(location.search);
  const queryMode = queryParams.get('mode');
  const defaultMode = queryMode || mode || 'exam';

  const [formData, setFormData] = useState({
    month: '',
    academicYear: '',
    testTitle: '',
    courseId: '',
    subjectId: '',
    subSubjectId: '',
    chapterId: '',
    testMode: defaultMode,
    mcqLimit: '',
    timeLimit: '',
    description: '',
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return `${year}-${year + 1}`;
  });
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryMode = queryParams.get('mode');
    const updatedMode = queryMode || mode || 'exam';

    setFormData((prev) => ({
      ...prev,
      testMode: updatedMode,
    }));
  }, [location.search, mode]);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      setFetchingCourses(true);
      setErrorCourses('');
      try {
        const res = await axios.get(
          `${baseUrl}/api/admin/courses`,
          axiosConfig,
        );
        if (!isMounted) return;
        setCourses(res.data?.data || []);
      } catch (err) {
        console.error('fetchCourses error', err);
        if (!isMounted) return;
        setCourses([]);
        setErrorCourses(
          err?.response?.data?.message || 'Failed to fetch courses',
        );
        toast({
          title: 'Error',
          description:
            err?.response?.data?.message || 'Failed to fetch courses',
          status: 'error',
          isClosable: true,
        });
      } finally {
        if (isMounted) setFetchingCourses(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, [baseUrl, axiosConfig, toast]);

  useEffect(() => {
    if (!formData.courseId || formData.testMode !== 'regular') return;

    const fetchFilters = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/admin/tests/filters/${formData.courseId}`,
          axiosConfig,
        );

        const data = res.data?.data;

        setSubjects(data?.subjects || []);
        setSubSubjects(data?.subSubjects || []);
        setChapters(data?.chapters || []);
      } catch (err) {
        console.error('Filters fetch error:', err);
        setSubjects([]);
        setSubSubjects([]);
        setChapters([]);
      }
    };

    fetchFilters();
  }, [formData.courseId, formData.testMode]);

  const handleInputChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));
  const handleCourseChange = (courseId) =>
    setFormData((p) => ({ ...p, courseId }));

  const handleCreateTest = async () => {
    // client validation
    if (!formData.month || !formData.academicYear || !formData.testTitle) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill Month, Academic Year, and Test Title',
        status: 'error',
      });
      return;
    }
    if (!formData.courseId) {
      toast({
        title: 'Missing Course',
        description: 'Please select a course',
        status: 'error',
      });
      return;
    }
    if (!formData.mcqLimit || parseInt(formData.mcqLimit, 10) < 1) {
      if (formData.testMode === 'regular') {
        if (
          !formData.subjectId ||
          !formData.subSubjectId ||
          !formData.chapterId
        ) {
          toast({
            title: 'Missing Fields',
            description: 'Please select Subject, Sub-Subject and Chapter',
            status: 'error',
          });
          return;
        }
      }

      toast({
        title: 'Invalid MCQ Limit',
        description: 'MCQ Limit must be at least 1',
        status: 'error',
      });
      return;
    }
    if (
      formData.testMode === 'exam' &&
      (!formData.timeLimit || parseInt(formData.timeLimit, 10) < 1)
    ) {
      toast({
        title: 'Missing Time Limit',
        description: 'Time limit required for Exam Mode',
        status: 'error',
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        month: formData.month,
        academicYear: formData.academicYear,
        testTitle: formData.testTitle,
        testMode: formData.testMode,
        courseId: formData.courseId,
        subjectId: formData.testMode === 'regular' ? formData.subjectId : null,
        subSubjectId:
          formData.testMode === 'regular' ? formData.subSubjectId : null,
        chapterId: formData.testMode === 'regular' ? formData.chapterId : null,

        mcqLimit: parseInt(formData.mcqLimit, 10),
        timeLimit:
          formData.testMode === 'exam'
            ? parseInt(formData.timeLimit, 10)
            : null,
        description: formData.description || '',
      };

      const res = await axios.post(
        `${baseUrl}/api/admin/tests/create`,
        payload,
        axiosConfig,
      );

      toast({
        title: 'Success',
        description: res.data?.message || 'Test created successfully!',
        status: 'success',
        duration: 2500,
      });

      // reset & navigate to list
      setFormData({
        month: '',
        academicYear: '',
        testTitle: '',
        courseId: '',
        subjectId: '',
        subSubjectId: '',
        chapterId: '',
        testMode: defaultMode,
        mcqLimit: '',
        timeLimit: '',
        description: '',
      });

      if (formData.testMode === 'exam') {
        navigate('/admin/test-list');
      } else {
        navigate('/admin/q-test-list');
      }
    } catch (err) {
      console.error('create test error', err);
      toast({
        title: 'Error',
        description: err?.response?.data?.message || 'Failed to create test',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6}>
      <Card p={8} maxW="900px" mx="auto">
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            Create New Test
          </Heading>

          <FormControl isRequired>
            <FormLabel>Month</FormLabel>
            <Select
              value={formData.month}
              onChange={(e) => handleInputChange('month', e.target.value)}
              placeholder="Select Month"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Academic Year</FormLabel>
            <Select
              value={formData.academicYear}
              onChange={(e) =>
                handleInputChange('academicYear', e.target.value)
              }
              placeholder="Select Academic Year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Test Title</FormLabel>
            <Input
              value={formData.testTitle}
              onChange={(e) => handleInputChange('testTitle', e.target.value)}
              placeholder="e.g., Physics Full Syllabus Test"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Course</FormLabel>
            {fetchingCourses ? (
              <Spinner />
            ) : errorCourses ? (
              <VStack align="start">
                <Text color="red.500">{errorCourses}</Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </VStack>
            ) : (
              <Select
                value={formData.courseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                placeholder="Select Course"
              >
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </FormControl>
          {formData.testMode === 'regular' && (
            <>
              <FormControl isRequired>
                <FormLabel>Subject</FormLabel>
                <Select
                  value={formData.subjectId}
                  onChange={(e) =>
                    handleInputChange('subjectId', e.target.value)
                  }
                  placeholder="Select Subject"
                >
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sub-Subject</FormLabel>
                <Select
                  value={formData.subSubjectId}
                  onChange={(e) =>
                    handleInputChange('subSubjectId', e.target.value)
                  }
                  placeholder="Select Sub-Subject"
                >
                  {subSubjects
                    .filter(
                      (ss) =>
                        String(ss.subjectId) === String(formData.subjectId),
                    )

                    .map((ss) => (
                      <option key={ss._id} value={ss._id}>
                        {ss.name}
                      </option>
                    ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Chapter</FormLabel>
                <Select
                  value={formData.chapterId}
                  onChange={(e) =>
                    handleInputChange('chapterId', e.target.value)
                  }
                  placeholder="Select Chapter"
                >
                  {chapters
                    .filter(
                      (c) =>
                        String(c.subSubjectId) ===
                        String(formData.subSubjectId),
                    )
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </>
          )}

          <FormControl isRequired>
            <FormLabel>MCQ Limit</FormLabel>
            <Input
              type="number"
              min="1"
              value={formData.mcqLimit}
              onChange={(e) => handleInputChange('mcqLimit', e.target.value)}
              placeholder="e.g., 50"
            />
          </FormControl>

          {formData.testMode === 'exam' && (
            <FormControl isRequired>
              <FormLabel>Time Limit (Minutes)</FormLabel>
              <Input
                type="number"
                min="1"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                placeholder="e.g., 60"
              />
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Description (Optional)</FormLabel>
            <Input
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Optional description"
            />
          </FormControl>

          <Button
            colorScheme="green"
            size="lg"
            onClick={handleCreateTest}
            isLoading={loading}
            width="100%"
          >
            Create Test
          </Button>
        </VStack>
      </Card>
    </Box>
  );
}
