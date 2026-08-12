import React, { useState } from 'react';
import { Fab, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartDrawer from '../dashboard/passenger/CartDrawer';
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';

const GlobalCart = () => {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  // Do not show cart on admin or vendor pages
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor')) {
    return null;
  }

  return (
    <>
      {itemCount > 0 && (
        <Fab 
          color="primary" 
          aria-label="cart" 
          sx={{ 
            position: 'fixed', 
            bottom: { xs: 32, md: 32 }, 
            right: { xs: 32, md: 32 }, 
            zIndex: 1000 
          }}
          onClick={(e) => { e.currentTarget.blur(); setCartOpen(true); }}
        >
          <Badge badgeContent={itemCount} color="error">
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default GlobalCart;
