import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminSummary,
  fetchAdminRecentActivities,
  fetchAdminRevenue,
  fetchAdminOrders,

  fetchAdminVendors,
  fetchAdminComplaints,
} from '../api/adminDashboardApi';
const FIVE_MINUTES = 5 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;
export const useAdminSummary = () => {
  return useQuery({
    queryKey: ['admin', 'summary'],
    queryFn: fetchAdminSummary,
    staleTime: FIVE_MINUTES,
  });
};
export const useAdminRecentActivities = (size = 5) => {
  return useQuery({
    queryKey: ['admin', 'recentActivities', size],
    queryFn: () => fetchAdminRecentActivities(size),
    staleTime: TWO_MINUTES,
  });
};
export const useAdminRevenue = (startDate, endDate) => {
  return useQuery({
    queryKey: ['admin', 'revenue', startDate, endDate],
    queryFn: () => fetchAdminRevenue(startDate, endDate),
    staleTime: TWO_MINUTES,
    enabled: !!startDate && !!endDate,
  });
};
export const useAdminOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAdminOrders,
    staleTime: FIVE_MINUTES,
  });
};

export const useAdminVendors = (limit = 10) => {
  return useQuery({
    queryKey: ['admin', 'vendors', limit],
    queryFn: () => fetchAdminVendors(limit),
    staleTime: FIVE_MINUTES,
  });
};
export const useAdminComplaints = () => {
  return useQuery({
    queryKey: ['admin', 'complaints'],
    queryFn: fetchAdminComplaints,
    staleTime: FIVE_MINUTES,
  });
};
