import React, { memo, useMemo } from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import DashboardCard from '../DashboardCard';
import StatCard from '../StatCard';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorSummary } from '../../../hooks/useVendorDashboard';
const VendorSummaryCards = () => {
  const { data, isLoading, isError, error, refetch } = useVendorSummary();
  const formattedRevenue = useMemo(() => {
    return `₹${Number(data?.totalRevenue || 0).toLocaleString('en-IN')}`;
  }, [data]);
  if (isLoading) return <SectionLoader variant="cards" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Business Overview
      </Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Restaurants"
            value={data.totalRestaurants}
            icon={<StorefrontIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingCartIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Revenue"
            value={formattedRevenue}
            icon={<AttachMoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Average Rating"
            value={data.averageRating?.toFixed(1) || '0.0'}
            icon={<StarIcon />}
            color="#f9a825"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Completed Orders" value={data.completedOrders} color="#2e7d32" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Pending Orders" value={data.pendingOrders} color="#ed6c02" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Cancelled Orders" value={data.cancelledOrders} color="#d32f2f" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Today's Revenue" value={`₹${Number(data.todayRevenue).toLocaleString('en-IN')}`} color="#0288d1" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Monthly Revenue" value={`₹${Number(data.monthlyRevenue).toLocaleString('en-IN')}`} color="#8e24aa" />
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard label="Active Complaints" value={data.activeComplaints} color="#c62828" />
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(VendorSummaryCards);
