import api from './axiosConfig';
import { VENDOR_DASHBOARD } from '../constants/apiEndpoints';
export const fetchVendorSummary = async () => {
  const response = await api.get(VENDOR_DASHBOARD.SUMMARY);
  return response.data.data;
};
export const fetchVendorRestaurants = async (limit = 10) => {
  const response = await api.get(VENDOR_DASHBOARD.RESTAURANTS, {
    params: { limit },
  });
  return response.data.data;
};
export const fetchVendorMenu = async (limit = 10) => {
  const response = await api.get(VENDOR_DASHBOARD.MENU, {
    params: { limit },
  });
  return response.data.data;
};
export const fetchVendorCustomers = async (limit = 10) => {
  const response = await api.get(VENDOR_DASHBOARD.CUSTOMERS, {
    params: { limit },
  });
  return response.data.data;
};
export const fetchVendorReviews = async () => {
  const response = await api.get(VENDOR_DASHBOARD.REVIEWS);
  return response.data.data;
};
export const fetchVendorComplaints = async () => {
  const response = await api.get(VENDOR_DASHBOARD.COMPLAINTS);
  return response.data.data;
};
