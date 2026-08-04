import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Footer from '../components/layout/Footer';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Container maxWidth="sm">
          <Outlet />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AuthLayout;
