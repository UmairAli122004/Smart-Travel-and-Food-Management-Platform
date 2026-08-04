import api from './axiosConfig';

export const fetchUsersByRole = async ({ role, search }) => {
  const response = await api.get('/admin/users', {
    params: { role, search: search || undefined },
  });
  return response.data.data || [];
};
