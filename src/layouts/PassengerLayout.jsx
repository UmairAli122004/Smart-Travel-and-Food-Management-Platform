import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Toolbar, Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import Loading from '../components/common/Loading';
import axiosInstance from '../api/axiosInstance';
import { PASSENGER_API } from '../constants/apiEndpoints';

const PassengerLayout = () => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await axiosInstance.get(PASSENGER_API.ME);
        setLoadingProfile(false);
        // If they are on profile-setup but have a profile, send them to dashboard
        if (location.pathname === '/passenger/profile-setup') {
          navigate('/passenger/dashboard');
        }
      } catch (error) {
        setLoadingProfile(false);
        if (error.response?.status === 404) {
          if (location.pathname !== '/passenger/profile-setup') {
            navigate('/passenger/profile-setup');
          }
        } else {
          console.error("Failed to load passenger profile", error);
        }
      }
    };
    fetchProfile();
  }, [navigate, location.pathname]);

  if (loadingProfile) {
    return <Loading />;
  }

  // Do not render sidebar/topbar if on profile-setup page
  if (location.pathname === '/passenger/profile-setup') {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Outlet />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar title="Passenger Portal" />
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%', 
          backgroundColor: 'background.default', 
          position: 'relative',
          maxWidth: '1400px', // Prevents it from looking too stretched on ultra-wides
          margin: '0 auto' 
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};
export default PassengerLayout;
