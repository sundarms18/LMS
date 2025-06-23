import axiosInstance from './axios';

// Toggle the completion status of a content item
export const toggleContentCompletion = async (contentId) => {
  try {
    // Endpoint matches backend: POST /api/progress/content/:contentId/toggle
    const response = await axiosInstance.post(`/progress/content/${contentId}/toggle`);
    // Expected response: the updated UserProgress document { userId, courseId, contentId, completed, lastAccessed }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update content progress' };
  }
};

// Get all progress for the current user for a specific course
export const getCourseProgress = async (courseId) => {
  try {
    // Endpoint matches backend: GET /api/progress/course/:courseId
    const response = await axiosInstance.get(`/progress/course/${courseId}`);
    // Expected response: Array of UserProgress documents for that course by the user
    // e.g., [{ contentId, completed, lastAccessed }, ...]
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch course progress' };
  }
};

// Optional: Get status for a single content item (if needed, though toggle returns current state)
// export const getContentStatus = async (contentId) => {
//   try {
//     // This would require a new backend endpoint e.g., GET /api/progress/content/:contentId/status
//     const response = await axiosInstance.get(`/progress/content/${contentId}/status`);
//     return response.data; // e.g., { completed: true/false } or the full progress record
//   } catch (error) {
//     throw error.response?.data || { message: error.message || 'Failed to fetch content status' };
//   }
// };
