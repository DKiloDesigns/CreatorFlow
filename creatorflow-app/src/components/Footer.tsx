import Link from 'next/link';
import { Box, Container, Typography, Link as MuiLink, IconButton } from '@mui/material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 6,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2 
        }}>
          {/* Navigation Links */}
          <Box component="nav" sx={{ 
            display: 'flex', 
            gap: 4, 
            mb: 1,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <MuiLink 
              component={Link} 
              href="/about" 
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              About
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/blog" 
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Blog
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/support" 
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Support
            </MuiLink>
            <MuiLink 
              component={Link} 
              href="/#plans" 
              color="text.secondary"
              sx={{ 
                textDecoration: 'none',
                '&:hover': { color: 'primary.main' },
                minWidth: 44,
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Plans
            </MuiLink>
          </Box>

          {/* Social Media Icons */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <IconButton
              component="a"
              href="#"
              aria-label="YouTube"
              sx={{ 
                minWidth: 44, 
                minHeight: 44,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              🎥
            </IconButton>
            <IconButton
              component="a"
              href="#"
              aria-label="Instagram"
              sx={{ 
                minWidth: 44, 
                minHeight: 44,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              📸
            </IconButton>
            <IconButton
              component="a"
              href="#"
              aria-label="TikTok"
              sx={{ 
                minWidth: 44, 
                minHeight: 44,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              🎵
            </IconButton>
            <IconButton
              component="a"
              href="#"
              aria-label="X"
              sx={{ 
                minWidth: 44, 
                minHeight: 44,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              🐦
            </IconButton>
            <IconButton
              component="a"
              href="#"
              aria-label="Discord"
              sx={{ 
                minWidth: 44, 
                minHeight: 44,
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              💬
            </IconButton>
          </Box>

          {/* Copyright */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} CreatorFlow. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Made with ❤️ for creators.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
} 