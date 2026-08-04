import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, isEmpty, emptyMessage, emptyIcon }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          {isEmpty ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'text.secondary', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <span style={{ fontSize: '3rem', opacity: 0.5, marginBottom: '8px' }}>{emptyIcon || '📊'}</span>
              <Typography variant="body1" fontWeight={500}>{emptyMessage || 'No data available'}</Typography>
            </Box>
          ) : (
            <ResponsiveContainer>
              {children}
            </ResponsiveContainer>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
