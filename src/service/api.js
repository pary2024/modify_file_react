// src/services/apiService.js
import axios from 'axios';

// Laravel API base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
    'Content-Type': 'multipart/form-data'
  },
});

// Add token if available (optional)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } 
  return config;
});


export default api;
