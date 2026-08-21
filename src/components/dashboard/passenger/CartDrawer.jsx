import React, { useState, useEffect } from 'react';
import { 
  Drawer, Box, Typography, IconButton, Divider, 
  Button, List, ListItem, CircularProgress, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import axiosInstance from '../../../api/axiosInstance';
import { ORDER_API } from '../../../constants/apiEndpoints';
import OrderConfirmationModal from './OrderConfirmationModal';

const CartDrawer = ({ open, onClose }) => {
  const { 
    cartItems, 
    journeyId, 
    restaurantId, 
    stationId,
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    clearCart 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setConfirmationOpen(false);
    setPlacedOrder(null);
    setError('');
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuthenticated]);

  const handlePlaceOrder = async () => {
    const normalizedRole = role?.startsWith('ROLE_') ? role.substring(5) : role;
    if (!isAuthenticated || normalizedRole !== 'PASSENGER') {
      sessionStorage.setItem('pendingOrder', 'true');
      navigate('/login');
      onClose();
      return;
    }

    if (!journeyId) {
      sessionStorage.setItem('pendingOrder', 'true');
      navigate('/passenger/order');
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError('');

      let finalStationId = stationId;
      if (!finalStationId) {
        try {
          const stationRes = await axiosInstance.get('/api/stations/search?page=0&size=1');
          if (stationRes.data?.data?.content?.length > 0) {
            finalStationId = stationRes.data.data.content[0].id;
          } else {
            throw new Error("No stations available in the system for delivery.");
          }
        } catch (err) {
          throw new Error("Could not find a valid delivery station: " + err.message);
        }
      }

      const itemsByRestaurant = cartItems.reduce((acc, item) => {
        const restId = item.restaurantId || restaurantId;
        if (!acc[restId]) acc[restId] = [];
        acc[restId].push({
          menuItemId: item.id,
          quantity: item.quantity
        });
        return acc;
      }, {});

      const placedOrders = [];

      for (const [restId, items] of Object.entries(itemsByRestaurant)) {
        const orderPayload = {
          journeyId: journeyId,
          restaurantId: Number(restId),
          stationId: finalStationId,
          items: items
        };

        // const idempotencyKey = crypto.randomUUID();
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const response = await axiosInstance.post(ORDER_API.CREATE, orderPayload, {
          headers: {
            'Idempotency-Key': idempotencyKey
          }
        });
        placedOrders.push(response.data.data);
      }

      setPlacedOrder(placedOrders);
      setConfirmationOpen(true);
      clearCart();
    } catch (err) {
      console.error('Order creation failed:', err);
      if (err.response?.status === 404) {
        setError("Your profile is incomplete. Please complete your profile to place an order.");
        setTimeout(() => {
          navigate('/passenger/profile-setup');
          onClose();
        }, 2000);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setPlacedOrder(null);
    onClose();
  };

  return (
    <>
      <Drawer 
        anchor="right" 
        open={open} 
        onClose={onClose}
        sx={{
          '& .MuiDrawer-paper': {
            m: 2, 
            height: 'calc(100vh - 32px)', 
            borderRadius: 4, 
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)'
          }
        }}
      >
        <Box sx={{ width: { xs: 300, sm: 350 }, display: 'flex', flexDirection: 'column', bgcolor: '#f4f4f5', height: '100%' }}>
          
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="800" sx={{ fontSize: '1.1rem', color: '#3d4152' }}>Cart</Typography>
            </Box>
            <IconButton color="inherit" onClick={onClose} size="small" sx={{ color: '#3d4152' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#fff', mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {cartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 10 }}>
                <ShoppingCartIcon sx={{ fontSize: 40, color: '#e0e0e0', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#7e808c', fontWeight: 600 }}>Your cart is empty</Typography>
                <Typography variant="body2" sx={{ color: '#93959f', mt: 1 }}>You can go to home page to view more restaurants</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {cartItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem sx={{ alignItems: "flex-start", px: 0, py: 2 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => removeFromCart(item.id)} 
                        sx={{ mt: -0.5, mr: 1, color: '#93959f', bgcolor: '#f4f4f5', width: 20, height: 20, '&:hover': { bgcolor: '#e0e0e0' } }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 14, height: 14, border: '1px solid', borderColor: item.isVeg ? '#0f8a65' : '#e43b4f', borderRadius: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center', mr: 1 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.isVeg ? '#0f8a65' : '#e43b4f' }} />
                            </Box>
                            <Typography fontWeight="600" sx={{ fontSize: '0.95rem', color: '#3d4152' }}>{item.menuName}</Typography>
                          </Box>
                          <Typography fontWeight="700" sx={{ fontSize: '0.95rem', color: '#3d4152' }}>
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 1, bgcolor: '#fff', height: 32 }}>
                            <IconButton 
                              size="small" 
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                              sx={{ p: 0.5, color: '#686b78', borderRadius: 0, width: 32 }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Typography sx={{ px: 1.5, minWidth: 20, textAlign: 'center', fontSize: '0.9rem', fontWeight: 600, color: '#3d4152' }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                              sx={{ p: 0.5, color: '#686b78', borderRadius: 0, width: 32 }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </ListItem>
                    <Divider component="li" sx={{ borderColor: '#f0f0f5' }} />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box sx={{ bgcolor: '#fff', mt: 1 }}>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#3d4152', mb: 1 }}>Bill Details</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#686b78' }}>Item Total</Typography>
                  <Typography variant="body2" sx={{ color: '#686b78' }}>₹{Number(cartTotal).toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#3d4152' }}>To Pay</Typography>
                  <Typography variant="subtitle2" fontWeight="800" sx={{ color: '#3d4152' }}>
                    ₹{Number(cartTotal).toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  sx={{ py: 1.2, fontSize: '0.95rem', fontWeight: 700, borderRadius: 1.5, textTransform: 'none', bgcolor: '#60b246', '&:hover': { bgcolor: '#519c3b' }, boxShadow: '0 2px 8px rgba(96, 178, 70, 0.4)' }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>

      <OrderConfirmationModal 
        open={confirmationOpen} 
        onClose={handleCloseConfirmation} 
        order={placedOrder} 
      />
    </>
  );
};

export default CartDrawer;
