import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1c1c1c',
        color: '#ffffff',
        py: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'grey.500' }}>
          &copy; 2026 Smart Travel &amp; Food Management Platform
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
