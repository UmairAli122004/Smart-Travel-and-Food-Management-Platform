import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import axios from 'axios';
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
        const response = await axios.get('http://localhost:8080/api/food-types');
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
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 8 }}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid size={{ xs: 1 }} key={index}>
              <FoodDiscoverySkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (foodTypes.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, px: 2 }}>
        What's on your mind?
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 2 }} columns={{ xs: 4, sm: 8, md: 8 }} sx={{ pb: 2 }}>
        {foodTypes.map((foodType) => (
          <Grid size={{ xs: 1 }} key={foodType.foodType}>
            <FoodDiscoveryCard foodType={foodType} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FoodDiscoverySection;
