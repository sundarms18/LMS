import axios from 'axios';

// Use Vite environment variable for API base URL
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: baseURL,
});

// Interceptor to add token to requests
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // Assumes token is stored as a plain string
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
