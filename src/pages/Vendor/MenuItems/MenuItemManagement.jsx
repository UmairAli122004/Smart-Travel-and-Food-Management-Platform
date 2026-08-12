import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, CircularProgress, Paper, Grid, Card, CardMedia, CardContent, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Switch, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { MENU_ITEM_API } from '../../../constants/apiEndpoints';
import MenuItemModal from '../../../components/dashboard/vendor/MenuItemModal';
import ErrorBoundary from '../../../components/common/ErrorBoundary';
import { ENV } from '../../../config/env';
import { optimizeCloudinaryUrl } from '../../../utils/cloudinary';
const fetchMenuItems = async (categoryId) => {
  const response = await api.get(`${MENU_ITEM_API.BY_CATEGORY(categoryId)}?page=0&size=100`);
  return response.data.data.content || [];
};
const MenuItemManagement = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const { data: menuItems = [], isLoading, isError } = useQuery({
    queryKey: ['menuItems', categoryId],
    queryFn: () => fetchMenuItems(categoryId),
    enabled: !!categoryId
  });
  const uploadImage = async (menuItemId, imageFile) => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append('image', imageFile);
    await api.post(MENU_ITEM_API.UPLOAD_IMAGE(menuItemId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { imageFile, ...payload } = data;
      const response = await api.post(MENU_ITEM_API.CREATE, { ...payload, categoryId: Number(categoryId) });
      const createdItem = response.data.data;
      if (imageFile) {
        await uploadImage(createdItem.id, imageFile);
      }
      return createdItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', categoryId] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create menu item.');
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const { imageFile, ...payload } = data;
      const response = await api.put(MENU_ITEM_API.UPDATE(payload.id), {
        menuName: payload.menuName,
        description: payload.description,
        foodType: payload.foodType,
        price: payload.price,
        available: payload.available,
        categoryId: payload.categoryId
      });
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await api.put(MENU_ITEM_API.UPLOAD_IMAGE(payload.id), formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', categoryId] });
      setEditingItem(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to update menu item.');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (menuItemId) => {
      await api.delete(MENU_ITEM_API.DELETE(menuItemId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', categoryId] });
      setItemToDelete(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to delete menu item.');
    }
  });
  const toggleAvailabilityMutation = useMutation({
    mutationFn: async ({ id, available }) => {
      await api.patch(MENU_ITEM_API.TOGGLE_AVAILABILITY(id), { available });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems', categoryId] });
    }
  });
  const handleCreateSubmit = (data) => {
    createMutation.mutate(data);
  };
  const handleUpdateSubmit = (data) => {
    updateMutation.mutate({ ...data, id: editingItem.id, categoryId: Number(categoryId) });
  };
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <ErrorBoundary>
      <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
          Manage Menu Items
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={(e) => {
            e.currentTarget.blur();
            setErrorMsg('');
            setModalOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add Menu Item
        </Button>
      </Box>
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load menu items.</Alert>
      )}
      {menuItems.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">Menu items are not present. Please add menu.</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={(e) => {
              e.currentTarget.blur();
              setErrorMsg('');
              setModalOpen(true);
            }}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Add Menu Item
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {menuItems.map((item) => {
            const rawImageUrl = item.imageUrl ? item.imageUrl : 'https://placehold.co/400x200?text=No+Image';
            const imageUrl = optimizeCloudinaryUrl(rawImageUrl, { width: 400, height: 200, crop: 'fill' });
            return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
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
                    <Typography variant="h6" fontWeight={600}>
                      {item.menuName}
                    </Typography>
                    <Typography variant="h6" color="primary.main" fontWeight={700}>
                      ₹{Number(item.price).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} mb={2}>
                    <Chip size="small" sx={{ textTransform: 'capitalize' }} label={item.foodType ? item.foodType.replace(/_/g, ' ').toLowerCase() : 'N/A'} color="default" />
                    <Chip size="small" label={item.available ? 'Available' : 'Unavailable'} color={item.available ? 'success' : 'error'} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {item.description && item.description.length > 60 ? (
                      <>
                        {expandedItems[item.id] ? item.description : `${item.description.substring(0, 60)}...`}
                        <Typography 
                          component="span" 
                          color="primary" 
                          sx={{ cursor: 'pointer', ml: 1, fontWeight: 500 }}
                          onClick={() => setExpandedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                        >
                          {expandedItems[item.id] ? 'See less' : 'See more'}
                        </Typography>
                      </>
                    ) : (
                      item.description
                    )}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
                    <FormControlLabel
                      control={
                        <Switch 
                          size="small" 
                          checked={item.available} 
                          onChange={(e) => toggleAvailabilityMutation.mutate({ id: item.id, available: e.target.checked })} 
                        />
                      }
                      label="Available"
                    />
                    <Box>
                      <IconButton color="primary" onClick={(e) => { e.currentTarget.blur(); setErrorMsg(''); setEditingItem(item); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={(e) => { e.currentTarget.blur(); setErrorMsg(''); setItemToDelete(item); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}
      <MenuItemModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
        error={errorMsg}
      />
      <MenuItemModal 
        open={Boolean(editingItem)} 
        onClose={() => setEditingItem(null)} 
        onSubmit={handleUpdateSubmit}
        isPending={updateMutation.isPending}
        error={errorMsg}
        initialData={editingItem}
      />
      <Dialog disableEnforceFocus disableRestoreFocus open={Boolean(itemToDelete)} onClose={() => setItemToDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          <Typography>
            Are you sure you want to delete <strong>{itemToDelete?.menuName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemToDelete(null)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => deleteMutation.mutate(itemToDelete.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </ErrorBoundary>
  );
};
export default MenuItemManagement;
