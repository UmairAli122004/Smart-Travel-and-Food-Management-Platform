import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box, Typography, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
const EditRestaurantModal = ({ open, onClose, restaurant }) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      restaurantName: '',
      address: '',
      contactNumber: '',
      cuisineType: '',
      restaurantStatus: 'OPEN',
    }
  });
  useEffect(() => {
    if (restaurant) {
      reset({
        restaurantName: restaurant.restaurantName || '',
        address: restaurant.address || '',
        contactNumber: restaurant.contactNumber || '',
        cuisineType: restaurant.cuisineType || '',
        restaurantStatus: restaurant.restaurantStatus || 'OPEN',
      });
    }
  }, [restaurant, reset]);
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.put(`/api/restaurants/${restaurant.id}`, {
        restaurantName: formData.restaurantName,
        address: formData.address,
        contactNumber: formData.contactNumber,
        cuisineType: formData.cuisineType,
        restaurantStatus: formData.restaurantStatus,
      });
      if (selectedImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', selectedImage);
        await api.post(`/api/restaurants/${restaurant.id}/image`, imageFormData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['myRestaurants'] });
      await queryClient.invalidateQueries({ queryKey: ['vendor'] });
      handleClose();
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to update restaurant');
    }
  });
  const onSubmit = (data) => {
    setError('');
    updateMutation.mutate(data);
  };
  const handleClose = () => {
    setSelectedImage(null);
    setError('');
    onClose();
  };
  return (
    <Dialog disableEnforceFocus disableRestoreFocus open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Restaurant</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
            <Controller
              name="restaurantName"
              control={control}
              rules={{ required: 'Restaurant name is required' }}
              render={({ field }) => (
                <TextField {...field} size="small" label="Restaurant Name" fullWidth error={!!errors.restaurantName} helperText={errors.restaurantName?.message} />
              )}
            />
            <Controller
              name="address"
              control={control}
              rules={{ required: 'Address is required' }}
              render={({ field }) => (
                <TextField {...field} size="small" label="Address" fullWidth multiline rows={2} error={!!errors.address} helperText={errors.address?.message} />
              )}
            />
            <Controller
              name="contactNumber"
              control={control}
              rules={{ 
                required: 'Contact number is required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Valid 10-digit Indian number required' }
              }}
              render={({ field }) => (
                <TextField {...field} size="small" label="Contact Number" fullWidth error={!!errors.contactNumber} helperText={errors.contactNumber?.message} />
              )}
            />
            <Controller
              name="cuisineType"
              control={control}
              rules={{ required: 'Cuisine type is required' }}
              render={({ field }) => (
                <TextField {...field} size="small" label="Cuisine Type" fullWidth placeholder="e.g. Italian, North Indian" error={!!errors.cuisineType} helperText={errors.cuisineType?.message} />
              )}
            />
            <Controller
              name="restaurantStatus"
              control={control}
              render={({ field }) => (
                <TextField {...field} size="small" select label="Status" fullWidth>
                  <MenuItem value="OPEN">Open</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </TextField>
              )}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>Update Restaurant Image (Optional)</Typography>
              <input
                accept="image/jpeg, image/png, image/webp"
                type="file"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              {selectedImage && <Typography variant="caption" display="block">{selectedImage.name}</Typography>}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default EditRestaurantModal;
