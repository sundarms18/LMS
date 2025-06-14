import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if your backend runs elsewhere
});

// Optional: Interceptor to add token to requests
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
