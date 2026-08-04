import axios from 'axios';
import { ENV } from '../config/env';
const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data, status } = error.response;
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      return Promise.reject({
        status,
        data: data || {},
        message: data?.message || data?.error || 'An error occurred during request execution.',
      });
    }
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Unable to connect to the backend server.',
      });
    }
    return Promise.reject({
      status: -1,
      message: error.message || 'An unexpected error occurred.',
    });
  }
);
export default api;
