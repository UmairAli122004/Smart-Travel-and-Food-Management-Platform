import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { ORDER_API } from '../constants/apiEndpoints';

export const usePassengerOrders = (page = 0, size = 10, status = '') => {
  return useQuery({
    queryKey: ['passengerOrders', { page, size, status }],
    queryFn: async () => {
      let url = `${ORDER_API.PASSENGER_ORDERS}?page=${page}&size=${size}&sortBy=createdAt&direction=desc`;
      if (status) {
        url += `&status=${status}`;
      }
      const response = await axiosInstance.get(url);
      return response.data?.data;
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await axiosInstance.put(ORDER_API.CANCEL(orderId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengerOrders'] });
    },
  });
};
