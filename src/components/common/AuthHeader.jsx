import React from 'react';
import { Typography } from '@mui/material';

/**
 * AuthHeader - Standardized typography for authentication page headers.
 * Extracts the title and subtitle styling from VendorLoginPage.
 */
const AuthHeader = ({ title, subtitle }) => {
  return (
    <>
      <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
    </>
  );
};

export default AuthHeader;
