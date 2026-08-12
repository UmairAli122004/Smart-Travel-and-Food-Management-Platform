import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Chip, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarRateIcon from '@mui/icons-material/StarRate';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import CreateRestaurantModal from '../../components/dashboard/vendor/CreateRestaurantModal';
import EditRestaurantModal from '../../components/dashboard/vendor/EditRestaurantModal';
import { ENV } from '../../config/env';
import { optimizeCloudinaryUrl } from '../../utils/cloudinary';
const fetchMyRestaurants = async () => {
  const response = await api.get('/api/restaurants/vendor/my-restaurants');
  return response.data.data; 
};
const VendorRestaurants = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const { data: pageData, isLoading, isError } = useQuery({
    queryKey: ['myRestaurants'],
    queryFn: fetchMyRestaurants
  });
  const deleteMutation = useMutation({
    mutationFn: async (restaurantId) => {
      await api.delete(`/api/restaurants/${restaurantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRestaurants'] });
      queryClient.invalidateQueries({ queryKey: ['vendor'] });
      setRestaurantToDelete(null);
      setDeleteError('');
    },
    onError: (err) => {
      setDeleteError(err.response?.data?.message || 'Failed to delete restaurant.');
    }
  });
  const restaurants = pageData?.content || [];
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="error">Failed to load restaurants.</Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700}>
          My Restaurants
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={(e) => { e.currentTarget.blur(); setModalOpen(true); }}
          sx={{ borderRadius: 2 }}
        >
          Add Restaurant
        </Button>
      </Box>
      {restaurants.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <StorefrontIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            You haven't created any restaurants yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Create your first restaurant to start managing menus and receiving orders.
          </Typography>
          <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={(e) => { e.currentTarget.blur(); setModalOpen(true); }}>
            Create Restaurant
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => {
            const timestamp = restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now();
            const rawImageUrl = restaurant.imageUrl ? restaurant.imageUrl : 'https://placehold.co/400x200?text=No+Image';
            const imageUrl = optimizeCloudinaryUrl(rawImageUrl, { width: 400, height: 200, crop: 'fill' });
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
                <Card sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: 4, 
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)', 
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                  '&:hover': { 
                    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-5px)'
                  },
                  overflow: 'hidden',
                  bgcolor: 'background.paper'
                }}>
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
                        src={imageUrl} 
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
                        src={imageUrl} 
                        alt={restaurant.restaurantName} 
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
                <CardContent sx={{ p: 2, pb: 1, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6" component="h2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
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
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {restaurant.address}
                  </Typography>
                </CardContent>
                <Divider />
                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafbfc' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<MenuBookIcon />} 
                      onClick={() => navigate(`/vendor/restaurants/${restaurant.id}/categories`)}
                      size="small"
                      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                      Menu
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<StarRateIcon />} 
                      onClick={() => navigate(`/vendor/restaurants/${restaurant.id}/reviews`)}
                      size="small"
                      sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                    >
                      Reviews
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      color="primary" 
                      size="small" 
                      onClick={(e) => { e.currentTarget.blur(); setEditingRestaurant(restaurant); }}
                      aria-label="edit restaurant"
                      sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)', '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.15)' } }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      size="small" 
                      onClick={(e) => {
                        e.currentTarget.blur();
                        setDeleteError('');
                        setRestaurantToDelete(restaurant);
                      }}
                      aria-label="delete restaurant"
                      sx={{ backgroundColor: 'rgba(211, 47, 47, 0.08)', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.15)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
        </Grid>
      )}
      <CreateRestaurantModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <EditRestaurantModal 
        open={Boolean(editingRestaurant)} 
        restaurant={editingRestaurant} 
        onClose={() => setEditingRestaurant(null)} 
      />
      <Dialog disableEnforceFocus disableRestoreFocus open={Boolean(restaurantToDelete)} onClose={() => setRestaurantToDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {deleteError && <Alert severity="error" sx={{ mb: 2 }}>{deleteError}</Alert>}
          <Typography>
            Are you sure you want to delete <strong>{restaurantToDelete?.restaurantName}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestaurantToDelete(null)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => deleteMutation.mutate(restaurantToDelete.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default VendorRestaurants;
