import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, CardMedia, 
  Button, CircularProgress, Alert, Container, IconButton,
  InputAdornment, TextField, Chip, Rating
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorefrontIcon from '@mui/icons-material/Storefront';
import axiosInstance from '../../../api/axiosInstance';
import { RESTAURANT_API } from '../../../constants/apiEndpoints';

const RestaurantList = () => {
  const { journeyId } = useParams();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!journeyId) {
      navigate('/passenger/order');
      return;
    }
    fetchRestaurants();
  }, [journeyId, navigate]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      // Fetch all active restaurants. Page size 50 for simplicity.
      const response = await axiosInstance.get(`${RESTAURANT_API.ALL}?page=0&size=50`);
      setRestaurants(response.data?.data?.content || []);
      setError('');
    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRestaurant = (restaurantId) => {
    navigate(`/passenger/order/${journeyId}/restaurants/${restaurantId}`);
  };

  const filteredRestaurants = restaurants.filter(r => {
    const nameMatch = r.restaurantName?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const cuisineMatch = r.cuisineType?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    return nameMatch || cuisineMatch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/passenger/order')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="bold">
          Browse Restaurants
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by restaurant name or cuisine..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      {filteredRestaurants.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <StorefrontIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No restaurants found.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredRestaurants.map((restaurant) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={restaurant.id}>
              <Card 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)'
                  },
                  overflow: 'hidden',
                  bgcolor: 'background.paper'
                }}
              >
                <Box sx={{ p: 1.5, pb: 0 }}>
                  <Box sx={{ 
                    position: 'relative',
                    width: '100%', 
                    height: 160,
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: '#000'
                  }}>
                    <img
                      src={restaurant.imageUrl ? `${axiosInstance.defaults.baseURL}${RESTAURANT_API.IMAGE(restaurant.id)}` : 'https://placehold.co/400x200?text=No+Image'}
                      alt=""
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: 'blur(15px)',
                        opacity: 0.5,
                        transform: 'scale(1.2)'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x200?text=No+Image';
                      }}
                    />
                    <img
                      src={restaurant.imageUrl ? `${axiosInstance.defaults.baseURL}${RESTAURANT_API.IMAGE(restaurant.id)}` : 'https://placehold.co/400x200?text=No+Image'}
                      alt={restaurant.restaurantName}
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain' 
                      }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x200?text=No+Image';
                      }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2, pb: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" fontWeight={700} sx={{ mb: 0, lineHeight: 1.2 }}>
                      {restaurant.restaurantName}
                    </Typography>
                    <Chip 
                      label={restaurant.restaurantStatus} 
                      color={restaurant.restaurantStatus === 'OPEN' ? 'success' : 'default'}
                      size="small"
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem', ml: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                    {restaurant.cuisineType}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                    {restaurant.address}
                  </Typography>
                  
                  {restaurant.stations && restaurant.stations.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Serves at:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {restaurant.stations.slice(0, 3).map((station, index) => (
                          <Chip key={index} label={station} size="small" variant="outlined" />
                        ))}
                        {restaurant.stations.length > 3 && (
                          <Chip label={`+${restaurant.stations.length - 3} more`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                  )}

                  <Button 
                    variant="contained" 
                    fullWidth 
                    disabled={restaurant.restaurantStatus !== 'OPEN'}
                    onClick={() => handleSelectRestaurant(restaurant.id)}
                    sx={{ mt: 'auto' }}
                  >
                    View Menu
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RestaurantList;
