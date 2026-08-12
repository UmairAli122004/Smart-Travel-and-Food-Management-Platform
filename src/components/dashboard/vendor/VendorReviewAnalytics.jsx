import React, { memo, useMemo } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../ChartCard';
import StatCard from '../StatCard';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorReviews } from '../../../hooks/useVendorDashboard';
const COLORS = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'];
const VendorReviewAnalytics = () => {
  const { data, isLoading, isError, error, refetch } = useVendorReviews();
  const chartData = useMemo(() => {
    if (!data?.ratingDistribution) return [];
    return data.ratingDistribution.map((item) => ({
      name: `${item.status} Stars`,
      value: item.count,
    }));
  }, [data]);
  if (isLoading) return <SectionLoader variant="chart" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Review Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            <StatCard
              label="Average Rating"
              value={data.averageRating?.toFixed(1) || '0.0'}
              color="#f9a825"
              icon={<span style={{ fontSize: '2rem' }}>⭐</span>}
            />
            <StatCard
              label="Total Reviews"
              value={data.totalReviews}
              color="#1976d2"
              icon={<span style={{ fontSize: '2rem' }}>📝</span>}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <ChartCard 
            title="Rating Distribution" 
            isEmpty={chartData.length === 0} 
            emptyMessage="No reviews available yet" 
            emptyIcon="📊"
          >
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Reviews']} />
              <Legend />
            </PieChart>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(VendorReviewAnalytics);
