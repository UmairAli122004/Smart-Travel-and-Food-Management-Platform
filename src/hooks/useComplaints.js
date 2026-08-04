import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintService } from '../services/complaintService';

// Passenger Hooks
export const usePassengerComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['passengerComplaints', page, size],
    queryFn: async () => {
      const response = await complaintService.getMyComplaints({ page, size });
      return response.data.data;
    }
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => complaintService.createComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['passengerComplaints'] });
    }
  });
};

// Vendor Hooks
export const useVendorComplaints = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['vendorComplaints', page, size],
    queryFn: async () => {
      const response = await complaintService.getVendorComplaints({ page, size });
      return response.data.data;
    }
  });
};

export const useResolveVendorComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => complaintService.resolveVendorComplaint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorComplaints'] });
    }
  });
};

// Admin Hooks
export const useAdminComplaints = (params) => {
  return useQuery({
    queryKey: ['adminComplaints', params],
    queryFn: async () => {
      const response = await complaintService.getAllComplaints(params);
      return response.data.data;
    }
  });
};

export const useResolveAdminComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => complaintService.resolveAdminComplaint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminComplaints'] });
    }
  });
};
