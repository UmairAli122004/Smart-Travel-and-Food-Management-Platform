import React, { useState, useEffect } from 'react';
import { Box, Fab, Fade } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ScrollHelper = () => {
  const [showUp, setShowUp] = useState(false);
  const [showDown, setShowDown] = useState(true);

  const handleScroll = () => {
    // Show "Scroll to Top" button if user has scrolled down a bit
    if (window.scrollY > 100) {
      setShowUp(true);
    } else {
      setShowUp(false);
    }

    // Show "Scroll to Bottom" button if user is not at the very bottom
    const bottomReached = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;
    
    if (bottomReached) {
      setShowDown(false);
    } else {
      setShowDown(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        bottom: { xs: 130, md: 80 }, // Adjusted higher to prevent overlapping with Add To Cart button
        right: { xs: 16, md: 32 }, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5,
        zIndex: 1100 
      }}
    >
      <Fade in={showUp}>
        <Fab 
          size="small" 
          color="secondary" 
          aria-label="scroll to top" 
          onClick={scrollToTop}
          sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Fade>
      
      <Fade in={showDown}>
        <Fab 
          size="small" 
          color="secondary" 
          aria-label="scroll to bottom" 
          onClick={scrollToBottom}
          sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      </Fade>
    </Box>
  );
};

export default ScrollHelper;
