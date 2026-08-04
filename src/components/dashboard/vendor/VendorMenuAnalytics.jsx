import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DataTable from '../../common/DataTable';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorMenu } from '../../../hooks/useVendorDashboard';
const menuColumns = [
  { header: 'ID', accessorKey: 'menuItemId' },
  { header: 'Item Name', accessorKey: 'menuName' },
  { header: 'Restaurant', accessorKey: 'restaurantName' },
  { header: 'Quantity Sold', accessorKey: 'totalQuantitySold' },
  {
    header: 'Revenue generated',
    accessorKey: 'totalRevenue',
    cell: ({ getValue }) => `₹${Number(getValue() || 0).toLocaleString('en-IN')}`,
  },
];
const TAB_CONFIG = [
  { label: 'Top Selling Items', dataKey: 'topSellingItems' },
  { label: 'Worst Selling Items', dataKey: 'worstSellingItems' },
];
const VendorMenuAnalytics = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = useVendorMenu(10);
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
        Menu Performance
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          {TAB_CONFIG.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      </Box>
      <DataTable data={tableData} columns={menuColumns} title={currentTab.label} />
    </Box>
  );
};
export default memo(VendorMenuAnalytics);
