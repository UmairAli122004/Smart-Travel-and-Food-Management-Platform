import React, { memo, useMemo } from 'react';
import { Grid, Typography, Box, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DashboardCard from '../DashboardCard';
import StatCard from '../StatCard';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { usePassengerSummary } from '../../../hooks/usePassengerDashboard';
const PassengerSummaryCards = () => {
  const { data, isLoading, isError, error, refetch } = usePassengerSummary();
  const formattedSpent = useMemo(() => {
    return `₹${Number(data?.totalSpent || 0).toLocaleString('en-IN')}`;
  }, [data]);
  if (isLoading) return <SectionLoader variant="cards" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        My Overview
      </Typography>
      <Grid container spacing={3} mb={3}>
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
            title="Total Spent"
            value={formattedSpent}
            icon={<AttachMoneyIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Reviews Given"
            value={data.totalReviewsGiven}
            icon={<StarIcon />}
            color="#f9a825"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Complaints Filed"
            value={data.totalComplaintsFiled}
            icon={<ReportProblemIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={6} sm={4} md={3}>
          <StatCard
            label="Completed Orders"
            value={data.completedOrders}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatCard
            label="Pending Orders"
            value={data.pendingOrders}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatCard
            label="Cancelled Orders"
            value={data.cancelledOrders}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <StatCard
            label="Open Complaints"
            value={data.openComplaints}
            color="#c62828"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(PassengerSummaryCards);
