import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api', // FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token and API Key (if available)
api.interceptors.request.use(
  (config) => {
    // Get headers from localStorage
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('apiKey'); // Some endpoints might need this only

    // If token exists, attach it to Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // If specific endpoints need x-api-key, we can handle it here or in components
    // For now, let's add it if it exists, as some endpoints like OTP need it
    if (apiKey) {
      config.headers['X-API-KEY'] = apiKey;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        // Handle unauthenticated state - maybe redirect to login or clear storage
        // But be careful not to create infinite loops
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
