import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Alert, 
  Chip,
  Button,
  Snackbar
} from '@mui/material';
import { usePassengerOrders, useCancelOrder } from '../../../hooks/usePassengerOrders';
import { useMyReviews, useCreateReview } from '../../../hooks/useReview';
import DataTable from '../../../components/common/DataTable';
import SectionLoader from '../../../components/dashboard/SectionLoader';
import ErrorAlert from '../../../components/dashboard/ErrorAlert';
import ReviewModal from '../../../components/dashboard/passenger/ReviewModal';
import ComplaintForm from '../Complaints/ComplaintForm';
import { useCreateComplaint } from '../../../hooks/useComplaints';
import { format } from 'date-fns';

const MyOrders = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrderToReview, setSelectedOrderToReview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Hooks
  const { data: ordersData, isLoading: isLoadingOrders, isError: isErrorOrders, error: orderError, refetch: refetchOrders } = usePassengerOrders(page, size);
  const { data: reviewsData } = useMyReviews(0, 100); 
  const createReviewMutation = useCreateReview();
  const cancelOrderMutation = useCancelOrder();
  
  // Complaint Modal State
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [selectedOrderForComplaint, setSelectedOrderForComplaint] = useState(null);
  const createComplaintMutation = useCreateComplaint();

  // Create a set of order IDs that have already been reviewed to hide the rate button
  const reviewedOrderIds = new Set(reviewsData?.content?.map(r => r.orderId) || []);

  const handleOpenReview = (order) => {
    setSelectedOrderToReview(order);
    setIsReviewModalOpen(true);
  };

  const handleCloseReview = () => {
    setIsReviewModalOpen(false);
    setSelectedOrderToReview(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
        setSnackbar({ open: true, message: 'Order cancelled successfully!', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to cancel order.', severity: 'error' });
      }
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await createReviewMutation.mutateAsync(reviewData);
      setSnackbar({ open: true, message: 'Review submitted successfully!', severity: 'success' });
      handleCloseReview();
      refetchOrders(); // Optionally refresh orders if needed
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit review.', severity: 'error' });
    }
  };

  const handleOpenComplaint = (order) => {
    setSelectedOrderForComplaint(order);
    setIsComplaintModalOpen(true);
  };

  const handleCloseComplaint = () => {
    setIsComplaintModalOpen(false);
    setSelectedOrderForComplaint(null);
  };

  const handleSubmitComplaint = async (complaintData) => {
    try {
      await createComplaintMutation.mutateAsync(complaintData);
      setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });
      handleCloseComplaint();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to submit complaint.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns = [
    { header: 'Order ID', accessorKey: 'id' },
    { header: 'Restaurant', accessorKey: 'restaurantName' },
    { header: 'Train Info', accessorKey: 'trainPnr', cell: ({ row }) => `${row.original.trainNumber} - ${row.original.trainName}` },
    { 
      header: 'Total', 
      accessorKey: 'grandTotal',
      cell: ({ getValue }) => `₹${Number(getValue()).toFixed(2)}`
    },
    {
      header: 'Status',
      accessorKey: 'orderStatus',
      cell: ({ getValue }) => {
        const status = getValue();
        let color = 'default';
        if (status === 'DELIVERED') color = 'success';
        else if (status === 'CANCELLED') color = 'error';
        else if (status === 'BOOKED') color = 'info';
        
        return <Chip label={status} color={color} size="small" />;
      }
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => format(new Date(getValue()), 'MMM dd, yyyy HH:mm')
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original;
        const isDelivered = order.orderStatus === 'DELIVERED';
        const isBooked = order.orderStatus === 'BOOKED';
        const isReviewed = reviewedOrderIds.has(order.id);

        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {isBooked && (
              <Button 
                variant="outlined" 
                size="small" 
                color="error"
                onClick={() => handleCancelOrder(order.id)}
                disabled={cancelOrderMutation.isPending}
              >
                Cancel
              </Button>
            )}
            
            {isDelivered && !isReviewed && (
              <Button 
                variant="outlined" 
                size="small" 
                color="primary"
                onClick={() => handleOpenReview(order)}
              >
                Rate
              </Button>
            )}
            
            {isDelivered && isReviewed && (
              <Typography variant="caption" color="text.secondary">Rated</Typography>
            )}

            {(isBooked || isDelivered) && (
              <Button 
                variant="text" 
                size="small" 
                color="warning"
                onClick={() => handleOpenComplaint(order)}
              >
                Complaint
              </Button>
            )}
          </Box>
        );
      }
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Orders
        </Typography>
      </Box>

      {isLoadingOrders ? (
        <SectionLoader variant="table" />
      ) : isErrorOrders ? (
        <ErrorAlert message={orderError?.message || 'Failed to load orders'} onRetry={refetchOrders} />
      ) : (
        <DataTable
          columns={columns}
          data={ordersData?.content || []}
          totalPages={ordersData?.totalPages || 0}
          page={page}
          onPageChange={setPage}
          title="Order History"
        />
      )}

      {/* Review Modal */}
      <ReviewModal 
        open={isReviewModalOpen}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
        order={selectedOrderToReview}
        isSubmitting={createReviewMutation.isPending}
      />

      {/* Complaint Modal */}
      <ComplaintForm 
        open={isComplaintModalOpen}
        onClose={handleCloseComplaint}
        onSubmit={handleSubmitComplaint}
        order={selectedOrderForComplaint}
        isSubmitting={createComplaintMutation.isPending}
        error={createComplaintMutation.error?.response?.data?.message}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyOrders;
