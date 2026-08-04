import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { REVIEW_API } from '../constants/apiEndpoints';

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reviewData) => {
      const response = await axiosInstance.post(REVIEW_API.CREATE, reviewData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['passengerOrders'] });
      queryClient.invalidateQueries({ queryKey: ['passenger', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    },
  });
};

export const useMyReviews = (page = 0, size = 100) => {
  return useQuery({
    queryKey: ['myReviews', { page, size }],
    queryFn: async () => {
      // Use the actual endpoint from ReviewController -> /api/reviews/my
      const response = await axiosInstance.get(`/api/reviews/my?page=${page}&size=${size}`);
      return response.data?.data;
    },
  });
};
