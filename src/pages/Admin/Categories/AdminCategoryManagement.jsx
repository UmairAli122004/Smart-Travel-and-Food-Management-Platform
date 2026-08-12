import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { CATEGORY_API } from '../../../constants/apiEndpoints';

const fetchCategories = async (restaurantId) => {
  // Use generic endpoint
  const response = await api.get(CATEGORY_API.BY_RESTAURANT(restaurantId));
  return response.data.data; 
};

const AdminCategoryManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['adminCategories', restaurantId],
    queryFn: () => fetchCategories(restaurantId),
    enabled: !!restaurantId
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/admin/restaurants')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
          Restaurant Categories (Read-Only)
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load categories.</Alert>
      )}

      {categories.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">No categories found for this restaurant.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>{category.id}</TableCell>
                  <TableCell fontWeight="medium">{category.categoryName}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    <IconButton color="info" onClick={() => navigate(`/admin/restaurants/${restaurantId}/categories/${category.id}/menu-items`)} title="View Menu Items">
                      <RestaurantMenuIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminCategoryManagement;
