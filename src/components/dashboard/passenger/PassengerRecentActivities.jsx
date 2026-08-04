import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DataTable from '../../common/DataTable';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { usePassengerRecentActivities } from '../../../hooks/usePassengerDashboard';
import dayjs from 'dayjs';
const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};
const activityColumns = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'Reference', accessorKey: 'name' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Date',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const TAB_CONFIG = [
  { label: 'Recent Orders', dataKey: 'recentOrders' },
  { label: 'Recent Reviews', dataKey: 'recentReviews' },
  { label: 'Recent Complaints', dataKey: 'recentComplaints' },
];
const PassengerRecentActivities = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = usePassengerRecentActivities(10);
  const currentTab = TAB_CONFIG[tab];
  const tableData = useMemo(() => {
    if (!data || !currentTab) return [];
    return data[currentTab.dataKey] || [];
  }, [data, currentTab]);
  if (isLoading) return <SectionLoader variant="table" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Recent Activities
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {TAB_CONFIG.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      </Box>
      <DataTable
        data={tableData}
        columns={activityColumns}
        title={currentTab.label}
      />
    </Box>
  );
};
export default memo(PassengerRecentActivities);
