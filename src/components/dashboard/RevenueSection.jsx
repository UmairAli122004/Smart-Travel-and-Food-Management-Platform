import React, { memo, useState, useMemo, useCallback } from 'react';
import { Box, Grid, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import dayjs from 'dayjs';
import DashboardCard from './DashboardCard';
import ChartCard from './ChartCard';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminRevenue } from '../../hooks/useAdminDashboard';
const RevenueSection = () => {
  const [startDate, setStartDate] = useState(dayjs().subtract(30, 'day').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [appliedStart, setAppliedStart] = useState(startDate);
  const [appliedEnd, setAppliedEnd] = useState(endDate);
  const { data, isLoading, isError, error, refetch } = useAdminRevenue(appliedStart, appliedEnd);
  const handleApply = useCallback(() => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  }, [startDate, endDate]);
  const chartData = useMemo(() => {
    if (!data?.revenueChartData) return [];
    return data.revenueChartData.map((point) => ({
      date: point.label,
      revenue: Number(point.primaryValue || 0),
      orders: Number(point.secondaryValue || 0),
    }));
  }, [data]);
  if (isLoading) return <SectionLoader variant="chart" height={400} />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={3}>
        Revenue Analytics
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          size="small"
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Button variant="contained" size="medium" onClick={handleApply}>
          Apply
        </Button>
      </Box>
      {data && (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title={data.totalRevenueCard?.title || 'Total Revenue'}
              value={data.totalRevenueCard?.value || '₹0'}
              trend={data.totalRevenueCard?.trend}
              trendDirection={data.totalRevenueCard?.trendDirection}
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DashboardCard
              title={data.averageOrderValueCard?.title || 'Avg Order Value'}
              value={data.averageOrderValueCard?.value || '₹0'}
              trend={data.averageOrderValueCard?.trend}
              trendDirection={data.averageOrderValueCard?.trendDirection}
              color="#1565c0"
            />
          </Grid>
        </Grid>
      )}
      {chartData.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Revenue Over Time
            </Typography>
            <Box sx={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e0e0e0' }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue'];
                      return [value, 'Orders'];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2e7d32"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="orders"
                    stroke="#1976d2"
                    fill="none"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
export default memo(RevenueSection);
