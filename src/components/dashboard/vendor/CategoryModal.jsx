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
  categoryName: yup.string().required('Category name is required').min(2, 'Name too short'),
  description: yup.string().required('Description is required')
});
const CategoryModal = ({ open, onClose, onSubmit, isPending, error, initialData = null }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      categoryName: '',
      description: ''
    }
  });
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          categoryName: initialData.categoryName,
          description: initialData.description
        });
      } else {
        reset({
          categoryName: '',
          description: ''
        });
      }
    }
  }, [open, initialData, reset]);
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };
  return (
    <Dialog disableEnforceFocus disableRestoreFocus open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            {...register('categoryName')}
            error={!!errors.categoryName}
            helperText={errors.categoryName?.message}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default CategoryModal;
