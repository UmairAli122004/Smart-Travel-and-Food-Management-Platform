import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Avatar, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Collapse, List } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import PeopleIcon from '@mui/icons-material/People';
import TrainIcon from '@mui/icons-material/Train';
import JourneyFormModal from '../dashboard/passenger/JourneyFormModal';
import { useCreateJourney } from '../../hooks/useJourneys';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ title }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJourneyFormOpen, setIsJourneyFormOpen] = useState(false);
  
  const handleSettingsToggle = (e) => {
    e.stopPropagation();
    setIsSettingsOpen(!isSettingsOpen);
  };

  const createMutation = useCreateJourney();

  const handleOpenJourneyForm = () => {
    setIsJourneyFormOpen(true);
    handleProfileClose();
  };

  const handleCloseJourneyForm = () => {
    setIsJourneyFormOpen(false);
  };

  const handleJourneySubmit = async (formData) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsJourneyFormOpen(false);
      if (user?.role === 'PASSENGER') {
        navigate('/passenger/journeys');
      } else if (user?.role === 'ADMIN') {
        // Admin doesn't have a journeys list page yet, just stay or navigate to dashboard
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleProfileClose();
  };

  const renderMenuOptions = () => {
    if (!user) return null;

    if (user.role === 'VENDOR') {
      return [
        <MenuItem key="dash" onClick={() => handleNavigate('/vendor/dashboard')}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>,
        <MenuItem key="rest" onClick={() => handleNavigate('/vendor/restaurants')}>
          <ListItemIcon><StorefrontIcon fontSize="small" /></ListItemIcon>
          <ListItemText>My Restaurants</ListItemText>
        </MenuItem>,
        <MenuItem key="orders" onClick={() => handleNavigate('/vendor/orders')}>
          <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Orders</ListItemText>
        </MenuItem>,
        <MenuItem key="complaints" onClick={() => handleNavigate('/vendor/complaints')}>
          <ListItemIcon><ReportProblemIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Complaints</ListItemText>
        </MenuItem>
      ];
    }
    
    if (user.role === 'PASSENGER') {
      return [
        <MenuItem key="dash" onClick={() => handleNavigate('/passenger/dashboard')}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>,
        <MenuItem key="create_journey" onClick={handleOpenJourneyForm}>
          <ListItemIcon><TrainIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Create Journey</ListItemText>
        </MenuItem>,
        <MenuItem key="orders" onClick={() => handleNavigate('/passenger/orders')}>
          <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
          <ListItemText>My Orders</ListItemText>
        </MenuItem>,
        <MenuItem key="complaints" onClick={() => handleNavigate('/passenger/complaints')}>
          <ListItemIcon><ReportProblemIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Complaints</ListItemText>
        </MenuItem>
      ];
    }
    
    if (user.role === 'ADMIN') {
      return [
        <MenuItem key="dash" onClick={() => handleNavigate('/admin/dashboard')}>
          <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>,
        <MenuItem key="restaurants" onClick={() => handleNavigate('/admin/restaurants')}>
          <ListItemIcon><StorefrontIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Restaurants</ListItemText>
        </MenuItem>,
        <MenuItem key="orders" onClick={() => handleNavigate('/admin/orders')}>
          <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Orders</ListItemText>
        </MenuItem>,
        <MenuItem key="settings" onClick={handleSettingsToggle}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Settings</ListItemText>
          {isSettingsOpen ? <ExpandLess /> : <ExpandMore />}
        </MenuItem>,
        <Collapse key="settings-collapse" in={isSettingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <MenuItem sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/stations')}>
              <ListItemIcon><TrainIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Create Station</ListItemText>
            </MenuItem>
            <MenuItem sx={{ pl: 4 }} onClick={handleOpenJourneyForm}>
              <ListItemIcon><TrainIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Create Journey</ListItemText>
            </MenuItem>
            <MenuItem sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/users')}>
              <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Users</ListItemText>
            </MenuItem>
            <MenuItem sx={{ pl: 4 }} onClick={() => handleNavigate('/admin/complaints')}>
              <ListItemIcon><ReportProblemIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Complaints</ListItemText>
            </MenuItem>
          </List>
        </Collapse>
      ];
    }
    return null;
  };

  return (
    <>
      <AppBar position="fixed" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          
          {/* Brand Logo Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <FastfoodIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px', display: { xs: 'none', md: 'block' } }}>
              Smart Travel &amp; <Box component="span" sx={{ color: 'primary.main' }}>Food</Box> Management Platform
            </Typography>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px', display: { xs: 'block', md: 'none' } }}>
              Smart<Box component="span" sx={{ color: 'primary.main' }}>Food</Box>
            </Typography>
          </Box>

          {/* Profile Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600 }}>
              {user?.username || user?.email}
            </Typography>
            
            <IconButton onClick={handleProfileClick} size="small" sx={{ ml: 1, p: 0 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                width: 40, 
                height: 40, 
                cursor: 'pointer', 
                transition: 'all 0.2s ease-in-out', 
                boxShadow: '0 2px 8px rgba(226, 55, 68, 0.25)',
                '&:hover': { transform: 'scale(1.05)', boxShadow: '0 4px 12px rgba(226, 55, 68, 0.4)' } 
              }}>
                {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileClose}
              onClick={handleProfileClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.12))',
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 4,
                    '& .MuiMenuItem-root': {
                      mx: 1,
                      my: 0.5,
                      borderRadius: 2,
                      py: 1,
                      px: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(226, 55, 68, 0.08)',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        }
                      }
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user?.username || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              
              {renderMenuOptions()}
              
              <Divider />
              <MenuItem onClick={() => { handleProfileClose(); logout(); }}>
                <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {(user?.role === 'PASSENGER' || user?.role === 'ADMIN') && (
        <JourneyFormModal
          open={isJourneyFormOpen}
          onClose={handleCloseJourneyForm}
          onSubmit={handleJourneySubmit}
          isLoading={createMutation.isPending}
          error={createMutation.error}
          isAdmin={user?.role === 'ADMIN'}
        />
      )}
    </>
  );
};
export default Topbar;
