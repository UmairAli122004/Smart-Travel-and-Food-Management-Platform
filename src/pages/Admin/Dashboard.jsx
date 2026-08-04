import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import SummaryCards from '../../components/dashboard/SummaryCards';
import RevenueSection from '../../components/dashboard/RevenueSection';
import OrderAnalyticsSection from '../../components/dashboard/OrderAnalyticsSection';
import VendorSection from '../../components/dashboard/VendorSection';

import ComplaintSection from '../../components/dashboard/ComplaintSection';
import RecentActivitiesSection from '../../components/dashboard/RecentActivitiesSection';
const AdminDashboard = () => {
  const queryClient = useQueryClient();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Admin Dashboard
        </Typography>
      </Box>
      <Box mb={6}>
        <SummaryCards />
      </Box>
      <Divider sx={{ my: 6 }} />
      <Box mb={6}>
        <RevenueSection />
      </Box>
      <Divider sx={{ my: 6 }} />
      <Box mb={6}>
        <OrderAnalyticsSection />
      </Box>
      <Divider sx={{ my: 6 }} />
      <Box mb={6}>
        <VendorSection />
      </Box>
      <Divider sx={{ my: 6 }} />
      <Box mb={6}>
        <ComplaintSection />
      </Box>
      <Divider sx={{ my: 6 }} />
      <Box mb={6}>
        <RecentActivitiesSection />
      </Box>
    </Box>
  );
};
export default AdminDashboard;
