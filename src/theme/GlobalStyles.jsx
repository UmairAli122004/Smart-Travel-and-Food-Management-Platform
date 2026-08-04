// src/theme/GlobalStyles.jsx
import React from 'react';
import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';

export const GlobalStyles = () => {
  const theme = useTheme();
  
  return (
    <MuiGlobalStyles
      styles={{
        'html, body': {
          margin: 0,
          padding: 0,
          fontFamily: theme.typography.fontFamily,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh',
          width: '100%',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '#root': {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        },
        a: {
          color: theme.palette.primary.main,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none', // Removed underline for modern look
          },
        },
        // We override Bootstrap styles here so we can eventually remove Bootstrap safely
        '.btn-primary': {
          backgroundColor: `${theme.palette.primary.main} !important`,
          borderColor: `${theme.palette.primary.main} !important`,
          color: `${theme.palette.primary.contrastText} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.dark} !important`,
            borderColor: `${theme.palette.primary.dark} !important`,
          }
        },
        '.card': {
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
        }
      }}
    />
  );
};
