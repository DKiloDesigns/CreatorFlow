'use client';

import React from 'react';
import { Box, Typography, Chip, Container, Grid } from '@mui/material';
import { 
  CheckCircle, 
  Speed, 
  Security, 
  Extension, 
  Analytics,
  Support
} from '@mui/icons-material';

const ADVANTAGES = [
  {
    icon: <Speed />,
    title: "3x Faster",
    description: "Publish to all platforms in seconds"
  },
  {
    icon: <Security />,
    title: "Enterprise Security",
    description: "SOC 2 & GDPR compliant"
  },
  {
    icon: <Extension />,
    title: "16+ Platforms",
    description: "Most comprehensive platform support"
  },
  {
    icon: <Analytics />,
    title: "AI Analytics",
    description: "Predict content performance"
  },
  {
    icon: <Support />,
    title: "24/7 Support",
    description: "Dedicated creator success team"
  }
];

export function CompetitiveAdvantage() {
  return (
    <Box sx={{ 
      py: 6, 
      bgcolor: 'background.paper',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Chip
            icon={<CheckCircle />}
            label="Why Creators Choose CreatorFlow"
            color="primary"
            variant="filled"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              height: 40,
              mb: 2
            }}
          />
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            The Only Platform That Delivers
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Everything you need to scale your creator business, all in one place
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {ADVANTAGES.map((advantage, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 3,
                borderRadius: 3,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                height: '100%',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                  borderColor: 'primary.main'
                }
              }}>
                <Box sx={{ 
                  color: 'primary.main',
                  mb: 2,
                  '& .MuiSvgIcon-root': {
                    fontSize: '3rem'
                  }
                }}>
                  {advantage.icon}
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 1,
                  color: 'text.primary'
                }}>
                  {advantage.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  textAlign: 'center',
                  lineHeight: 1.6
                }}>
                  {advantage.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
