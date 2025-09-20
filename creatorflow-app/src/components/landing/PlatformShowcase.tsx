'use client';

import React from 'react';
import { Box, Typography, Grid, Chip, Container } from '@mui/material';
import { 
  YouTube, 
  Instagram, 
  MusicNote, 
  Twitter, 
  Chat, 
  Business,
  GitHub,
  PlayCircleFilled,
  VideoLibrary,
  Palette,
  Work,
  Forum,
  CameraAlt,
  LinkedIn,
  Phone,
  Public
} from '@mui/icons-material';

const PLATFORMS = [
  { name: 'Instagram', icon: <Instagram />, color: '#E4405F' },
  { name: 'YouTube', icon: <YouTube />, color: '#FF0000' },
  { name: 'TikTok', icon: <MusicNote />, color: '#000000' },
  { name: 'X (Twitter)', icon: <Twitter />, color: '#000000' },
  { name: 'Facebook', icon: <Business />, color: '#1877F2' },
  { name: 'LinkedIn', icon: <LinkedIn />, color: '#0A66C2' },
  { name: 'Discord', icon: <Chat />, color: '#5865F2' },
  { name: 'Twitch', icon: <PlayCircleFilled />, color: '#9146FF' },
  { name: 'Vimeo', icon: <VideoLibrary />, color: '#1AB7EA' },
  { name: 'Dribbble', icon: <Palette />, color: '#EA4C89' },
  { name: 'Slack', icon: <Work />, color: '#4A154B' },
  { name: 'Reddit', icon: <Forum />, color: '#FF4500' },
  { name: 'Snapchat', icon: <CameraAlt />, color: '#FFFC00' },
  { name: 'GitHub', icon: <GitHub />, color: '#181717' },
  { name: 'WhatsApp', icon: <Phone />, color: '#25D366' },
  { name: 'Mastodon', icon: <Public />, color: '#6364FF' }
];

export function PlatformShowcase() {
  return (
    <Box sx={{ 
      py: 6, 
      bgcolor: 'background.default'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Connect All Your Platforms
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Manage 16+ social media platforms from one unified dashboard
          </Typography>
        </Box>
        
        <Grid container spacing={2} justifyContent="center">
          {PLATFORMS.map((platform, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                  borderColor: platform.color
                }
              }}>
                <Box sx={{ 
                  color: platform.color,
                  mb: 1,
                  '& .MuiSvgIcon-root': {
                    fontSize: '2.5rem'
                  }
                }}>
                  {platform.icon}
                </Box>
                <Typography variant="body2" sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'text.primary'
                }}>
                  {platform.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body1" color="text.secondary">
            And many more platforms coming soon...
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
