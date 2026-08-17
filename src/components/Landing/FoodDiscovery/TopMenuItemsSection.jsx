import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import api from '../../../api/axiosInstance';
import MenuItemCard from '../../menu/MenuItemCard';

const TopMenuItemsSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMenuItems = async () => {
      try {
        const response = await api.get('/api/menu-items/popular?page=0&size=8');
        if (response.data.success && response.data.data && response.data.data.content) {
          setMenuItems(response.data.data.content);
        }
      } catch (error) {
        console.error('Error fetching popular menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMenuItems();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, px: 2 }}>
          Popular Menu Items
        </Typography>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} px={2}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box sx={{ height: 350, bgcolor: 'grey.200', borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (menuItems.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, px: 2 }}>
        Popular Menu Items
      </Typography>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} px={2}>
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
            <MenuItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TopMenuItemsSection;
