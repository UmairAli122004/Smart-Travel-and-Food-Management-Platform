import api from './axiosConfig';
import { ADMIN_DASHBOARD } from '../constants/apiEndpoints';
export const fetchAdminSummary = async () => {
  const response = await api.get(ADMIN_DASHBOARD.SUMMARY);
  return response.data.data;
};
export const fetchAdminRecentActivities = async (size = 5) => {
  const response = await api.get(ADMIN_DASHBOARD.RECENT_ACTIVITIES, {
    params: { size },
  });
  return response.data.data;
};
export const fetchAdminRevenue = async (startDate, endDate) => {
  const response = await api.get(ADMIN_DASHBOARD.REVENUE, {
    params: { startDate, endDate },
  });
  return response.data.data;
};
export const fetchAdminOrders = async () => {
  const response = await api.get(ADMIN_DASHBOARD.ORDERS);
  return response.data.data;
};

export const fetchAdminVendors = async (limit = 10) => {
  const response = await api.get(ADMIN_DASHBOARD.VENDORS, {
    params: { limit },
  });
  return response.data.data;
};
export const fetchAdminComplaints = async () => {
  const response = await api.get(ADMIN_DASHBOARD.COMPLAINTS);
  return response.data.data;
};
