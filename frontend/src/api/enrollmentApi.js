import axiosInstance from './axios';

// Request enrollment in a course
export const requestEnrollment = async (courseId) => {
  try {
    const response = await axiosInstance.post(`/enroll/request/${courseId}`);
    return response.data; // Expected: new enrollment object
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to request enrollment' };
  }
};

// Get the current user's enrollment statuses for all courses they've interacted with
export const getMyEnrollmentStatuses = async () => {
  try {
    const response = await axiosInstance.get('/enroll/my-status');
    // Expected: Array of enrollment objects, populated with courseId { title, description }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch enrollment statuses' };
  }
};
