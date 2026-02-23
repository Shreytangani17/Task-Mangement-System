import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15s — allows for Vercel cold start (~5s) + DB connect (~5s)
});

// Attach auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(new Error('Request timed out. The server is starting up — please try again in a few seconds.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Cannot reach the server. Please check your internet connection.'));
    }
    return Promise.reject(error);
  }
);

export default API;
