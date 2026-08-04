import React from 'react';
import { Button } from '@mui/material';

/**
 * BaseButton - A foundational UI component built on top of MUI's Button.
 * It enforces the use of Design Tokens and abstracts away inline styling.
 * 
 * @param {Object} props - Standard MUI Button props
 */
const BaseButton = ({ children, variant = 'contained', color = 'primary', ...props }) => {
  return (
    <Button
      variant={variant}
      color={color}
      disableElevation
      {...props}
    >
      {children}
    </Button>
  );
};

export default BaseButton;
