import { useQuery } from '@tanstack/react-query';
import {
  fetchPassengerSummary,
  fetchPassengerRecentActivities,
} from '../api/passengerDashboardApi';
const FIVE_MINUTES = 5 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;
export const usePassengerSummary = () => {
  return useQuery({
    queryKey: ['passenger', 'summary'],
    queryFn: fetchPassengerSummary,
    staleTime: FIVE_MINUTES,
  });
};
export const usePassengerRecentActivities = (limit = 10) => {
  return useQuery({
    queryKey: ['passenger', 'recentActivities', limit],
    queryFn: () => fetchPassengerRecentActivities(limit),
    staleTime: TWO_MINUTES,
  });
};
