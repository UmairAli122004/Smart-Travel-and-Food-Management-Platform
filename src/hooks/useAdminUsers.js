import { useQuery } from '@tanstack/react-query';
import { fetchUsersByRole } from '../api/adminUserApi';

export const useAdminUsers = (role, search) => {
  return useQuery({
    queryKey: ['admin', 'users', role, search],
    queryFn: () => fetchUsersByRole({ role, search }),
    keepPreviousData: true,
  });
};
