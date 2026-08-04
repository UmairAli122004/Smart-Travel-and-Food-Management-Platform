import React, { useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '../../../components/common/DataTable';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';
import { useAdminUsers } from '../../../hooks/useAdminUsers';
import useDebounce from '../../../hooks/useDebounce';

const userColumns = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Name', accessorKey: 'username' },
  { header: 'Email', accessorKey: 'email' },
  { header: 'Phone', accessorKey: 'phone' },
  { header: 'Role', accessorKey: 'role' },
];

const ROLES = ['VENDOR', 'PASSENGER', 'ADMIN'];

const UserManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const selectedRole = ROLES[tabIndex];

  const { data: users, isLoading, isError, error, refetch } = useAdminUsers(selectedRole, debouncedSearchTerm);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const tableData = useMemo(() => {
    return users || [];
  }, [users]);

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        User Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="user roles tabs">
          <Tab label="Vendors" />
          <Tab label="Passengers" />
          <Tab label="Admins" />
        </Tabs>
      </Box>

      <Box mb={3}>
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or phone number..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {isLoading ? (
        <SectionLoader variant="table" />
      ) : isError ? (
        <ErrorAlert message={error?.message || 'Failed to fetch users'} onRetry={refetch} />
      ) : (
        <DataTable
          data={tableData}
          columns={userColumns}
          title={`${selectedRole} Users`}
        />
      )}
    </Box>
  );
};

export default UserManagement;
