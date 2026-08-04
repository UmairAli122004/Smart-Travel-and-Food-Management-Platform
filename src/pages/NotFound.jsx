import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <Typography variant="h1" color="primary" sx={{ fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  );
};
export default NotFound;
