import api from './axiosConfig';
import { PASSENGER_DASHBOARD } from '../constants/apiEndpoints';
export const fetchPassengerSummary = async () => {
  const response = await api.get(PASSENGER_DASHBOARD.SUMMARY);
  return response.data.data;
};
export const fetchPassengerRecentActivities = async (limit = 10) => {
  const response = await api.get(PASSENGER_DASHBOARD.RECENT_ACTIVITIES, {
    params: { limit },
  });
  return response.data.data;
};
