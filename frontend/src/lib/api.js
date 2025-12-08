import axios from 'axios';
import toast from 'react-hot-toast';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    if (token) {
      // If token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global success/error messages
api.interceptors.response.use(
  (response) => {
    // If the backend sends a success message, show it
    if (response.data && response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    // Check if the request config has skipErrorToast set to true
    if (error.config && error.config.skipErrorToast) {
      return Promise.reject(error);
    }

    // Handle error responses
    let errorMessage = 'Something went wrong';
    
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (errorMessage !== 'Token is not valid') {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default api;
