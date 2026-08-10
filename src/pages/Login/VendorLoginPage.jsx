import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Alert, Typography } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import AuthCard from '../../components/common/AuthCard';
import AuthHeader from '../../components/common/AuthHeader';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginSchema } from '../../validations/authSchema';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { ENV } from '../../config/env';

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await api.post('/user/login', data);
      if (response.data.success) {
        const authData = response.data.data;
        if (authData.role === 'VENDOR') {
          login(authData);
        } else {
          setServerError('Access denied. Please use the Passenger/Admin login page.');
        }
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthCard elevation={0}>
      <AuthHeader title="Vendor Login" subtitle="Access your Vendor Dashboard" />

      {serverError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {serverError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <BaseInput
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={isSubmitting}
        />
        <BaseInput
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isSubmitting}
        />
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3, mb: 2 }}>
          <BaseButton
            type="submit"
            variant="contained"
            sx={{ flex: 1, py: 1, backgroundColor: '#c62828', '&:hover': { backgroundColor: '#b71c1c' } }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Submit'}
          </BaseButton>
          <BaseButton
            variant="outlined"
            sx={{ flex: 1, py: 1, textTransform: 'none', color: '#c62828', borderColor: '#e0e0e0', '&:hover': { backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' } }}
            startIcon={<FcGoogle size={24} />}
            onClick={() => { window.location.href = `${ENV.API_BASE_URL}/oauth2/authorization/google`; }}
          >
            Google
          </BaseButton>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Don't have a vendor account?{' '}
            <Link to="/vendor/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  );
};

export default VendorLoginPage;
