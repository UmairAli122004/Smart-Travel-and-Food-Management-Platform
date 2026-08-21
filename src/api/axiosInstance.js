import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isPublicAuthRoute = config.url?.includes('/user/login') || config.url?.includes('/user/register');
    if (token && !isPublicAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      if (error.config && error.config.url && error.config.url.includes('/login')) {
        // Allow the component to handle the login failure and display the error message
      } else if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
export default api;
