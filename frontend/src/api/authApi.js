import axiosInstance from './axios';

export const registerUser = async (userData) => {
  try {
    // The backend route /api/auth/register expects name, email, password
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // error.response.data will typically contain { message: "..." } from the backend
    throw error.response?.data || { message: error.message || 'Registration failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    // The backend route /api/auth/login expects email, password
    const response = await axiosInstance.post('/auth/login', credentials);
    // Backend should return { token, user: { _id, name, email, role, isApproved } }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message || 'Login failed' };
  }
};

// Optional: Add a function to verify token / get current user details
// export const verifyToken = async () => {
//   try {
//     const response = await axiosInstance.get('/auth/me'); // Assuming a /me endpoint exists
//     return response.data; // Should return user data
//   } catch (error) {
//     throw error.response?.data || { message: error.message || 'Token verification failed' };
//   }
// };
