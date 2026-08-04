import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

const ReviewModal = ({ open, onClose, onSubmit, isSubmitting, order }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({
      orderId: order?.id,
      rating: rating,
      comment: comment
    });
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">Rate Restaurant: {order?.restaurantName}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2, alignItems: 'center' }}>
          <Typography component="legend">How was the food?</Typography>
          <Rating
            name="restaurant-rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            size="large"
            disabled={isSubmitting}
          />
          <TextField
            label="Write a review (optional)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            variant="outlined"
            inputProps={{ maxLength: 1000 }}
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          disabled={rating === 0 || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewModal;
