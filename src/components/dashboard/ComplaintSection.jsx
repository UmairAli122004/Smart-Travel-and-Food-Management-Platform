import React, { memo, useMemo } from 'react';
import { Box, Grid, Typography, Card, CardContent, LinearProgress } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminComplaints } from '../../hooks/useAdminDashboard';
const STATUS_COLORS = ['#ed6c02', '#2e7d32', '#d32f2f', '#1976d2', '#9c27b0', '#00695c'];
const TYPE_COLORS = ['#1565c0', '#c62828', '#f9a825', '#4caf50', '#7b1fa2', '#ff6f00'];
const renderLabel = ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`;
const ComplaintSection = () => {
  const { data, isLoading, isError, error, refetch } = useAdminComplaints();
  const statusData = useMemo(() => {
    if (!data?.complaintStatusDistribution) return [];
    return data.complaintStatusDistribution.map((item) => ({
      name: item.status,
      value: Number(item.count),
    }));
  }, [data]);
  const typeData = useMemo(() => {
    if (!data?.complaintTypeDistribution) return [];
    return data.complaintTypeDistribution.map((item) => ({
      name: item.status,
      value: Number(item.count),
    }));
  }, [data]);
  const resolutionRate = useMemo(() => {
    return data?.resolutionRate ? Number(data.resolutionRate).toFixed(1) : '0.0';
  }, [data]);
  if (isLoading) return <SectionLoader variant="chart" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Complaint Analytics
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Resolution Rate
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress
                variant="determinate"
                value={Number(resolutionRate)}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 6,
                    backgroundColor: Number(resolutionRate) >= 70 ? '#2e7d32' : Number(resolutionRate) >= 40 ? '#ed6c02' : '#d32f2f',
                  },
                }}
              />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ minWidth: 60 }}>
              {resolutionRate}%
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Complaint Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      label={renderLabel}
                      paddingAngle={2}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
                Complaint Type Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={typeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                      label={renderLabel}
                      paddingAngle={2}
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={entry.name} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
export default memo(ComplaintSection);
