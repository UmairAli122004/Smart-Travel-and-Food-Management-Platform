import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, CircularProgress, Paper, Grid, Card, CardContent, Divider, Rating, Pagination, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplyIcon from '@mui/icons-material/Reply';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { REVIEW_API } from '../../../constants/apiEndpoints';
import ReplyModal from '../../../components/dashboard/vendor/ReplyModal';
const fetchReviewSummary = async (restaurantId) => {
  const response = await api.get(REVIEW_API.RATING_SUMMARY(restaurantId));
  return response.data.data;
};
const fetchReviews = async (restaurantId, page, size) => {
  const response = await api.get(`${REVIEW_API.BY_RESTAURANT(restaurantId)}?page=${page}&size=${size}`);
  return response.data.data; 
};
const ReviewManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const size = 10;
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { data: summary, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['reviewSummary', restaurantId],
    queryFn: () => fetchReviewSummary(restaurantId),
    enabled: !!restaurantId
  });
  const { data: reviewsData, isLoading: isLoadingReviews, isError } = useQuery({
    queryKey: ['reviews', restaurantId, page],
    queryFn: () => fetchReviews(restaurantId, page, size),
    enabled: !!restaurantId,
    keepPreviousData: true
  });
  const replyMutation = useMutation({
    mutationFn: async (data) => {
      await api.put(REVIEW_API.REPLY(selectedReview.id), {
        replyComment: data.replyComment
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', restaurantId] });
      setReplyModalOpen(false);
      setSelectedReview(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to submit reply.');
    }
  });
  const handleReplySubmit = (data) => {
    replyMutation.mutate(data);
  };
  const handlePageChange = (event, value) => {
    setPage(value - 1); 
  };
  if (isLoadingSummary || isLoadingReviews) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const reviews = reviewsData?.content || [];
  const totalPages = reviewsData?.totalPages || 1;
  const displaySummary = summary || { averageRating: 0, totalReviews: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700}>
          Restaurant Reviews
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>Average Rating</Typography>
            <Typography variant="h2" fontWeight={700} color="primary.main">{displaySummary.averageRating.toFixed(1)}</Typography>
            <Rating value={displaySummary.averageRating} precision={0.1} readOnly size="large" sx={{ mx: 'auto', mt: 1 }} />
            <Typography variant="body2" color="text.secondary" mt={1}>Based on {displaySummary.totalReviews} reviews</Typography>
          </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2, height: '100%' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>Rating Distribution</Typography>
              <Box>
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = displaySummary.ratingDistribution ? displaySummary.ratingDistribution[stars] || 0 : 0;
                  const percentage = displaySummary.totalReviews ? (count / displaySummary.totalReviews) * 100 : 0;
                  return (
                    <Box key={stars} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" sx={{ width: 60 }}>{stars} Stars</Typography>
                      <Box sx={{ flexGrow: 1, mx: 2, bgcolor: 'grey.200', height: 8, borderRadius: 4 }}>
                        <Box sx={{ width: `${percentage}%`, bgcolor: 'primary.main', height: '100%', borderRadius: 4 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ width: 40, textAlign: 'right' }}>{count}</Typography>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          </Grid>
        </Grid>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load reviews.</Alert>}

      {!isError && (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {reviews.map((review) => (
              <Grid size={{ xs: 12 }} key={review.id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>{review.passengerName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly />
                    </Box>
                    <Typography variant="body1" mb={2}>{review.comment}</Typography>
                    {review.restaurantReply ? (
                      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                        <Typography variant="subtitle2" color="primary.main" gutterBottom>Your Reply</Typography>
                        <Typography variant="body2">{review.restaurantReply}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          {new Date(review.replyDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<ReplyIcon />} 
                          onClick={() => {
                            setErrorMsg('');
                            setSelectedReview(review);
                            setReplyModalOpen(true);
                          }}
                        >
                          Reply
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page + 1} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </Box>
      )}
      <ReplyModal 
        open={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        onSubmit={handleReplySubmit}
        isPending={replyMutation.isPending}
        error={errorMsg}
        review={selectedReview}
      />
    </Box>
  );
};
export default ReviewManagement;
