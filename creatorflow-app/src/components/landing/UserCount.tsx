'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { People, TrendingUp } from '@mui/icons-material';

export function UserCount() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('user-count');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const targetCount = 10000;
      const duration = 2000; // 2 seconds
      const increment = targetCount / (duration / 16); // 60fps
      
      let currentCount = 0;
      const timer = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
          setCount(targetCount);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentCount));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <Box
      id="user-count"
      sx={{
        py: 4,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <People sx={{ fontSize: '2rem' }} />
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}>
            {count.toLocaleString()}+
          </Typography>
          <TrendingUp sx={{ fontSize: '2rem', color: 'success.light' }} />
        </Box>
        
        <Typography variant="h5" sx={{ 
          fontWeight: 600,
          mb: 1
        }}>
          Creators Already Growing
        </Typography>
        
        <Typography variant="body1" sx={{ 
          opacity: 0.9,
          maxWidth: 'md',
          mx: 'auto'
        }}>
          Join thousands of content creators who are scaling their business with CreatorFlow
        </Typography>
      </Container>
    </Box>
  );
}
