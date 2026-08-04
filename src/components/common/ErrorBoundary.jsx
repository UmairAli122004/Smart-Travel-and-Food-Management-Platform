import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Reload the page or go back
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, maxWidth: 500, boxShadow: 4 }}>
            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Something went wrong.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              An unexpected error occurred while rendering this page. We have logged the issue.
            </Typography>
            <Button variant="contained" color="primary" onClick={this.handleReset} sx={{ borderRadius: 2 }}>
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
