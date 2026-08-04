import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const Unauthorized = () => {
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
      <Typography variant="h1" color="error" sx={{ fontWeight: 'bold' }}>
        403
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        You do not have the required permissions to view this page. If you believe this is an error, please contact support.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  );
};
export default Unauthorized;
