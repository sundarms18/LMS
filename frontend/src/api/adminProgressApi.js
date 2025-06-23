import axiosInstance from './axios';

// Get a specific user's progress for a specific course (admin view)
export const getUserProgressForCourse = async (userId, courseId) => {
  try {
    // Endpoint matches backend: GET /api/admin/progress/user/:userId/course/:courseId
    const response = await axiosInstance.get(`/admin/progress/user/${userId}/course/${courseId}`);
    // Expected: Array of UserProgress documents, with contentId populated { title, type }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || "Failed to fetch user's course progress" };
  }
};

// Get all user progress for a specific course (admin view)
export const getCourseProgressAllUsers = async (courseId) => {
  try {
    // Endpoint matches backend: GET /api/admin/progress/course/:courseId
    const response = await axiosInstance.get(`/admin/progress/course/${courseId}`);
    // Expected: Array of UserProgress documents, with userId {name, email} and contentId {title, type} populated
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch course progress for all users' };
  }
};
