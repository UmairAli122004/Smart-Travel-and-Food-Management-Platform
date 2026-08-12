import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, CircularProgress, Alert, 
  IconButton, CardMedia, Paper, Tabs, Tab, Button, Grid,
  Card, CardContent, Divider, Rating, Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import axiosInstance from '../../../api/axiosInstance';
import { RESTAURANT_API, CATEGORY_API, MENU_ITEM_API, REVIEW_API } from '../../../constants/apiEndpoints';
import { useCart } from '../../../context/CartContext';
import { format } from 'date-fns';
import { ENV } from '../../../config/env';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`restaurant-tabpanel-${index}`}
      aria-labelledby={`restaurant-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const RestaurantDetails = () => {
  const { journeyId, restaurantId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, updateQuantity } = useCart();
  
  const [restaurant, setRestaurant] = useState(null);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [reviews, setReviews] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchRestaurantDetails();
  }, [restaurantId]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      // Fetch restaurant basic info
      const restRes = await axiosInstance.get(RESTAURANT_API.BY_ID(restaurantId));
      setRestaurant(restRes.data.data);

      // Fetch rating summary
      const ratingRes = await axiosInstance.get(REVIEW_API.RATING_SUMMARY(restaurantId));
      setRatingSummary(ratingRes.data.data);

      // Fetch categories
      const catRes = await axiosInstance.get(CATEGORY_API.BY_RESTAURANT(restaurantId));
      const fetchedCategories = catRes.data.data || [];
      setCategories(fetchedCategories);

      // Fetch menu items for each category
      const menuPromises = fetchedCategories.map(cat => 
        axiosInstance.get(`${MENU_ITEM_API.BY_CATEGORY(cat.id)}?page=0&size=100`)
      );
      const menuResponses = await Promise.all(menuPromises);
      
      const newMenuItems = {};
      fetchedCategories.forEach((cat, index) => {
        newMenuItems[cat.id] = menuResponses[index].data.data.content;
      });
      setMenuItems(newMenuItems);

      // Fetch reviews
      const revRes = await axiosInstance.get(`${REVIEW_API.BY_RESTAURANT(restaurantId)}?page=0&size=20`);
      setReviews(revRes.data.data.content || []);

      setError('');
    } catch (err) {
      console.error('Error fetching restaurant details:', err);
      setError('Failed to load restaurant details.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCartQuantity = (menuItemId) => {
    const item = cartItems.find(item => item.id === menuItemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (menuItem) => {
    try {
      // Use the first stationId as a fallback if the restaurant has multiple
      const defaultStationId = restaurant.stationIds && restaurant.stationIds.length > 0 ? restaurant.stationIds[0] : null;
      addToCart(menuItem, parseInt(restaurantId), parseInt(journeyId), defaultStationId);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Restaurant not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(`/passenger/order/${journeyId}/restaurants`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">Back to Restaurants</Typography>
      </Box>

      {/* Restaurant Banner */}
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
        <CardMedia
          component="img"
          height="300"
          image={restaurant.imageUrl ? restaurant.imageUrl : 'https://placehold.co/1200x300?text=No+Image'}
          alt={restaurant.restaurantName}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://placehold.co/1200x300?text=No+Image';
          }}
        />
        <Box sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {restaurant.restaurantName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {restaurant.cuisineType} • {restaurant.address}
              </Typography>
              {ratingSummary && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={ratingSummary.averageRating} precision={0.1} readOnly size="large" />
                  <Typography variant="body1" sx={{ ml: 1, fontWeight: 'bold' }}>
                    {ratingSummary.averageRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({ratingSummary.totalReviews} reviews)
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="restaurant tabs">
            <Tab label="Menu" id="restaurant-tab-0" aria-controls="restaurant-tabpanel-0" />
            <Tab label="Reviews" id="restaurant-tab-1" aria-controls="restaurant-tabpanel-1" />
          </Tabs>
        </Box>

        {/* Menu Tab */}
        <TabPanel value={tabValue} index={0}>
          {categories.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No menu items available right now.</Typography>
          ) : (
            categories.map(category => (
              <Box key={category.id} sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                  {category.categoryName}
                </Typography>
                {category.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {category.description}
                  </Typography>
                )}
                
                <Grid container spacing={3}>
                  {(menuItems[category.id] || []).map(item => {
                    const quantity = getCartQuantity(item.id);
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
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
                                src={item.imageUrl ? item.imageUrl : 'https://placehold.co/400x200?text=No+Image'}
                                alt=""
                                loading="lazy"
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
                              />
                              <img
                                src={item.imageUrl ? item.imageUrl : 'https://placehold.co/400x200?text=No+Image'}
                                alt={item.menuName}
                                loading="lazy"
                                style={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'contain' 
                                }}
                              />
                            </Box>
                          </Box>
                          <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {item.menuName}
                              </Typography>
                              <Typography variant="h6" color="primary.main" fontWeight="bold">
                                ₹{Number(item.price).toFixed(2)}
                              </Typography>
                            </Box>
                            
                            {item.foodType && (
                              <Box mb={2}>
                                <Chip size="small" sx={{ textTransform: 'capitalize' }} label={item.foodType.replace(/_/g, ' ').toLowerCase()} color="default" />
                              </Box>
                            )}

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                              {item.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pt: 2, borderTop: '1px solid #f0f0f0' }}>
                              {!item.available ? (
                                <Typography variant="body2" color="error" fontWeight="bold">Unavailable</Typography>
                              ) : quantity === 0 ? (
                                <Button 
                                  variant="outlined" 
                                  color="primary" 
                                  fullWidth
                                  startIcon={<AddShoppingCartIcon />}
                                  onClick={() => handleAddToCart(item)}
                                >
                                  Add to Cart
                                </Button>
                              ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.light', borderRadius: 2, p: 0.5, width: '100%' }}>
                                  <IconButton 
                                    size="small" 
                                    color="primary" 
                                    onClick={() => updateQuantity(item.id, quantity - 1)}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                  <Typography sx={{ px: 3, fontWeight: 'bold' }}>{quantity}</Typography>
                                  <IconButton 
                                    size="small" 
                                    color="primary" 
                                    onClick={() => updateQuantity(item.id, quantity + 1)}
                                  >
                                    <AddIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
                {(!menuItems[category.id] || menuItems[category.id].length === 0) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No items in this category.
                  </Typography>
                )}
              </Box>
            ))
          )}
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={1}>
          {reviews.length === 0 ? (
            <Typography variant="body1" color="text.secondary">No reviews yet.</Typography>
          ) : (
            <Grid container spacing={3}>
              {reviews.map(review => (
                <Grid size={{ xs: 12 }} key={review.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.passengerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(review.createdAt), 'MMM dd, yyyy HH:mm')}
                          </Typography>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {review.comment}
                      </Typography>
                      {review.vendorReply && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold" color="primary">
                            Reply from Restaurant:
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {review.vendorReply}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
};

export default RestaurantDetails;
