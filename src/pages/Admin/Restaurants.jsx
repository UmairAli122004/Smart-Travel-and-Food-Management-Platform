import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  CircularProgress,
  Divider,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarRateIcon from '@mui/icons-material/StarRate';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import useDebounce from '../../hooks/useDebounce';
import SectionLoader from '../../components/dashboard/SectionLoader';
import ErrorAlert from '../../components/dashboard/ErrorAlert';
import { ENV } from '../../config/env';

const fetchAllRestaurants = async ({ queryKey }) => {
  const [_key, page, size, sortBy, direction] = queryKey;
  // Use the existing generic get all restaurants endpoint which is accessible by ADMIN
  const response = await api.get('/api/restaurants', {
    params: { page, size, sortBy, direction }
  });
  return response.data.data;
};

const AdminRestaurants = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50); // Large size to fetch many, could implement full pagination

  const { data: pageData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminRestaurants', page, size, 'id', 'desc'],
    queryFn: fetchAllRestaurants
  });

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorAlert message={error?.message || 'Failed to fetch restaurants'} onRetry={refetch} />;

  let restaurants = pageData?.content || [];

  // Local filtering since backend doesn't have search/filter endpoint for restaurants out of the box in this controller snippet
  if (debouncedSearchTerm) {
    restaurants = restaurants.filter(r => 
      r.restaurantName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      r.cuisineType.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }

  if (statusFilter !== 'ALL') {
    restaurants = restaurants.filter(r => r.restaurantStatus === statusFilter);
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Restaurant Management
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Search Restaurants"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="By name, cuisine, address..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All Statuses</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {restaurants.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10, backgroundColor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
          <StorefrontIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No restaurants found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => {
            const timestamp = restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now();
            const imageUrl = restaurant.imageUrl 
              ? `${ENV.API_BASE_URL}${restaurant.imageUrl}?t=${timestamp}` 
              : 'https://via.placeholder.com/400x200?text=No+Image';
            
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={restaurant.id}>
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
                    
                    <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                       <Typography variant="caption" color="text.secondary" component="div" sx={{ fontWeight: 500 }}>
                         Vendor Name: {restaurant.vendorName}
                       </Typography>
                       <Typography variant="caption" color="text.secondary" component="div">
                         Created: {new Date(restaurant.createdAt).toLocaleDateString()}
                       </Typography>
                    </Box>
                  </CardContent>
                  <Divider />
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafbfc' }}>
                    <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<MenuBookIcon />} 
                        onClick={() => navigate(`/admin/restaurants/${restaurant.id}/menu-items`)}
                        size="small"
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                      >
                        Menu
                      </Button>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        startIcon={<StarRateIcon />} 
                        onClick={() => navigate(`/admin/restaurants/${restaurant.id}/reviews`)}
                        size="small"
                        sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
                      >
                        Reviews
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default AdminRestaurants;
