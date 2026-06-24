import axios from 'axios';
import safeStorage from './storage';

let envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (envUrl.endsWith('/')) {
  envUrl = envUrl.slice(0, -1);
}
const API_BASE_URL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = safeStorage.getItem('civio_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle global errors (e.g. 401 Unauthorized redirect)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Redirecting to login.");
      safeStorage.removeItem('civio_current_user');
      safeStorage.removeItem('civio_token');
      window.location.href = '/onboarding';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
