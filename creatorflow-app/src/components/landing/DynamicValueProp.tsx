'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

const VALUE_PROPOSITIONS = [
  "AI-Powered Content Creation",
  "Multi-Platform Publishing", 
  "Enterprise-Grade Analytics",
  "Real-Time Performance Tracking",
  "Advanced Team Collaboration",
  "White-Label Solutions"
];

export function DynamicValueProp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % VALUE_PROPOSITIONS.length
        );
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      gap: 1,
      mb: 2
    }}>
      <Chip
        icon={<AutoAwesome />}
        label="The Only Platform That"
        color="primary"
        variant="outlined"
        sx={{
          fontWeight: 'bold',
          fontSize: '0.9rem',
          height: 32
        }}
      />
      
      <Box sx={{ 
        minHeight: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.3s ease-in-out',
            textAlign: 'center',
            minWidth: '300px'
          }}
        >
          {VALUE_PROPOSITIONS[currentIndex]}
        </Typography>
      </Box>
    </Box>
  );
}
