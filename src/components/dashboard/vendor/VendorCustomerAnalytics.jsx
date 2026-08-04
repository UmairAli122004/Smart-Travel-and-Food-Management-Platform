import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import DataTable from '../../common/DataTable';
import SectionLoader from '../SectionLoader';
import ErrorAlert from '../ErrorAlert';
import { useVendorCustomers } from '../../../hooks/useVendorDashboard';
const customerColumns = [
  { header: 'Passenger ID', accessorKey: 'passengerId' },
  { header: 'Name', accessorKey: 'passengerName' },
  { header: 'Total Orders', accessorKey: 'orderCount' },
  {
    header: 'Total Spent',
    accessorKey: 'totalSpent',
    cell: ({ getValue }) => `₹${Number(getValue() || 0).toLocaleString('en-IN')}`,
  },
];
const TAB_CONFIG = [
  { label: 'Most Frequent Customers', dataKey: 'mostFrequentCustomers' },
  { label: 'Highest Spending Customers', dataKey: 'highestSpendingCustomers' },
];
const VendorCustomerAnalytics = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = useVendorCustomers(10);
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
        Customer Analytics
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable">
          {TAB_CONFIG.map((t, i) => (
            <Tab key={i} label={t.label} />
          ))}
        </Tabs>
      </Box>
      <DataTable data={tableData} columns={customerColumns} title={currentTab.label} />
    </Box>
  );
};
export default memo(VendorCustomerAnalytics);
