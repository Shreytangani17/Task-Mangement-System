import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s — allows for Vercel cold start (~4s) + DB connect (~4s)
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

/**
 * Pre-warm the Vercel serverless function + MongoDB connection.
 * Call this as early as possible (e.g. when Login page mounts) so the
 * server is ready by the time the user clicks "Sign in".
 */
export const warmupServer = () => {
  const healthUrl = BASE_URL.replace(/\/api$/, '/api/health');
  axios.get(healthUrl, { timeout: 8000 }).catch(() => {
    // Silently ignore — this is best-effort only
  });
};

export default API;
