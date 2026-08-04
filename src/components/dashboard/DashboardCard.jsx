import React, { memo } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
const trendConfig = {
  UP: { icon: TrendingUpIcon, color: '#2e7d32' },
  DOWN: { icon: TrendingDownIcon, color: '#d32f2f' },
  NEUTRAL: { icon: TrendingFlatIcon, color: '#757575' },
};
const DashboardCard = ({ title, value, icon, color, trend, trendDirection }) => {
  const trendInfo = trendDirection ? trendConfig[trendDirection] : null;
  const TrendIcon = trendInfo?.icon;
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography color="text.secondary" variant="subtitle2" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: '#fff',
                backgroundColor: color || 'primary.main',
                borderRadius: '12px',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
        <Typography variant="h4" component="div" fontWeight={700}>
          {value}
        </Typography>
        {trend && trendInfo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
            <TrendIcon sx={{ fontSize: 18, color: trendInfo.color }} />
            <Typography variant="caption" sx={{ color: trendInfo.color, fontWeight: 600 }}>
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
export default memo(DashboardCard);
