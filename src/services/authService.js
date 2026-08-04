import api from '../api/axiosConfig';
export const registerUser = async (userData) => {
  const response = await api.post('/user/register', userData);
  return response.data;
};
export const registerVendor = async (vendorData) => {
  const response = await api.post('/api/vendors/register', vendorData);
  return response.data;
};
export const loginUser = async (loginData) => {
  const response = await api.post('/user/login', loginData);
  const result = response.data?.data || response.data;
  if (result && result.token) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify({
      email: result.email,
      username: result.username,
      userId: result.userId,
      role: result.role,
    }));
  }
  return result;
};
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
export const getToken = () => {
  return localStorage.getItem('token');
};
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem('token'));
};
export default {
  registerUser,
  registerVendor,
  loginUser,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
};
