import axiosInstance from './axios';

// Get all published courses for general users
export const getPublishedCourses = async () => {
  try {
    const response = await axiosInstance.get('/courses/courses'); // Endpoint matches backend /api/courses/courses
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch published courses' };
  }
};

// Get a single course's details for an enrolled/general user
export const getCourseForUser = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/courses/courses/${courseId}`); // Endpoint matches backend /api/courses/courses/:courseId
    return response.data; // Expects course details with modules and content (titles, types, IDs)
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch course details' };
  }
};

// Get a specific content item's details for a user
export const getContentForUser = async (contentId) => {
  try {
    const response = await axiosInstance.get(`/courses/content/${contentId}`); // Endpoint matches backend /api/courses/content/:contentId
    return response.data; // Expects content details (title, type, url/text_content)
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch content' };
  }
};

// Get all courses a user is currently enrolled in and approved for
export const getMyEnrolledCourses = async () => {
  try {
    // This matches the backend route GET /api/courses/my-enrolled-courses
    const response = await axiosInstance.get('/courses/my-enrolled-courses');
    return response.data; // Expects an array of fully populated course objects
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch enrolled courses' };
  }
};
