import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  IconButton,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import TrainIcon from '@mui/icons-material/Train';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { ORDER_API } from '../../../constants/apiEndpoints';
import useDebounce from '../../../hooks/useDebounce';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';

const fetchAllOrders = async ({ queryKey }) => {
  const [_key, page, size, status] = queryKey;
  // FIXED: using sortBy 'orderDateTime' instead of 'id' to avoid Spring Data JPA 500 error
  const params = { page, size, sortBy: 'orderDateTime', direction: 'desc' };
  if (status !== 'ALL') {
    params.status = status;
  }
  const response = await api.get(ORDER_API.ALL, { params });
  return response.data.data;
};

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      case 'REFUNDED': return 'info';
      default: return 'default';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'BOOKED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="body2" fontWeight="bold">{order.id}</Typography>
          <Typography variant="caption" color="text.secondary">
            {order.orderDateTime ? new Date(order.orderDateTime).toLocaleString() : 'N/A'}
          </Typography>
        </TableCell>
        <TableCell>
          <Box display="flex" sx={{ alignItems: "center" }} gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">{order.passengerName || 'N/A'}</Typography>
              {order.passengerContactNumber && (
                 <Typography variant="caption" color="text.secondary">{order.passengerContactNumber}</Typography>
              )}
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Box display="flex" sx={{ alignItems: "center" }} gap={1}>
            <TrainIcon fontSize="small" color="action" />
            <Box>
              <Typography variant="body2">
                {order.trainName || 'Unknown'} ({order.trainNumber || 'Unknown'})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNR: {order.trainPnr || 'N/A'} {order.coachNumber && `| ${order.coachNumber}-${order.seatNumber}`}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{order.restaurantName || 'N/A'}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{order.stationName || 'N/A'}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight="bold">₹{Number(order.grandTotal || 0).toFixed(2)}</Typography>
          <Chip size="small" label={order.paymentStatus} color={getPaymentStatusColor(order.paymentStatus)} sx={{ mt: 0.5 }} />
        </TableCell>
        <TableCell align="right">
          <Chip size="small" label={order.orderStatus} color={getOrderStatusColor(order.orderStatus)} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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
                    <TableRow key={item.id || Math.random()}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{order.id}</TableCell>
                      <TableCell>{item.restaurantName || order.restaurantName || 'N/A'}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">₹{Number(item.price || 0).toFixed(2)}</TableCell>
                      <TableCell align="right">₹{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}</TableCell>
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

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: pageData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminOrders', page, rowsPerPage, statusFilter],
    queryFn: fetchAllOrders
  });

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorAlert message={error?.message || 'Failed to fetch orders'} onRetry={refetch} />;

  let orders = pageData?.content || [];
  const totalElements = pageData?.totalElements || 0;

  // Local filtering for search term
  if (debouncedSearchTerm) {
    const lower = debouncedSearchTerm.toLowerCase();
    orders = orders.filter(o => 
      o.id?.toString().includes(lower) ||
      o.passengerName?.toLowerCase().includes(lower) ||
      o.stationName?.toLowerCase().includes(lower) ||
      o.restaurantName?.toLowerCase().includes(lower)
    );
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          Order Management
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Search Orders"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="By number, passenger, station..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{ minWidth: 350 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="BOOKED">Booked</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table aria-label="collapsible table">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order Details</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Passenger</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Train Info</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Restaurant</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Station</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={() => ''}
            sx={{
              '.MuiTablePagination-actions': {
                display: 'none',
              }
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminOrders;
