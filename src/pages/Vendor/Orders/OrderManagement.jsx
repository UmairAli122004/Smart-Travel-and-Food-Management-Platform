import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Pagination, Select, MenuItem,
  Collapse, CircularProgress, Alert, Button
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrainIcon from '@mui/icons-material/Train';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { ORDER_API } from '../../../constants/apiEndpoints';

const OrderRow = ({ order, onStatusChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="body2" fontWeight="bold">{order.id}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(order.orderDateTime).toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell>
          <Box display="flex" sx={{ alignItems: "center" }} gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">{order.passengerName}</Typography>
              <Typography variant="caption" color="text.secondary">{order.passengerContactNumber}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" sx={{ alignItems: "center" }} gap={1}>
            <TrainIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">{order.trainName} ({order.trainNumber})</Typography>
              <Typography variant="caption" color="text.secondary">
                PNR: {order.trainPnr} | {order.coachNumber}-{order.seatNumber}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{order.stationName}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight="bold">₹{Number(order.grandTotal || 0).toFixed(2)}</Typography>
          <Chip size="small" label={order.paymentStatus} color={order.paymentStatus === 'PAID' ? 'success' : 'warning'} sx={{ mt: 0.5 }} />
        </TableCell>
        <TableCell align="right">
          {order.orderStatus === 'CANCELLED' ? (
            <Chip size="small" label="CANCELLED" color="error" />
          ) : order.orderStatus === 'DELIVERED' ? (
            <Chip size="small" label="DELIVERED" color="success" />
          ) : (
            <Select
              size="small"
              value={order.orderStatus}
              onChange={(e) => onStatusChange(order.orderId, e.target.value)}
              sx={{ minWidth: 140 }}
            >
              {order.orderStatus === 'BOOKED' && <MenuItem value="BOOKED" disabled>Booked</MenuItem>}
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle2" gutterBottom component="div">
                Order Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Restaurant</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                      <TableCell>{item.restaurantName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">₹{Number(item.price || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">₹{(Number(item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const OrderManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const size = 10;
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = async (pageIndex, filter) => {
    let url = `${ORDER_API.VENDOR_ORDERS}?page=${pageIndex}&size=${size}`;
    if (filter !== 'ALL') {
      url += `&status=${filter}`;
    }
    const response = await api.get(url);
    return response.data.data;
  };

  const { data: ordersData, isLoading, isError, error } = useQuery({
    queryKey: ['vendorOrders', page, statusFilter],
    queryFn: () => fetchOrders(page, statusFilter),
    keepPreviousData: true
  });

  const statusMutation = useMutation({
    mutationFn: async ({ orderId, newStatus }) => {
      await api.patch(ORDER_API.UPDATE_STATUS(orderId), { orderStatus: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['vendor', 'summary'] });
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    statusMutation.mutate({ orderId, newStatus });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const orders = ordersData?.content || [];
  const totalPages = ordersData?.totalPages || 1;

  if (orders.length === 0 && statusFilter === 'ALL' && !isError) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <InventoryIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 3 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
          No Orders Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ maxWidth: 500, mb: 4 }}>
          You haven't received any orders yet. Orders placed by passengers for your restaurants will appear here.
        </Typography>
        <Button variant="contained" startIcon={<LocalShippingIcon />} onClick={() => queryClient.invalidateQueries(['vendorOrders'])}>
          Refresh Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Order Management
        </Typography>
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: '100%', sm: 200 }, bgcolor: 'background.paper' }}
        >
          <MenuItem value="ALL">All Orders</MenuItem>
          <MenuItem value="BOOKED">Booked</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </Select>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message || 'Failed to load orders. Please try again later.'}
        </Alert>
      )}

      {statusMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to update order status.
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2, mb: 3 }}>
        <Table aria-label="collapsible table">
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            <TableRow>
              <TableCell />
              <TableCell>Order Details</TableCell>
              <TableCell>Passenger</TableCell>
              <TableCell>Train Info</TableCell>
              <TableCell>Station</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderRow key={order.orderId} order={order} onStatusChange={handleStatusChange} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found matching the selected criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(e, v) => setPage(v - 1)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};

export default OrderManagement;
