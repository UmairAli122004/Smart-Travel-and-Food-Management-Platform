import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DataTable from '../../common/DataTable';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorRestaurants } from '../../../hooks/useVendorDashboard';
const restaurantColumns = [
  { header: 'ID', accessorKey: 'restaurantId' },
  { header: 'Restaurant Name', accessorKey: 'restaurantName' },
  { header: 'Total Orders', accessorKey: 'totalOrders' },
  {
    header: 'Revenue',
    accessorKey: 'totalRevenue',
    cell: ({ getValue }) => `₹${Number(getValue() || 0).toLocaleString('en-IN')}`,
  },
  {
    header: 'Rating',
    accessorKey: 'averageRating',
    cell: ({ getValue }) => Number(getValue() || 0).toFixed(1),
  },
];
const TAB_CONFIG = [
  { label: 'Top by Revenue', dataKey: 'restaurantsByRevenue' },
  { label: 'Top by Orders', dataKey: 'restaurantsByOrders' },
];
const VendorRestaurantAnalytics = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = useVendorRestaurants(10);
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
        Restaurant Performance
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          {TAB_CONFIG.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      </Box>
      <DataTable data={tableData} columns={restaurantColumns} title={currentTab.label} />
    </Box>
  );
};
export default memo(VendorRestaurantAnalytics);
