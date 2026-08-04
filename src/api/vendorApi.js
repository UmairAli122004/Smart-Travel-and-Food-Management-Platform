import api from './axiosConfig';
export const createVendor = async (vendorData) => {
  const response = await api.post('/api/vendors/create', vendorData);
  return response.data;
};
export const updateVendor = async (vendorData) => {
  const response = await api.put('/api/vendors/update', vendorData);
  return response.data;
};
