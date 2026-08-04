import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const schema = yup.object().shape({
  replyComment: yup.string().required('Reply comment is required').max(1000, 'Reply cannot exceed 1000 characters')
});
const ReplyModal = ({ open, onClose, onSubmit, isPending, error, review = null }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      replyComment: ''
    }
  });
  useEffect(() => {
    if (open) {
      reset({
        replyComment: review?.vendorReply || ''
      });
    }
  }, [open, review, reset]);
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };
  return (
    <Dialog disableEnforceFocus disableRestoreFocus open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle component="div" sx={{ typography: 'h5', fontWeight: 'bold', pb: 1 }}>
        Reply to Review
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            fullWidth
            label="Your Reply"
            multiline
            rows={5}
            {...register('replyComment')}
            error={!!errors.replyComment}
            helperText={errors.replyComment?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isPending}
          >
            {isPending ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default ReplyModal;
