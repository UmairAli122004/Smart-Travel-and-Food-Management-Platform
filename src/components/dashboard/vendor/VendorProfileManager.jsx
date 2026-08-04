import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createVendor, updateVendor } from '../../../api/vendorApi';
const vendorSchema = z.object({
  companyName: z.string().min(1, 'Company name is required').max(150, 'Company name cannot exceed 150 characters'),
  contactNumber: z.string().min(10, 'Contact number is required').max(15, 'Contact number cannot exceed 15 characters'),
  gstNumber: z.string()
    .min(1, 'GST number is required')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Enter a valid GST number'),
  businessAddress: z.string().min(1, 'Business address is required').max(255, 'Business address cannot exceed 255 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City cannot exceed 100 characters'),
  state: z.string().min(1, 'State is required').max(100, 'State cannot exceed 100 characters'),
  pincode: z.string().min(1, 'Pincode is required').max(10, 'Pincode cannot exceed 10 characters'),
});
const VendorProfileManager = ({ mode = 'create', onSuccess }) => {
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      companyName: '',
      contactNumber: '',
      gstNumber: '',
      businessAddress: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const mutationFn = mode === 'create' ? createVendor : updateVendor;
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      setSubmitError(null);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      setSubmitError(error?.message || 'An error occurred while saving the vendor profile.');
    },
  });
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  return (
    <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>
        {mode === 'create' ? 'Create Vendor Profile' : 'Update Vendor Profile'}
      </Typography>
      {mode === 'create' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You need to create a vendor profile before you can access the dashboard.
        </Alert>
      )}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          fullWidth
          label="Company Name"
          margin="normal"
          {...register('companyName')}
          error={!!errors.companyName}
          helperText={errors.companyName?.message}
        />
        <TextField
          fullWidth
          label="Contact Number"
          margin="normal"
          {...register('contactNumber')}
          error={!!errors.contactNumber}
          helperText={errors.contactNumber?.message}
        />
        <TextField
          fullWidth
          label="GST Number"
          margin="normal"
          {...register('gstNumber')}
          error={!!errors.gstNumber}
          helperText={errors.gstNumber?.message}
        />
        <TextField
          fullWidth
          label="Business Address"
          margin="normal"
          multiline
          rows={3}
          {...register('businessAddress')}
          error={!!errors.businessAddress}
          helperText={errors.businessAddress?.message}
        />
        <Box display="flex" gap={2} mt={2}>
          <TextField
            fullWidth
            label="City"
            {...register('city')}
            error={!!errors.city}
            helperText={errors.city?.message}
          />
          <TextField
            fullWidth
            label="State"
            {...register('state')}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        </Box>
        <TextField
          fullWidth
          label="Pincode"
          margin="normal"
          sx={{ mt: 3 }}
          {...register('pincode')}
          error={!!errors.pincode}
          helperText={errors.pincode?.message}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 4, mb: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <CircularProgress size={24} /> : mode === 'create' ? 'Create Profile' : 'Update Profile'}
        </Button>
      </Box>
    </Paper>
  );
};
export default VendorProfileManager;
