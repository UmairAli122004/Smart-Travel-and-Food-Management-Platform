import React, { useState } from 'react';
import { Box, Typography, Divider, IconButton, Tooltip, Button, CircularProgress } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useVendorSummary } from '../../hooks/useVendorDashboard';
import VendorSummaryCards from '../../components/dashboard/vendor/VendorSummaryCards';
import VendorRestaurantAnalytics from '../../components/dashboard/vendor/VendorRestaurantAnalytics';
import VendorMenuAnalytics from '../../components/dashboard/vendor/VendorMenuAnalytics';
import VendorCustomerAnalytics from '../../components/dashboard/vendor/VendorCustomerAnalytics';
import VendorReviewAnalytics from '../../components/dashboard/vendor/VendorReviewAnalytics';
import VendorComplaintAnalytics from '../../components/dashboard/vendor/VendorComplaintAnalytics';
const VendorDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: summaryData, isError, error, isLoading } = useVendorSummary();
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Vendor Dashboard
        </Typography>

      </Box>
      {summaryData?.totalRestaurants === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, px: 2, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1, mt: 4 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No restaurants found for the current vendor
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Get started by creating your first restaurant to view analytics and manage orders.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/vendor/restaurants')}
          >
            Create Restaurant
          </Button>
        </Box>
      ) : (
        <>
          <Box mb={4}>
            <VendorSummaryCards />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box mb={4}>
            <VendorRestaurantAnalytics />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box mb={4}>
            <VendorMenuAnalytics />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box mb={4}>
            <VendorCustomerAnalytics />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box mb={4}>
            <VendorReviewAnalytics />
          </Box>
          <Divider sx={{ my: 4 }} />
          <Box mb={4}>
            <VendorComplaintAnalytics />
          </Box>
        </>
      )}
    </Box>
  );
};
export default VendorDashboard;
