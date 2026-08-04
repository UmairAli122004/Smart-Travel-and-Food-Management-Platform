import React from 'react';
import { Paper } from '@mui/material';

/**
 * AuthCard - Standardized layout container for all authentication pages.
 * Enforces the identical width (400px), margin, and padding extracted from VendorLoginPage.
 */
const AuthCard = ({ children, maxWidth = 400, ...props }) => {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, sm: 4 }, 
        width: '100%', 
        maxWidth: maxWidth, 
        margin: '0 auto',
        borderRadius: 2
      }} 
      {...props}
    >
      {children}
    </Paper>
  );
};

export default AuthCard;
