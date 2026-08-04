import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
const schema = yup.object().shape({
  menuName: yup.string().required('Menu name is required').max(150),
  description: yup.string().max(500),
  foodType: yup.string().required('Food type is required'),
  price: yup.number().typeError('Must be a number').min(0.01, 'Must be greater than zero').required('Price is required'),
  available: yup.boolean()
});
const FoodTypes = [
  'BEVERAGE', 'BREAKFAST', 'CHICKEN', 'DAIRY_FREE', 'DESSERT', 
  'DINNER', 'EGG', 'FAST_FOOD', 'GLUTEN_FREE', 'HEALTHY', 'HIGH_PROTEIN', 
  'LOW_CARB', 'LUNCH', 'MUTTON', 'NON_VEG', 
  'SEAFOOD', 'SNACK', 'VEG', 'VEGAN'
];
const MenuItemModal = ({ open, onClose, onSubmit, isPending, error, initialData = null }) => {
  const [imageFile, setImageFile] = useState(null);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      menuName: '',
      description: '',
      foodType: 'VEG',
      price: '',
      available: true
    }
  });
  useEffect(() => {
    if (open) {
      setImageFile(null);
      if (initialData) {
        reset({
          menuName: initialData.menuName || '',
          description: initialData.description || '',
          foodType: initialData.foodType || 'VEG',
          price: initialData.price || '',
          available: initialData.available !== false
        });
      } else {
        reset({
          menuName: '',
          description: '',
          foodType: 'VEG',
          price: '',
          available: true
        });
      }
    }
  }, [open, initialData, reset]);
  const handleFormSubmit = (data) => {
    onSubmit({ ...data, imageFile });
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initialData ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Controller
            name="menuName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="dense"
                size="small"
                label="Menu Item Name"
                error={!!errors.menuName}
                helperText={errors.menuName?.message}
              />
            )}
          />
          <Controller
            name="foodType"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                fullWidth
                margin="dense"
                size="small"
                label="Food Type"
                error={!!errors.foodType}
                helperText={errors.foodType?.message}
              >
                {FoodTypes.map((type) => (
                  <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                    {type.replace(/_/g, ' ').toLowerCase()}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="dense"
                size="small"
                label="Price"
                type="number"
                inputProps={{ step: "0.01" }}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                margin="dense"
                size="small"
                label="Description"
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />
          <Controller
            name="available"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={value} onChange={onChange} />}
                label="Available"
                sx={{ mt: 1 }}
              />
            )}
          />
          <div style={{ marginTop: '16px' }}>
            <Button variant="outlined" size="small" component="label">
              Upload Image
              <input 
                type="file" 
                hidden 
                accept="image/jpeg,image/png" 
                onChange={(e) => setImageFile(e.target.files[0])} 
              />
            </Button>
            {imageFile && <span style={{ marginLeft: '10px' }}>{imageFile.name}</span>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default MenuItemModal;
