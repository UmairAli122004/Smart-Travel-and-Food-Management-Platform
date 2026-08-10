import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';

const FoodDiscoveryCard = ({ foodType }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/food-type/${foodType.foodType}`);
  };

  const imageSrc = optimizeCloudinaryUrl(foodType.imageUrl, { width: 200, height: 200, crop: 'fill' });

  return (
    <Box 
      onClick={handleClick}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        p: 2, 
        cursor: 'pointer', 
        transition: 'all 0.3s ease', 
        '&:hover': { 
          transform: 'scale(1.05)',
          '& .food-avatar': {
            boxShadow: '0 8px 24px rgba(226, 55, 68, 0.25)',
          }
        } 
      }}
    >
      <Avatar 
        className="food-avatar"
        src={imageSrc} 
        alt={foodType.foodTypeName}
        sx={{ 
          width: { xs: 80, sm: 100, md: 120 }, 
          height: { xs: 80, sm: 100, md: 120 }, 
          mb: 2, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }} 
      />
      <Typography variant="subtitle1" sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
        {foodType.foodTypeName}
      </Typography>
    </Box>
  );
};

export default FoodDiscoveryCard;
