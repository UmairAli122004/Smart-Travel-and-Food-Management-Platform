import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Alert, Typography, MenuItem } from '@mui/material';
import AuthCard from '../../components/common/AuthCard';
import AuthHeader from '../../components/common/AuthHeader';
import BaseButton from '../../components/common/BaseButton';
import BaseInput from '../../components/common/BaseInput';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../validations/authSchema';
import api from '../../api/axiosInstance';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PASSENGER',
    }
  });
  const onSubmit = async (data) => {
    try {
      setServerError('');
      const response = await api.post('/user/register', data);
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  return (
    <AuthCard>
      <AuthHeader title="Register" subtitle="Join Smart Travel & Food Management Platform" />
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
        <BaseInput
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          autoComplete="username"
          autoFocus
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isSubmitting || success}
        />
        <BaseInput
          margin="normal"
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
        <BaseInput
          margin="normal"
          required
          fullWidth
          id="phone"
          label="Phone Number"
          autoComplete="tel"
          {...register('phone')}
          error={!!errors.phone}
          helperText={errors.phone?.message}
          disabled={isSubmitting || success}
        />
        <BaseInput
          margin="normal"
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

        <BaseButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isSubmitting || success}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </BaseButton>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </AuthCard>
  );
};
export default RegisterPage;
