import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Button, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import useMenuItems from '../../hooks/useMenuItems';
import MenuItemCard from '../../components/menu/MenuItemCard';

const FoodTypeMenuPage = () => {
  const { foodType } = useParams();
  const navigate = useNavigate();
  
  const { 
    items, 
    loading, 
    error, 
    hasMore, 
    isFetchingMore, 
    loadMore, 
    retry 
  } = useMenuItems(foodType, 0, 12);

  const formatFoodType = (type) => {
    if (!type) return '';
    return type.replace('_', ' ');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', pt: 4, pb: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)}
            sx={{ mr: 2, color: 'text.secondary' }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
            {formatFoodType(foodType)} Menu
          </Typography>
        </Box>

        {/* Error State */}
        {error && (
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={retry}>Retry</Button>
          } sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading State (Initial) */}
        {loading && !isFetchingMore && items.length === 0 ? (
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box sx={{ width: '100%', height: 350, bgcolor: 'grey.300', borderRadius: 2, animation: 'pulse 1.5s infinite' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {/* Empty State */}
            {!loading && items.length === 0 && !error ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <RestaurantMenuIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No menu items available
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We couldn't find any {formatFoodType(foodType)} items at the moment. Please check back later!
                </Typography>
              </Box>
            ) : (
              /* Grid Layout */
              <Grid container spacing={3}>
                {items.map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
                    <MenuItemCard item={item} />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Load More */}
            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={loadMore}
                  disabled={isFetchingMore}
                  sx={{ borderRadius: 8, px: 4 }}
                >
                  {isFetchingMore ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default FoodTypeMenuPage;
