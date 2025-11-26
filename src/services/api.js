import axios from 'axios';

const API_BASE_URL = 'https://proxyvanta-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('User API Request:', config.method?.toUpperCase(), config.url, 'Origin:', window.location.origin);
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('User API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('User API Error:', error.response?.status, error.response?.data || error.message, error.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;