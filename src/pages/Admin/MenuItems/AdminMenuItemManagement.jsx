import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQuery } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { MENU_ITEM_API } from '../../../constants/apiEndpoints';
import { ENV } from '../../../config/env';

const fetchMenuItems = async (restaurantId) => {
  const response = await api.get(MENU_ITEM_API.BY_RESTAURANT(restaurantId));
  return response.data.data;
};

const AdminMenuItemManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const { data: pageData, isLoading, isError } = useQuery({
    queryKey: ['adminMenuItems', restaurantId],
    queryFn: () => fetchMenuItems(restaurantId),
    enabled: !!restaurantId
  });

  const menuItems = pageData?.content || [];

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
        <IconButton onClick={() => navigate(`/admin/restaurants`)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
          Menu Items (Read-Only)
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load menu items.</Alert>
      )}

      {menuItems.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">No menu items found for this restaurant.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Image</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menuItems.map((item) => {
                const imageUrl = item.imageUrl ? item.imageUrl : 'https://placehold.co/400x200?text=No+Image';
                
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Box
                        component="img"
                        src={imageUrl}
                        alt={item.menuName}
                        sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell fontWeight="medium">{item.menuName}</TableCell>
                    <TableCell>{item.description || '-'}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <Chip 
                        label={item.available ? "Available" : "Unavailable"} 
                        color={item.available ? "primary" : "default"}
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminMenuItemManagement;
