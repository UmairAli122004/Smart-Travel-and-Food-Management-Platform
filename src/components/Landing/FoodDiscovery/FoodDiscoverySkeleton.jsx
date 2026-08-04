import React from 'react';
import { Skeleton, Box, Typography } from '@mui/material';

const FoodDiscoverySkeleton = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2, cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-5px)' } }}>
      <Skeleton variant="circular" width={100} height={100} sx={{ mb: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
      <Skeleton variant="text" width={80} height={24} />
      <Skeleton variant="text" width={60} height={20} />
    </Box>
  );
};

export default FoodDiscoverySkeleton;
