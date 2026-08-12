import React, { memo, useMemo } from 'react';
import { Grid, Typography, Box, LinearProgress, Card } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from '../ChartCard';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorComplaints } from '../../../hooks/useVendorDashboard';
const STATUS_COLORS = ['#d32f2f', '#ed6c02', '#2e7d32'];
const TYPE_COLORS = ['#1976d2', '#9c27b0', '#0288d1', '#e91e63'];
const VendorComplaintAnalytics = () => {
  const { data, isLoading, isError, error, refetch } = useVendorComplaints();
  const statusData = useMemo(() => {
    return (data?.complaintStatusDistribution || []).map((item) => ({
      name: item.status,
      value: item.count,
    }));
  }, [data]);
  const typeData = useMemo(() => {
    return (data?.complaintTypeDistribution || []).map((item) => ({
      name: item.status,
      value: item.count,
    }));
  }, [data]);
  if (isLoading) return <SectionLoader variant="chart" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Complaint Analytics
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 4, borderLeft: '4px solid #9c27b0', boxShadow: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Box p={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box width="100%">
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }} gutterBottom>
                Resolution Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                <Box width="100%">
                  <LinearProgress
                    variant="determinate"
                    value={data.resolutionRate || 0}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: '#e0e0e0' }}
                    color={data.resolutionRate > 80 ? 'success' : data.resolutionRate > 50 ? 'warning' : 'error'}
                  />
                </Box>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {data.resolutionRate?.toFixed(1) || 0}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ml: 2, fontSize: '2rem', opacity: 0.8 }}>
              🛠️
            </Box>
          </Box>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Complaints by Status"
            isEmpty={statusData.length === 0}
            emptyMessage="No status data available"
            emptyIcon="📝"
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartCard 
            title="Complaints by Type"
            isEmpty={typeData.length === 0}
            emptyMessage="No type data available"
            emptyIcon="🏷️"
          >
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartCard>
        </Grid>
      </Grid>
    </Box>
  );
};
export default memo(VendorComplaintAnalytics);
