import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';

const ComplaintTypeOptions = [
  { value: 'FOOD_QUALITY', label: 'Food Quality' },
  { value: 'HYGIENE', label: 'Hygiene' },
  { value: 'DELIVERY', label: 'Delivery' },
  { value: 'BEHAVIOUR', label: 'Behaviour' },
  { value: 'PAYMENT', label: 'Payment' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'OTHER', label: 'Other' }
];

const ComplaintForm = ({ open, onClose, onSubmit, order, isSubmitting, error }) => {
  const [formData, setFormData] = useState({
    complaintType: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (open) {
      setFormData({
        complaintType: '',
        title: '',
        description: ''
      });
    }
  }, [open, order]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order) return;
    
    onSubmit({
      orderId: order.id,
      ...formData
    });
  };

  const handleClose = () => {
    setFormData({ complaintType: '', title: '', description: '' });
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>File a Complaint (Order {order.id})</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          
          <TextField
            select
            label="Complaint Type"
            name="complaintType"
            value={formData.complaintType}
            onChange={handleChange}
            required
            fullWidth
          >
            {ComplaintTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            inputProps={{ minLength: 5, maxLength: 200 }}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
            inputProps={{ minLength: 10, maxLength: 1000 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || !formData.complaintType || !formData.title || !formData.description}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            Submit Complaint
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ComplaintForm;
