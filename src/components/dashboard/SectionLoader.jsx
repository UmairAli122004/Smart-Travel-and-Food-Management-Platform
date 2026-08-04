import React, { memo } from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';
const SectionLoader = ({ variant, height }) => {
  if (variant === 'cards') {
    return (
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <Box key={i} sx={{ flex: '1 1 220px' }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    );
  }
  if (variant === 'chart') {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="30%" height={28} />
          <Skeleton variant="rectangular" width="100%" height={height || 300} sx={{ mt: 2, borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }
  if (variant === 'table') {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="25%" height={28} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="text" width="100%" height={40} sx={{ mt: 1 }} />
          ))}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={height || 200} sx={{ borderRadius: 1 }} />
      </CardContent>
    </Card>
  );
};
export default memo(SectionLoader);
