import React from 'react';
import { TextField } from '@mui/material';

/**
 * BaseInput - A foundational UI component for text inputs.
 */
const BaseInput = React.forwardRef(({ variant = 'outlined', fullWidth = true, ...props }, ref) => {
  return (
    <TextField
      inputRef={ref}
      variant={variant}
      fullWidth={fullWidth}
      {...props}
    />
  );
});

BaseInput.displayName = 'BaseInput';

export default BaseInput;
