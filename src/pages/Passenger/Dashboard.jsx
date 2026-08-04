import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import PassengerSummaryCards from '../../components/dashboard/passenger/PassengerSummaryCards';
import PassengerRecentActivities from '../../components/dashboard/passenger/PassengerRecentActivities';
const PassengerDashboard = () => {
  const queryClient = useQueryClient();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Passenger Dashboard
        </Typography>
      </Box>
      <Box mb={4}>
        <PassengerSummaryCards />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box mb={4}>
        <PassengerRecentActivities />
      </Box>
    </Box>
  );
};
export default PassengerDashboard;
