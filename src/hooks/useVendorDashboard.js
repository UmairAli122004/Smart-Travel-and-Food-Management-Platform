import { useQuery } from '@tanstack/react-query';
import {
  fetchVendorSummary,
  fetchVendorRestaurants,
  fetchVendorMenu,
  fetchVendorCustomers,
  fetchVendorReviews,
  fetchVendorComplaints,
} from '../api/vendorDashboardApi';
const FIVE_MINUTES = 5 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;
export const useVendorSummary = () => {
  return useQuery({
    queryKey: ['vendor', 'summary'],
    queryFn: fetchVendorSummary,
    staleTime: FIVE_MINUTES,
  });
};
export const useVendorRestaurants = (limit = 10) => {
  return useQuery({
    queryKey: ['vendor', 'restaurants', limit],
    queryFn: () => fetchVendorRestaurants(limit),
    staleTime: FIVE_MINUTES,
  });
};
export const useVendorMenu = (limit = 10) => {
  return useQuery({
    queryKey: ['vendor', 'menu', limit],
    queryFn: () => fetchVendorMenu(limit),
    staleTime: FIVE_MINUTES,
  });
};
export const useVendorCustomers = (limit = 10) => {
  return useQuery({
    queryKey: ['vendor', 'customers', limit],
    queryFn: () => fetchVendorCustomers(limit),
    staleTime: FIVE_MINUTES,
  });
};
export const useVendorReviews = () => {
  return useQuery({
    queryKey: ['vendor', 'reviews'],
    queryFn: fetchVendorReviews,
    staleTime: FIVE_MINUTES,
  });
};
export const useVendorComplaints = () => {
  return useQuery({
    queryKey: ['vendor', 'complaints'],
    queryFn: fetchVendorComplaints,
    staleTime: FIVE_MINUTES,
  });
};
