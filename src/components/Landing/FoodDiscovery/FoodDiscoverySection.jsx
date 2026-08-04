import React, { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import api from '../../../api/axiosInstance';
import FoodDiscoveryCard from './FoodDiscoveryCard';
import FoodDiscoverySkeleton from './FoodDiscoverySkeleton';

const STATIC_FOOD_TYPES = [
  { foodType: 'VEG', foodTypeName: 'Veg', imageUrl: null },
  { foodType: 'MUTTON', foodTypeName: 'Mutton', imageUrl: null },
  { foodType: 'GLUTEN_FREE', foodTypeName: 'Gluten Free', imageUrl: null },
  { foodType: 'HIGH_PROTEIN', foodTypeName: 'High Protein', imageUrl: null },
  { foodType: 'SEAFOOD', foodTypeName: 'Seafood', imageUrl: null },
  { foodType: 'VEGAN', foodTypeName: 'Vegan', imageUrl: null },
  { foodType: 'DAIRY_FREE', foodTypeName: 'Dairy Free', imageUrl: null },
  { foodType: 'DINNER', foodTypeName: 'Dinner', imageUrl: null },
];

const FoodDiscoverySection = () => {
  const [foodTypes, setFoodTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await api.get('/api/food-types');
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setFoodTypes(response.data.data);
        } else {
          setFoodTypes(STATIC_FOOD_TYPES);
        }
      } catch (error) {
        console.error('Error fetching food types:', error);
        setFoodTypes(STATIC_FOOD_TYPES);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodTypes();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, px: 2 }}>
          What's on your mind?
        </Typography>
        <Box
          sx={{
            display: 'flex',
            overflowX: 'hidden',
            pb: 2,
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {Array.from(new Array(8)).map((_, index) => (
            <Box key={index} sx={{ flexShrink: 0 }}>
              <FoodDiscoverySkeleton />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  if (foodTypes.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, px: 2 }}>
        What's on your mind?
      </Typography>
      
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          pb: 2,
          gap: { xs: 2, sm: 3, md: 4 },
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {foodTypes.map((foodType) => (
          <Box key={foodType.foodType} sx={{ flexShrink: 0 }}>
            <FoodDiscoveryCard foodType={foodType} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default FoodDiscoverySection;
