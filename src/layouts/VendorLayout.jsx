import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';

const VendorLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar title="Vendor Portal" />
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: { xs: 1, sm: 2, md: 3 }, 
          width: '100%', 
          backgroundColor: 'background.default', 
          maxWidth: '1400px',
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

export default VendorLayout;
