import api from '../api/axiosConfig';

export const complaintService = {
  // Passenger APIs
  createComplaint: (data) => api.post('/api/complaints', data),
  getMyComplaints: (params) => api.get('/api/complaints/my', { params }),

  // Vendor APIs
  getVendorComplaints: (params) => api.get('/api/vendor/complaints', { params }),
  resolveVendorComplaint: (id, data) => api.put(`/api/vendor/complaints/${id}/resolve`, data),

  // Admin APIs
  getAllComplaints: (params) => api.get('/api/admin/complaints', { params }),
  resolveAdminComplaint: (id, data) => api.put(`/api/admin/complaints/${id}/resolve`, data),
};
