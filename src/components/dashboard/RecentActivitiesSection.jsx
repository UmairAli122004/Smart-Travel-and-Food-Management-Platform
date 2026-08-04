import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DataTable from '../common/DataTable';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminRecentActivities } from '../../hooks/useAdminDashboard';
import dayjs from 'dayjs';
const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return dayjs(value).format('YYYY-MM-DD HH:mm');
};
const orderColumns = [
  { header: 'Order ID', accessorKey: 'id' },
  { header: 'Passenger', accessorKey: 'passengerName' },
  { header: 'Restaurant', accessorKey: 'restaurantName' },
  { header: 'Station', accessorKey: 'stationName' },
  { header: 'Status', accessorKey: 'orderStatus' },
  {
    header: 'Total',
    accessorKey: 'grandTotal',
    cell: ({ getValue }) => `₹${Number(getValue() || 0).toLocaleString('en-IN')}`,
  },
  {
    header: 'Date',
    accessorKey: 'orderDateTime',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const passengerColumns = [
  { header: 'ID', accessorKey: 'id' },
  { header: 'City', accessorKey: 'city' },
  { header: 'State', accessorKey: 'state' },
  {
    header: 'Joined',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const restaurantColumns = [
  { header: 'Name', accessorKey: 'restaurantName' },
  { header: 'Cuisine', accessorKey: 'cuisineType' },
  { header: 'Vendor', accessorKey: 'vendorName' },
  { header: 'Status', accessorKey: 'restaurantStatus' },
  {
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const reviewColumns = [
  { header: 'Order ID', accessorKey: 'orderId' },
  { header: 'Passenger', accessorKey: 'passengerName' },
  { header: 'Restaurant', accessorKey: 'restaurantName' },
  { header: 'Rating', accessorKey: 'rating' },
  { header: 'Comment', accessorKey: 'comment' },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Date',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const complaintColumns = [
  { header: 'Order ID', accessorKey: 'orderId' },
  { header: 'Passenger', accessorKey: 'passengerName' },
  { header: 'Restaurant', accessorKey: 'restaurantName' },
  { header: 'Type', accessorKey: 'complaintType' },
  { header: 'Title', accessorKey: 'title' },
  { header: 'Status', accessorKey: 'status' },
  {
    header: 'Date',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => formatDateTime(getValue()),
  },
];
const TAB_CONFIG = [
  { label: 'Recent Orders', dataKey: 'recentOrders', columns: orderColumns },
  { label: 'Recent Passengers', dataKey: 'recentPassengers', columns: passengerColumns },
  { label: 'Recent Restaurants', dataKey: 'recentRestaurants', columns: restaurantColumns },
  { label: 'Recent Reviews', dataKey: 'recentReviews', columns: reviewColumns },
  { label: 'Recent Complaints', dataKey: 'recentComplaints', columns: complaintColumns },
];
const RecentActivitiesSection = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = useAdminRecentActivities(5);
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
        columns={currentTab.columns}
        title={currentTab.label}
      />
    </Box>
  );
};
export default memo(RecentActivitiesSection);
