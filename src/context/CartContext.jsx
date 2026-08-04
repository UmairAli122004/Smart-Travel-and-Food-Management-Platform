import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [journeyId, setJourneyId] = useState(() => localStorage.getItem('cartJourneyId') || null);
  const [restaurantId, setRestaurantId] = useState(() => localStorage.getItem('cartRestaurantId') || null);
  const [stationId, setStationId] = useState(() => localStorage.getItem('cartStationId') || null);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (journeyId) localStorage.setItem('cartJourneyId', journeyId); else localStorage.removeItem('cartJourneyId');
    if (restaurantId) localStorage.setItem('cartRestaurantId', restaurantId); else localStorage.removeItem('cartRestaurantId');
    if (stationId) localStorage.setItem('cartStationId', stationId); else localStorage.removeItem('cartStationId');
  }, [cartItems, journeyId, restaurantId, stationId]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cartItems' && e.newValue) {
        setCartItems(JSON.parse(e.newValue));
      } else if (e.key === 'cartJourneyId') {
        setJourneyId(e.newValue);
      } else if (e.key === 'cartRestaurantId') {
        setRestaurantId(e.newValue);
      } else if (e.key === 'cartStationId') {
        setStationId(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = (menuItem, restaurantIdParam, journeyIdParam, stationIdParam, quantity = 1) => {
    if (cartItems.length > 0) {
      if (journeyId !== journeyIdParam) {
        throw new Error("You can only order for one journey at a time. Please clear your cart first.");
      }
    }

    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === menuItem.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...menuItem, quantity, restaurantId: restaurantIdParam }];
    });

    if (cartItems.length === 0) {
      setJourneyId(journeyIdParam);
      setRestaurantId(restaurantIdParam);
      setStationId(stationIdParam);
    }
  };

  const removeFromCart = (menuItemId) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== menuItemId);
      if (newItems.length === 0) {
        setJourneyId(null);
        setRestaurantId(null);
        setStationId(null);
      }
      return newItems;
    });
  };

  const updateQuantity = (menuItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === menuItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setJourneyId(null);
    setRestaurantId(null);
    setStationId(null);
  };

  const updateJourneyId = (newJourneyId) => {
    setJourneyId(newJourneyId);
  };

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    journeyId,
    restaurantId,
    stationId,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateJourneyId,
    clearCart,
    cartTotal,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
