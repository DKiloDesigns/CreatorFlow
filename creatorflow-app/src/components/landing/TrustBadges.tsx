'use client';

import React from 'react';
import { Box, Typography, Chip, Grid, Container } from '@mui/material';
import { 
  Security, 
  Verified, 
  Shield, 
  Lock,
  CheckCircle,
  GppGood
} from '@mui/icons-material';

const TRUST_BADGES = [
  {
    icon: <Security />,
    label: 'SSL Secured',
    color: 'success' as const,
    description: '256-bit encryption'
  },
  {
    icon: <Verified />,
    label: 'SOC 2 Compliant',
    color: 'success' as const,
    description: 'Enterprise security'
  },
  {
    icon: <Shield />,
    label: 'GDPR Ready',
    color: 'success' as const,
    description: 'Privacy compliant'
  },
  {
    icon: <Lock />,
    label: 'ISO 27001',
    color: 'info' as const,
    description: 'Security certified'
  },
  {
    icon: <CheckCircle />,
    label: '99.9% Uptime',
    color: 'primary' as const,
    description: 'Reliable service'
  },
  {
    icon: <GppGood />,
    label: 'Data Protected',
    color: 'warning' as const,
    description: 'Your data is safe'
  }
];

export function TrustBadges() {
  return (
    <Box sx={{ 
      py: 4, 
      bgcolor: 'background.paper',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            color: 'text.primary'
          }}>
            Trusted by Creators Worldwide
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enterprise-grade security and compliance you can trust
          </Typography>
        </Box>
        
        <Grid container spacing={2} justifyContent="center">
          {TRUST_BADGES.map((badge, index) => (
            <Grid item xs={6} sm={4} md={2} key={index}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}>
                <Box sx={{ 
                  color: `${badge.color}.main`,
                  mb: 1,
                  '& .MuiSvgIcon-root': {
                    fontSize: '2rem'
                  }
                }}>
                  {badge.icon}
                </Box>
                <Typography variant="body2" sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 0.5
                }}>
                  {badge.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  textAlign: 'center',
                  fontSize: '0.75rem'
                }}>
                  {badge.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
