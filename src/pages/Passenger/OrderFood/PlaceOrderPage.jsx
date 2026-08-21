import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Card, Divider, Button, 
  List, ListItem, ListItemText, CircularProgress, Alert, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import axiosInstance from '../../../api/axiosInstance';
import { ORDER_API, PASSENGER_API, JOURNEY_API, RESTAURANT_API, STATION_API } from '../../../constants/apiEndpoints';
import OrderConfirmationModal from '../../../components/dashboard/passenger/OrderConfirmationModal';
import { format } from 'date-fns';

const PlaceOrderPage = () => {
  const { 
    cartItems, 
    journeyId, 
    restaurantId, 
    stationId,
    updateQuantity, 
    addToCart,
    cartTotal, 
    clearCart 
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(true);
  const [error, setError] = useState('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const [passengerDetails, setPassengerDetails] = useState(null);
  const [journeyDetails, setJourneyDetails] = useState(null);
  const [restaurantDetails, setRestaurantDetails] = useState(null);
  const [deliveryStationDetails, setDeliveryStationDetails] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const subtotal = Number(cartTotal);
  const gst = subtotal * 0.05;
  const deliveryCharge = 40.0;
  const grandTotal = subtotal + gst + deliveryCharge;

  useEffect(() => {
    if (isAuthenticated && !journeyId && cartItems.length > 0) {
      sessionStorage.setItem('pendingOrder', 'true');
      navigate('/passenger/order');
      return;
    }

    const pendingOrderRaw = sessionStorage.getItem('pendingOrder');
    if (pendingOrderRaw && isAuthenticated) {
      try {
        const pendingOrder = JSON.parse(pendingOrderRaw);
        if (pendingOrder && pendingOrder.item) {
           addToCart(pendingOrder.item, pendingOrder.restaurantId, null, null, pendingOrder.quantity);
        }
        if (pendingOrder !== 'true') {
           sessionStorage.removeItem('pendingOrder');
        }
      } catch (e) {
        if (pendingOrderRaw === 'true') {
           sessionStorage.removeItem('pendingOrder');
        } else {
           console.error("Failed to restore pending order", e);
        }
      }
    }
  }, [isAuthenticated, journeyId, cartItems, addToCart, navigate]);

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      if (!isAuthenticated || !journeyId || cartItems.length === 0) return;
      
      setFetchingDetails(true);
      try {
        const passRes = await axiosInstance.get(PASSENGER_API.ME);
        setPassengerDetails(passRes.data.data);

        const journeyRes = await axiosInstance.get(JOURNEY_API.GET_BY_ID(journeyId));
        setJourneyDetails(journeyRes.data.data);

        const restId = cartItems[0]?.restaurantId || restaurantId;
        if (restId) {
          const restRes = await axiosInstance.get(RESTAURANT_API.BY_ID(restId));
          setRestaurantDetails(restRes.data.data);
        }

        let fetchStationId = stationId;
        if (!fetchStationId) {
          const stationRes = await axiosInstance.get('/api/stations/search?page=0&size=1');
          if (stationRes.data?.data?.content?.length > 0) {
            fetchStationId = stationRes.data.data.content[0].id;
          }
        }
        if (fetchStationId) {
          const statRes = await axiosInstance.get(STATION_API.BY_ID(fetchStationId));
          setDeliveryStationDetails(statRes.data.data);
        }

      } catch (err) {
        console.error("Failed to fetch checkout details", err);
      } finally {
        setFetchingDetails(false);
      }
    };
    fetchCheckoutDetails();
  }, [isAuthenticated, journeyId, cartItems, restaurantId, stationId]);

  const handlePlaceOrder = async () => {
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
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setPlacedOrder(null);
    navigate('/passenger/orders');
  };

  if (fetchingDetails) {
    return (
      <Container sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" fontWeight="800" sx={{ mb: 4 }}>Order Confirmation</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Passenger Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>Name:</strong> {user?.username}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {user?.phone || 'Not Provided'}</Typography>
          </Card>

          <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Journey Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>PNR:</strong> {journeyDetails?.pnrNumber}</Typography>
            <Typography variant="body1"><strong>Train:</strong> {journeyDetails?.trainName} ({journeyDetails?.trainNumber})</Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {journeyDetails?.boardingDate ? format(new Date(`${journeyDetails.boardingDate}T${journeyDetails.boardingTime || '00:00'}`), 'MMM dd, yyyy hh:mm a') : '-'}
            </Typography>
            <Typography variant="body1"><strong>Seat/Coach:</strong> {journeyDetails?.seatNumber} / {journeyDetails?.coachNumber}</Typography>
          </Card>

          <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Delivery Details</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>Station:</strong> {deliveryStationDetails?.stationName} {deliveryStationDetails?.stationCode ? `(${deliveryStationDetails?.stationCode})` : ''}</Typography>
            <Typography variant="body1"><strong>Payment Method:</strong> Cash on Delivery (COD)</Typography>
          </Card>
          
        </Box>

        <Box sx={{ flex: 1.5 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCartIcon color="primary" sx={{ mr: 1, fontSize: 22 }} />
              <Typography variant="h6" fontWeight="700">Order Summary</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: 'text.secondary' }}>
              Restaurant: {restaurantDetails?.name || 'Multiple Restaurants'}
            </Typography>

            {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">Your cart is empty.</Typography>
            <Button variant="outlined" sx={{ mt: 2, borderRadius: 2 }} onClick={() => navigate('/')}>
              Browse Food
            </Button>
          </Box>
        ) : (
          <>
            <List disablePadding sx={{ maxHeight: '35vh', overflowY: 'auto', pr: 1 }}>
              {cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem sx={{ px: 0, py: 1.5, alignItems: "flex-start" }}>
                    <ListItemText
                      primary={<Typography fontWeight="600" sx={{ fontSize: '0.95rem' }}>{item.menuName}</Typography>}
                      secondary={<Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{`₹${Number(item.price).toFixed(2)} x ${item.quantity}`}</Typography>}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography fontWeight="700" sx={{ mb: 1, color: 'primary.main', fontSize: '0.95rem' }}>
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ p: 0.5, borderRadius: 0 }}>
                          {item.quantity === 1 ? <DeleteIcon sx={{ fontSize: 16 }} color="error" /> : <RemoveIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
                        <Typography sx={{ px: 1.5, minWidth: 20, textAlign: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ p: 0.5, borderRadius: 0 }}>
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </ListItem>
                  <Divider component="li" sx={{ opacity: 0.6 }} />
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ mt: 3, mb: 3, p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" fontWeight="bold">₹{subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">GST (5%)</Typography>
                <Typography variant="body2" fontWeight="bold">₹{gst.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">Delivery Charges</Typography>
                <Typography variant="body2" fontWeight="bold">₹{deliveryCharge.toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight="700">Grand Total</Typography>
                <Typography variant="h6" fontWeight="800" color="primary.main">
                  ₹{grandTotal.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={() => navigate(-1)}
                disabled={loading}
                sx={{ py: 1.2, fontWeight: 'bold', borderRadius: 2, textTransform: 'none' }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handlePlaceOrder}
                disabled={loading}
                sx={{ py: 1.2, fontWeight: 'bold', borderRadius: 2, textTransform: 'none', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)' }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Processing...' : 'Confirm Order'}
              </Button>
            </Box>
          </>
        )}
          </Card>
        </Box>
      </Box>
      
      <OrderConfirmationModal 
        open={confirmationOpen} 
        onClose={handleCloseConfirmation} 
        order={placedOrder} 
      />
    </Container>
  );
};

export default PlaceOrderPage;
