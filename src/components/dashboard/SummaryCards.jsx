import React, { memo, useMemo } from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PersonIcon from '@mui/icons-material/Person';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrainIcon from '@mui/icons-material/Train';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardCard from './DashboardCard';
import StatCard from './StatCard';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminSummary } from '../../hooks/useAdminDashboard';
const SummaryCards = () => {
  const { data, isLoading, isError, error, refetch } = useAdminSummary();
  const formattedRevenue = useMemo(() => {
    if (!data) return { today: '₹0', monthly: '₹0', total: '₹0', aov: '₹0' };
    return {
      today: `₹${Number(data.todayRevenue || 0).toLocaleString('en-IN')}`,
      monthly: `₹${Number(data.monthlyRevenue || 0).toLocaleString('en-IN')}`,
      total: `₹${Number(data.totalRevenue || 0).toLocaleString('en-IN')}`,
      aov: `₹${Number(data.averageOrderValue || 0).toLocaleString('en-IN')}`,
    };
  }, [data]);
  if (isLoading) return <SectionLoader variant="cards" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Platform Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Total Users"
            value={data.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Total Revenue"
            value={formattedRevenue.total}
            icon={<AttachMoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Total Orders"
            value={data.totalOrders}
            icon={<ShoppingCartIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardCard
            title="Total Restaurants"
            value={data.totalRestaurants}
            icon={<RestaurantMenuIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Passengers" value={data.totalPassengers} color="#1565c0" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Vendors" value={data.totalVendors} color="#6a1b9a" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Stations" value={data.totalStations} color="#00695c" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard label="Journeys" value={data.totalJourneys} color="#e65100" />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            label="Avg Rating"
            value={data.averageRating ? data.averageRating.toFixed(1) : '0.0'}
            subtitle={`${data.totalReviews} reviews`}
            color="#f9a825"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatCard
            label="Complaints"
            value={data.totalComplaints}
            subtitle={`${data.activeComplaints} active · ${data.resolvedComplaints} resolved`}
            color="#c62828"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Today's Revenue" value={formattedRevenue.today} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Monthly Revenue" value={formattedRevenue.monthly} color="#1565c0" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard label="Avg Order Value" value={formattedRevenue.aov} color="#6a1b9a" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Order Status"
            value={data.completedOrders}
            subtitle={`${data.pendingOrders} pending · ${data.cancelledOrders} cancelled`}
            color="#ed6c02"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(SummaryCards);
