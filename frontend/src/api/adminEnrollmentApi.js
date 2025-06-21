import axiosInstance from './axios';

// Get all pending enrollment requests
export const getPendingEnrollments = async () => {
  try {
    const response = await axiosInstance.get('/admin/enrollments/pending');
    // Expected: Array of enrollment objects, populated with userId {name, email} and courseId {title}
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch pending enrollments' };
  }
};

// Get all enrollment requests (regardless of status)
export const getAllEnrollments = async () => {
  try {
    const response = await axiosInstance.get('/admin/enrollments'); // Matches the new backend route GET /api/admin/enrollments
    // Expected: Array of enrollment objects, populated with userId {name, email} and courseId {title}
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch all enrollments' };
  }
};

// Approve an enrollment request
export const approveEnrollment = async (enrollmentId) => {
  try {
    const response = await axiosInstance.patch(`/admin/enrollments/${enrollmentId}/approve`);
    return response.data; // Expected: updated enrollment object
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to approve enrollment' };
  }
};

// Reject an enrollment request
export const rejectEnrollment = async (enrollmentId) => {
  try {
    const response = await axiosInstance.patch(`/admin/enrollments/${enrollmentId}/reject`);
    return response.data; // Expected: updated enrollment object
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to reject enrollment' };
  }
};

// Note: Functions for fetching enrollments by courseId or userId for admin view
// (GET /api/admin/enrollments/course/:courseId and GET /api/admin/enrollments/user/:userId)
// can be added here if a specific UI element needs them. For now, getAllEnrollments
// combined with frontend filtering might suffice for the initial "All Enrollments" tab.
// Example:
// export const getEnrollmentsForCourseAdmin = async (courseId) => {
//   try {
//     const response = await axiosInstance.get(`/admin/enrollments/course/${courseId}`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: error.message || 'Failed to fetch enrollments for course' };
//   }
// };
