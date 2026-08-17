import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, Container, Accordion, AccordionSummary, AccordionDetails, Menu, MenuItem, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import { Link } from 'react-router-dom';
import BaseButton from '../../components/common/BaseButton';
import { useAuth } from '../../context/AuthContext';
import landingImage from '../../assets/landingimage.png';
import Loading from '../../components/common/Loading';
import Footer from '../../components/layout/Footer';
import FoodDiscoverySection from '../../components/Landing/FoodDiscovery/FoodDiscoverySection';
import TopMenuItemsSection from '../../components/Landing/FoodDiscovery/TopMenuItemsSection';

const faqs = [
  {
    question: "How do I register as a vendor?",
    answer: "You can click on the 'Vendor Register' link in the top right, or click the 'Partner with us' button to start your registration process."
  },
  {
    question: "Can I order food for my upcoming train journey?",
    answer: "Yes! Passengers can search for upcoming journeys, view stations along the route, and order food from partnered vendors at those stations."
  },
  {
    question: "How can I track my orders?",
    answer: "Once logged in as a passenger, click on your Profile avatar in the top right and select 'My Orders' to see real-time updates on your food delivery."
  },
  {
    question: "Is there a customer support contact if I face issues with my order?",
    answer: "Yes, our customer support is available 24/7. You can use the 'Complaints' section from your Profile menu to report and track any issues."
  },
  {
    question: "How do I cancel my food order?",
    answer: "You can cancel your order directly from the 'My Orders' section in your Profile menu before the vendor starts preparing your food."
  }
];

const LandingPage = () => {
  const { loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) return <Loading />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation Bar */}
      <AppBar position="absolute" color="transparent" elevation={0} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} component={Link} to="/" style={{ textDecoration: 'none' }}>
            <FastfoodIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px', display: { xs: 'none', md: 'block' } }}>
              Smart Travel &amp; <Box component="span" sx={{ color: 'primary.main' }}>Food</Box> Management Platform
            </Typography>
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px', display: { xs: 'block', md: 'none' } }}>
              Smart<Box component="span" sx={{ color: 'primary.main' }}>Food</Box>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 } }}>
            <BaseButton 
              variant="outlined" 
              color="primary" 
              component={Link} 
              to="/login"
              sx={{ fontWeight: 600, borderRadius: 2, px: { xs: 1, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Login
            </BaseButton>
            <BaseButton 
              variant="contained" 
              color="primary" 
              component={Link} 
              to="/vendor/login"
              sx={{ fontWeight: 600, borderRadius: 2, px: { xs: 1, sm: 2 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Vendor Login</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Vendor</Box>
            </BaseButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ pt: 15, pb: 8, px: 2, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Box sx={{ maxWidth: 600 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
            Delicious food delivered to your <Box component="span" sx={{ color: 'primary.main' }}>train seat.</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Experience the best meals from top-rated restaurants across India, delivered fresh to your station.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <BaseButton variant="contained" color="primary" size="large" component={Link} to="/register" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', width: { xs: '100%', sm: 'auto' } }}>
              Get Started
            </BaseButton>
            <BaseButton variant="outlined" size="large" component={Link} to="/vendor/register" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', width: { xs: '100%', sm: 'auto' } }}>
              Partner with us
            </BaseButton>
          </Box>
        </Box>
        <Box component="img" src={landingImage} alt="Food Delivery" sx={{ width: '100%', maxWidth: 500, mixBlendMode: 'multiply' }} />
      </Box>

      {/* Food Discovery Section */}
      <FoodDiscoverySection />

      {/* Top Menu Items Section */}
      <TopMenuItemsSection />

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Frequently Asked Questions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} elevation={0} disableGutters sx={{ backgroundColor: 'transparent', borderBottom: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: 'text.primary' }}>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LandingPage;
