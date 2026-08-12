import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Rating, Alert, Chip, Collapse } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { REVIEW_API } from '../../../constants/apiEndpoints';

const fetchReviews = async (restaurantId) => {
  const response = await api.get(REVIEW_API.BY_RESTAURANT(restaurantId));
  return response.data?.data?.content || [];
};

const Row = ({ review }) => {
  const [open, setOpen] = useState(false);
  const hasReply = !!review.restaurantReply;

  return (
    <React.Fragment>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Rating value={review.rating} readOnly size="small" />
        </TableCell>
        <TableCell>{review.comment}</TableCell>
        <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom component="div" fontWeight="bold">
                Review Details
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Passenger Name:</strong> {review.passengerName || 'Anonymous'}
              </Typography>
              {hasReply && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1, color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2" fontWeight="bold">Vendor Reply:</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{review.restaurantReply}</Typography>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>
                    Replied on: {new Date(review.replyDate).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const AdminReviewManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ['adminReviews', restaurantId],
    queryFn: () => fetchReviews(restaurantId),
    enabled: !!restaurantId
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/restaurants')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
          Restaurant Reviews
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load reviews.</Alert>
      )}

      {reviews.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">No reviews found for this restaurant.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ width: 50 }} />
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Review</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.map((review) => (
                <Row key={review.id} review={review} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminReviewManagement;
