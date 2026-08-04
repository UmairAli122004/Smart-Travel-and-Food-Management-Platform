import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip, Skeleton, useTheme, Snackbar, Alert } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ENV } from '../../config/env';

const MenuItemCard = React.memo(({ item }) => {
  const theme = useTheme();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cartItem = cartItems.find(i => i.id === item.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: 'success' });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleAddToCart = () => {
    try {
      addToCart(item, item.restaurantId, null, null, 1);
      setSnackbar({ open: true, message: `${item.menuName} added to cart`, variant: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: error.message, variant: 'error' });
    }
  };

  const placeholderImage = 'https://placehold.co/400x300?text=Food+Image';
  const imageUrl = imageError ? placeholderImage : (item.imageUrl ? `${ENV.API_BASE_URL}${item.imageUrl}` : placeholderImage);

  return (
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
          {!imageLoaded && !imageError && (
            <Skeleton 
              variant="rectangular" 
              sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} 
            />
          )}
          {/* Blurred Background Image */}
          <img
            src={imageUrl}
            alt=""
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              filter: 'blur(15px)',
              opacity: imageLoaded ? 0.5 : 0,
              transform: 'scale(1.2)',
              transition: 'opacity 0.3s ease-in-out'
            }}
            loading="lazy"
          />
          {/* Foreground Contained Image */}
          <img
            src={imageUrl}
            alt={item.menuName}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
            loading="lazy"
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
            {item.menuName}
          </Typography>
          <Typography variant="h6" color="text.primary" fontWeight={600} sx={{ fontSize: '1rem' }}>
            ₹{Number(item.price).toFixed(2)}
          </Typography>
        </Box>

        <Box display="flex" gap={1} mb={1}>
          <Chip 
            size="small" 
            sx={{ textTransform: 'capitalize' }} 
            label={item.foodType ? item.foodType.replace(/_/g, ' ').toLowerCase() : 'N/A'} 
            color="default" 
          />
          <Chip 
            size="small" 
            label={item.available ? 'Available' : 'Unavailable'} 
            color={item.available ? 'success' : 'error'} 
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2} sx={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.description || 'Delicious meal prepared with fresh ingredients.'}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <StorefrontIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              {item.restaurantName}
            </Typography>
          </Box>
          {cartQuantity > 0 ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              height: 30
            }}>
              <Button 
                size="small" 
                onClick={() => updateQuantity(item.id, cartQuantity - 1)}
                sx={{ minWidth: 30, p: 0, color: 'inherit', borderRadius: 0 }}
              >
                -
              </Button>
              <Typography sx={{ px: 1, fontWeight: 'bold', fontSize: '0.9rem' }}>
                {cartQuantity}
              </Typography>
              <Button 
                size="small" 
                onClick={() => updateQuantity(item.id, cartQuantity + 1)}
                sx={{ minWidth: 30, p: 0, color: 'inherit', borderRadius: 0 }}
              >
                +
              </Button>
            </Box>
          ) : (
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={!item.available}
              sx={{ 
                textTransform: 'none', 
                borderRadius: 2,
                px: 2
              }}
            >
              {item.available ? 'Add' : 'Sold Out'}
            </Button>
          )}
        </Box>
      </CardContent>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.variant} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
});

export default MenuItemCard;
