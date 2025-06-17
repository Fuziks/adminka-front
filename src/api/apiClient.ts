import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://pc-components-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true 
});


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      
      message: error.response?.data?.message || 'Network Error',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(apiError);
  }
);

export default apiClient;