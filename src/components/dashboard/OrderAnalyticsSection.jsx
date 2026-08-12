import React, { memo, useMemo } from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from './StatCard';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminOrders } from '../../hooks/useAdminDashboard';
const ORDER_STATUS_COLORS = ['#2e7d32', '#ed6c02', '#d32f2f', '#1976d2', '#9c27b0', '#00695c'];
const PAYMENT_STATUS_COLORS = ['#1565c0', '#f9a825', '#c62828', '#4caf50', '#7b1fa2', '#ff6f00'];
const renderCustomLabel = ({ name, percent }) => {
  return `${name} (${(percent * 100).toFixed(0)}%)`;
};
const OrderAnalyticsSection = () => {
  const { data, isLoading, isError, error, refetch } = useAdminOrders();
  const orderStatusData = useMemo(() => {
    if (!data?.orderStatusDistribution) return [];
    return data.orderStatusDistribution.map((item) => ({
      name: item.status,
      value: Number(item.count),
    }));
  }, [data]);
  const paymentStatusData = useMemo(() => {
    if (!data?.paymentStatusDistribution) return [];
    return data.paymentStatusDistribution.map((item) => ({
      name: item.status,
      value: Number(item.count),
    }));
  }, [data]);
  const monthComparison = useMemo(() => {
    if (!data) return { thisMonth: 0, lastMonth: 0, change: 0 };
    const thisMonth = Number(data.totalOrdersThisMonth || 0);
    const lastMonth = Number(data.totalOrdersLastMonth || 0);
    const change = lastMonth > 0 ? (((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1) : 0;
    return { thisMonth, lastMonth, change };
  }, [data]);
  if (isLoading) return <SectionLoader variant="chart" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Order Analytics
      </Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="This Month"
            value={monthComparison.thisMonth}
            subtitle="Orders"
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard
            label="Last Month"
            value={monthComparison.lastMonth}
            subtitle="Orders"
            color="#757575"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            label="Month-over-Month"
            value={`${monthComparison.change > 0 ? '+' : ''}${monthComparison.change}%`}
            subtitle="Change in orders"
            color={monthComparison.change >= 0 ? '#2e7d32' : '#d32f2f'}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Order Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      label={renderCustomLabel}
                      paddingAngle={2}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={entry.name} fill={ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Payment Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paymentStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      label={renderCustomLabel}
                      paddingAngle={2}
                    >
                      {paymentStatusData.map((entry, index) => (
                        <Cell key={entry.name} fill={PAYMENT_STATUS_COLORS[index % PAYMENT_STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(OrderAnalyticsSection);
