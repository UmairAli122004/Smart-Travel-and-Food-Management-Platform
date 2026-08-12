import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Alert, Typography } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import AuthCard from '../../components/common/AuthCard';
import AuthHeader from '../../components/common/AuthHeader';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../validations/authSchema';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { ENV } from '../../config/env';
const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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
        login(response.data.data);
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Login failed. Please try again.');
      setTimeout(() => {
        setServerError('');
      }, 3000);
    }
  };
  return (
    <AuthCard elevation={0}>
      <AuthHeader title="Login" subtitle="Access your account" />
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
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 3, mb: 2 }}>
          <BaseButton
            type="submit"
            variant="contained"
            sx={{ flex: 1, py: 1, backgroundColor: '#c62828', '&:hover': { backgroundColor: '#b71c1c' } }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Submit'}
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
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  );
};
export default LoginPage;
