import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, Typography, Box, Divider, Paper 
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';

const OrderConfirmationModal = ({ open, onClose, order }) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onClose();
    navigate('/passenger/dashboard');
  };

  if (!order) return null;

  const isMultiple = Array.isArray(order) && order.length > 1;
  const orderList = Array.isArray(order) ? order : [order];

  return (
    <Dialog 
      disableEnforceFocus 
      disableRestoreFocus 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" // Made compact and smart
      fullWidth
      sx={{
        '& .MuiDialog-paper': { borderRadius: 3, overflow: 'hidden', m: 2 }
      }}
    >
      <Box sx={{ bgcolor: '#4caf50', py: 3, textAlign: 'center', color: '#fff' }}>
        <Box 
          sx={{ 
            width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', mx: 'auto', mb: 2
          }}
        >
          <CheckRoundedIcon sx={{ fontSize: 40, color: '#fff' }} />
        </Box>
        <Typography variant="h5" fontWeight="700">
          {isMultiple ? 'Orders Placed Successfully!' : 'Order Placed Successfully!'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          Your food is being prepared.
        </Typography>
      </Box>
      
      <DialogContent sx={{ p: 0, maxHeight: '50vh', overflowY: 'auto', bgcolor: '#f8f9fa' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
            Delivery at <strong>{orderList[0].station?.stationName || orderList[0].stationName || 'the station'}</strong>
            {orderList[0].passengerPhone && (
              <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                Phone: <strong>{orderList[0].passengerPhone}</strong>
              </Box>
            )}
          </Typography>
          
          {orderList.map((singleOrder) => (
            <Paper 
              key={singleOrder.id} 
              elevation={0} 
              sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #eaeaea', bgcolor: '#fff' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <ReceiptLongIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ flexGrow: 1, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 0.5 }}>
                  Order #{singleOrder.id}
                </Typography>
                <Typography variant="caption" fontWeight="bold" color={singleOrder.paymentStatus === 'SUCCESS' ? 'success.main' : 'warning.main'}>
                  {singleOrder.paymentStatus}
                </Typography>
              </Box>
              
              <Divider sx={{ borderStyle: 'dashed', my: 1.5 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" fontWeight="600" color="text.primary">
                  {singleOrder.restaurant?.restaurantName}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                <Typography variant="body2" fontWeight="700" color="text.primary">
                  ₹{Number(singleOrder.grandTotal || 0).toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          ))}
          
          {isMultiple && (
            <Box sx={{ mt: 1, p: 2, bgcolor: '#e8f5e9', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight="700" color="#2e7d32">Grand Total</Typography>
              <Typography variant="subtitle1" fontWeight="800" color="#2e7d32">
                ₹{orderList.reduce((sum, o) => sum + Number(o.grandTotal || 0), 0).toFixed(2)}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <Button 
          variant="outlined" 
          onClick={onClose} 
          fullWidth
          sx={{ py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600, color: 'text.primary', borderColor: '#d0d0d0' }}
        >
          Close
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleGoToDashboard}
          fullWidth
          sx={{ py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
        >
          Track Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderConfirmationModal;
