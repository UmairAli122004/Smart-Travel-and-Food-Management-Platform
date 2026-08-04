import React, { memo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ label, value, subtitle, color, icon }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        borderLeft: `4px solid ${color || '#1976d2'}`,
        transition: 'box-shadow 0.2s ease-in-out',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1 }}>
              {label}
            </Typography>
            <Typography variant="h3" fontWeight={700} mt={1} color={color || 'text.primary'}>
              {value}
            </Typography>
            {subtitle && (
              <Box mt={1}>
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box sx={{ color: color || '#1976d2', opacity: 0.8 }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default memo(StatCard);
