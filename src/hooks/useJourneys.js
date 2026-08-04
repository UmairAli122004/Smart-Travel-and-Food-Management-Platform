import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPassengerJourneys, 
  createJourney, 
  updateJourney, 
  deleteJourney, 
  getJourneyById 
} from '../api/journeyApi';

export const usePassengerJourneys = (passengerId, page = 0, size = 10, sort = 'id,desc') => {
  return useQuery({
    queryKey: ['journeys', 'passenger', passengerId, { page, size, sort }],
    queryFn: () => fetchPassengerJourneys(passengerId, { page, size, sort }),
    keepPreviousData: true,
  });
};

export const useJourneyById = (id) => {
  return useQuery({
    queryKey: ['journeys', id],
    queryFn: () => getJourneyById(id),
    enabled: !!id,
  });
};

export const useCreateJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      // Invalidate dashboard summary as well since total orders/journeys might change
      queryClient.invalidateQueries({ queryKey: ['passenger', 'summary'] });
    },
  });
};

export const useUpdateJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => updateJourney(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys', variables.id] });
    },
  });
};

export const useDeleteJourney = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['passenger', 'summary'] });
    },
  });
};
