import React, { memo } from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
const ErrorAlert = ({ message, onRetry }) => {
  return (
    <Alert
      severity="error"
      sx={{ mb: 2 }}
      action={
        onRetry && (
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>Error</AlertTitle>
      {message || 'Failed to load data. Please try again.'}
    </Alert>
  );
};
export default memo(ErrorAlert);
