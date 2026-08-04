import api from './axiosConfig';
import { JOURNEY_API } from '../constants/apiEndpoints';

export const fetchPassengerJourneys = async (passengerId, params) => {
  // If passengerId is null or undefined (since the backend now relies on JWT), 
  // we can just send "0" or any ID, but let's assume we pass the passengerId we have.
  // Actually, the backend passenger route is /api/journeys/passenger/{passengerId}.
  // The backend will automatically resolve the passenger from JWT and override if role is PASSENGER.
  const resolvedId = passengerId || '0';
  const response = await api.get(JOURNEY_API.GET_PASSENGER_JOURNEYS(resolvedId), { params });
  return response.data?.data;
};

export const createJourney = async (journeyData) => {
  const response = await api.post(JOURNEY_API.CREATE, journeyData);
  return response.data?.data;
};

export const updateJourney = async (id, journeyData) => {
  const response = await api.put(JOURNEY_API.UPDATE(id), journeyData);
  return response.data?.data;
};

export const deleteJourney = async (id) => {
  const response = await api.delete(JOURNEY_API.DELETE(id));
  return response.data?.data;
};

export const getJourneyById = async (id) => {
  const response = await api.get(JOURNEY_API.GET_BY_ID(id));
  return response.data?.data;
};
