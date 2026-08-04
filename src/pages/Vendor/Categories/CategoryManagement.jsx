import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api/axiosInstance';
import { CATEGORY_API } from '../../../constants/apiEndpoints';
import CategoryModal from '../../../components/dashboard/vendor/CategoryModal';
const fetchCategories = async (restaurantId) => {
  const response = await api.get(CATEGORY_API.BY_RESTAURANT(restaurantId));
  return response.data.data; 
};
const CategoryManagement = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ['categories', restaurantId],
    queryFn: () => fetchCategories(restaurantId),
    enabled: !!restaurantId
  });
  const createMutation = useMutation({
    mutationFn: async (newCategory) => {
      const response = await api.post(CATEGORY_API.CREATE, { ...newCategory, restaurantId: Number(restaurantId) });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] });
      setModalOpen(false);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to create category.');
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put(CATEGORY_API.UPDATE(data.id), {
        categoryName: data.categoryName,
        description: data.description
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] });
      setEditingCategory(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to update category.');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (categoryId) => {
      await api.delete(CATEGORY_API.DELETE(categoryId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories', restaurantId] });
      setCategoryToDelete(null);
      setErrorMsg('');
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || 'Failed to delete category.');
    }
  });
  const handleCreateSubmit = (data) => {
    createMutation.mutate(data);
  };
  const handleUpdateSubmit = (data) => {
    updateMutation.mutate({ ...data, id: editingCategory.id });
  };
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
        <IconButton onClick={() => navigate('/vendor/restaurants')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} sx={{ flexGrow: 1 }}>
          Restaurant Menu (Categories)
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {
            setErrorMsg('');
            setModalOpen(true);
          }}
          sx={{ borderRadius: 2 }}
        >
          Add Menu Category
        </Button>
      </Box>
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Failed to load categories.</Alert>
      )}
      {categories.length === 0 && !isError ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h6" color="text.secondary">Menu are not present. Please add menu.</Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => {
              setErrorMsg('');
              setModalOpen(true);
            }}
            sx={{ mt: 2, borderRadius: 2 }}
          >
            Add Menu
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
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
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => navigate(`/vendor/categories/${category.id}/menu-items`)} title="Manage Menu Items">
                      <RestaurantMenuIcon />
                    </IconButton>
                    <IconButton color="primary" onClick={() => { setErrorMsg(''); setEditingCategory(category); }} title="Edit Category">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => { setErrorMsg(''); setCategoryToDelete(category); }} title="Delete Category">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {}
      <CategoryModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleCreateSubmit}
        isPending={createMutation.isPending}
        error={errorMsg}
      />
      <CategoryModal 
        open={Boolean(editingCategory)} 
        onClose={() => setEditingCategory(null)} 
        onSubmit={handleUpdateSubmit}
        isPending={updateMutation.isPending}
        error={errorMsg}
        initialData={editingCategory}
      />
      {}
      <Dialog disableEnforceFocus disableRestoreFocus open={Boolean(categoryToDelete)} onClose={() => setCategoryToDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          <Typography>
            Are you sure you want to delete the category <strong>{categoryToDelete?.categoryName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryToDelete(null)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={() => deleteMutation.mutate(categoryToDelete.id)}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default CategoryManagement;
