import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  MenuItem,
  Alert
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { PASSENGER_API } from '../../constants/apiEndpoints';

const ProfileSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emergencyContact: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        userId: user?.userId || user?.id
      };
      await axiosInstance.post(PASSENGER_API.CREATE, payload);
      const pendingOrder = sessionStorage.getItem('pendingOrder');
      if (pendingOrder) {
        navigate('/passenger/place-order');
      } else {
        // Profile created successfully, redirect to dashboard
        navigate('/passenger/dashboard');
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(err.response?.data?.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: '16px' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" color="primary">
            Complete Your Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome to the Smart Travel and Food Management Platform! Please complete your passenger profile to continue.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  format="DD-MM-YYYY"
                  value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                  onChange={(newValue) => {
                    setFormData({ ...formData, dateOfBirth: newValue ? newValue.format('YYYY-MM-DD') : '' });
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      required: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                inputProps={{ pattern: '^[1-9][0-9]{5}$', title: 'Enter a valid 6-digit pincode' }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, py: 1.5, borderRadius: '8px' }}
              >
                {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ProfileSetup;
