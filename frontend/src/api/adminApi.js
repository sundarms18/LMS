import axiosInstance from './axios';

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/users');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Content Management API functions
export const createContent = async (moduleId, contentData) => {
  try {
    const response = await axiosInstance.post(`/api/admin/modules/${moduleId}/content`, contentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateContent = async (contentId, contentData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/content/${contentId}`, contentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteContent = async (contentId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/content/${contentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Module Management API functions
export const createModule = async (courseId, moduleData) => {
  try {
    const response = await axiosInstance.post(`/api/admin/courses/${courseId}/modules`, moduleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateModule = async (moduleId, moduleData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/modules/${moduleId}`, moduleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteModule = async (moduleId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

// Course Management API functions
export const getCourses = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getCourseDetails = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/api/admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/api/admin/courses', courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const updateCourse = async (courseId, courseData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const response = await axiosInstance.delete(`/api/admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const approveUser = async (userId) => {
  try {
    const response = await axiosInstance.patch(`/api/admin/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
