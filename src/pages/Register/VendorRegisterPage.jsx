import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Alert, Typography, Grid } from '@mui/material';
import AuthCard from '../../components/common/AuthCard';
import AuthHeader from '../../components/common/AuthHeader';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { Link, useNavigate } from 'react-router-dom';
import { vendorRegisterSchema } from '../../validations/authSchema';
import { registerVendor } from '../../services/authService';

const VendorRegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vendorRegisterSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await registerVendor(data);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/vendor/login');
        }, 2000);
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthCard maxWidth={600}>
      <AuthHeader
        title="Vendor Registration"
        subtitle="Partner with Smart Travel & Food Management Platform"
      />

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Registration successful! Redirecting to login...
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              id="vendorName"
              label="Vendor Name"
              {...register('vendorName')}
              error={!!errors.vendorName}
              helperText={errors.vendorName?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              label="Contact Number"
              id="contactNumber"
              autoComplete="tel"
              {...register('contactNumber')}
              error={!!errors.contactNumber}
              helperText={errors.contactNumber?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              id="companyName"
              label="Company Name"
              {...register('companyName')}
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <BaseInput
              required
              fullWidth
              id="gstNumber"
              label="GST Number"
              {...register('gstNumber')}
              error={!!errors.gstNumber}
              helperText={errors.gstNumber?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <BaseInput
              required
              fullWidth
              id="businessAddress"
              label="Business Address"
              {...register('businessAddress')}
              error={!!errors.businessAddress}
              helperText={errors.businessAddress?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <BaseInput
              required
              fullWidth
              id="city"
              label="City"
              {...register('city')}
              error={!!errors.city}
              helperText={errors.city?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <BaseInput
              required
              fullWidth
              id="state"
              label="State"
              {...register('state')}
              error={!!errors.state}
              helperText={errors.state?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <BaseInput
              required
              fullWidth
              id="pincode"
              label="Pincode"
              {...register('pincode')}
              error={!!errors.pincode}
              helperText={errors.pincode?.message}
              disabled={isSubmitting || success}
            />
          </Grid>
        </Grid>

        <BaseButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isSubmitting || success}
        >
          {isSubmitting ? 'Registering...' : 'Register as Vendor'}
        </BaseButton>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already registered as a vendor?{' '}
            <Link to="/vendor/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  );
};

export default VendorRegisterPage;
