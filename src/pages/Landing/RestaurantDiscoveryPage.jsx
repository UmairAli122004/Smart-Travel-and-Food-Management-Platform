import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Divider, IconButton, Button } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import api from '../../api/axiosInstance';
import Topbar from '../../components/layout/Topbar';
import Footer from '../../components/layout/Footer';
import Loading from '../../components/common/Loading';
import { useCart } from '../../context/CartContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useAuth } from '../../context/AuthContext';

const RestaurantDiscoveryPage = () => {
  const [searchParams] = useSearchParams();
  const foodType = searchParams.get('foodType');
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const response = await api.get(`/api/restaurants/discover?foodType=${foodType}&size=20`);
        if (response.data.success) {
          setRestaurants(response.data.data.content);
        }
      } catch (error) {
        console.error('Error fetching discovery data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (foodType) {
      fetchDiscoveryData();
    } else {
      setLoading(false);
    }
  }, [foodType]);

  const handleAddToCart = (menuItem, restaurantId) => {
    try {
      // Pass null for journey and station since guest doesn't have them yet
      addToCart(menuItem, restaurantId, null, null, 1);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Topbar title="Discover Food" />
      
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Discovering: {foodType?.replace('_', ' ')}
          </Typography>
        </Box>

        {restaurants.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
            No restaurants found serving {foodType?.replace('_', ' ')}.
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} md={6} key={restaurant.restaurantId}>
                <Card sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)' }
                }}>
                  <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                        {restaurant.restaurantName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {restaurant.address}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          icon={<StarIcon sx={{ fontSize: '1rem' }} />} 
                          label={restaurant.averageRating > 0 ? restaurant.averageRating.toFixed(1) : 'New'} 
                          size="small"
                          color={restaurant.averageRating >= 4 ? "success" : "default"}
                          sx={{ fontWeight: 'bold', mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          ({restaurant.reviewCount} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ mx: 3 }} />
                  
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Top {foodType?.replace('_', ' ')} Picks
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {restaurant.topMenuItems.map((item) => {
                        const cartItem = cartItems.find(i => i.id === item.id);
                        const quantity = cartItem ? cartItem.quantity : 0;
                        
                        return (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box 
                              sx={{ 
                                width: 16, height: 16, border: '2px solid', 
                                borderColor: item.isVeg ? 'success.main' : 'error.main',
                                borderRadius: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'
                              }}
                            >
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.isVeg ? 'success.main' : 'error.main' }} />
                            </Box>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>{item.menuName}</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{item.price}</Typography>
                            </Box>
                          </Box>
                          {quantity > 0 ? (
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: 2,
                              overflow: 'hidden',
                              bgcolor: 'primary.light',
                              color: 'primary.contrastText',
                              height: 30
                            }}>
                              <Button 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity - 1); }}
                                sx={{ minWidth: 30, p: 0, color: 'inherit', borderRadius: 0 }}
                              >
                                -
                              </Button>
                              <Typography sx={{ px: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>
                                {quantity}
                              </Typography>
                              <Button 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, quantity + 1); }}
                                sx={{ minWidth: 30, p: 0, color: 'inherit', borderRadius: 0 }}
                              >
                                +
                              </Button>
                            </Box>
                          ) : (
                            <Button 
                              variant="outlined" 
                              color="primary"
                              size="small"
                              startIcon={<AddShoppingCartIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(item, restaurant.restaurantId);
                              }}
                              sx={{ borderRadius: 2, fontWeight: 600 }}
                            >
                              ADD
                            </Button>
                          )}
                        </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default RestaurantDiscoveryPage;
