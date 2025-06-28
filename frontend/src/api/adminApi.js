import axiosInstance from './axios';

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users'); // Removed /api prefix
    return response.data;
  } catch (error) {
    // Standardized error throwing
    throw error.response?.data || { message: error.message || 'Failed to fetch users' };
  }
};

// Content Management API functions
export const createContent = async (moduleId, contentData) => {
  try {
    const response = await axiosInstance.post(`/admin/modules/${moduleId}/content`, contentData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to create content' };
  }
};

export const updateContent = async (contentId, contentData) => {
  try {
    const response = await axiosInstance.put(`/admin/content/${contentId}`, contentData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update content' };
  }
};

export const deleteContent = async (contentId) => {
  try {
    const response = await axiosInstance.delete(`/admin/content/${contentId}`); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to delete content' };
  }
};

// Module Management API functions
export const createModule = async (courseId, moduleData) => {
  try {
    const response = await axiosInstance.post(`/admin/courses/${courseId}/modules`, moduleData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to create module' };
  }
};

export const updateModule = async (moduleId, moduleData) => {
  try {
    const response = await axiosInstance.put(`/admin/modules/${moduleId}`, moduleData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update module' };
  }
};

export const deleteModule = async (moduleId) => {
  try {
    const response = await axiosInstance.delete(`/admin/modules/${moduleId}`); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to delete module' };
  }
};

// Course Management API functions
export const getCourses = async () => {
  try {
    const response = await axiosInstance.get('/admin/courses'); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch courses' };
  }
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/admin/courses/${courseId}`); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to fetch course details' };
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/admin/courses', courseData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to create course' };
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/admin/courses/${courseId}`, courseData); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to update course' };
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/admin/courses/${courseId}`); // Removed /api prefix
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Failed to delete course' };
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}/approve`); // Removed /api prefix
    return response.data;
  } catch (error) {
    // Standardized error throwing
    throw error.response?.data || { message: error.message || 'Failed to approve user' };
  }
};
