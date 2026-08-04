import React, { memo, useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import DataTable from '../common/DataTable';
import StatCard from './StatCard';
import SectionLoader from './SectionLoader';
import ErrorAlert from './ErrorAlert';
import { useAdminVendors } from '../../hooks/useAdminDashboard';
const columns = [
  { header: 'Company', accessorKey: 'companyName' },
  { header: 'Orders', accessorKey: 'totalOrders' },
  {
    header: 'Revenue',
    accessorKey: 'totalRevenue',
    cell: ({ getValue }) => `₹${Number(getValue() || 0).toLocaleString('en-IN')}`,
  },
];
const VendorSection = () => {
  const [tab, setTab] = useState(0);
  const { data, isLoading, isError, error, refetch } = useAdminVendors(10);
  const chartData = useMemo(() => {
    if (!data?.topVendorsByRevenue) return [];
    return data.topVendorsByRevenue.map((v) => ({
      name: v.companyName?.length > 15 ? v.companyName.substring(0, 15) + '...' : v.companyName,
      revenue: Number(v.totalRevenue || 0),
      orders: Number(v.totalOrders || 0),
    }));
  }, [data]);
  if (isLoading) return <SectionLoader variant="table" />;
  if (isError) return <ErrorAlert message={error?.message} onRetry={refetch} />;
  if (!data) return null;
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Vendor Analytics
        </Typography>
        <StatCard label="Active Vendors" value={data.activeVendorsCount || 0} color="#6a1b9a" />
      </Box>
      {chartData.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={2}>
              Top Vendors Performance
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'Revenue') return [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue'];
                      return [value, 'Orders'];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#6a1b9a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="orders" name="Orders" fill="#ce93d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      )}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Top by Revenue" />
          <Tab label="Top by Orders" />
        </Tabs>
      </Box>
      {tab === 0 && (
        <DataTable
          data={data.topVendorsByRevenue || []}
          columns={columns}
          title="Top Vendors by Revenue"
        />
      )}
      {tab === 1 && (
        <DataTable
          data={data.topVendorsByOrders || []}
          columns={columns}
          title="Top Vendors by Orders"
        />
      )}
    </Box>
  );
};
export default memo(VendorSection);
