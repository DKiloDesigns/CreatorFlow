'use client';

import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BarChartIcon from '@mui/icons-material/BarChart';
import GpsFixedIcon from '@mui/icons-material/GpsFixed'; // Added GpsFixedIcon import
import FavoriteIcon from '@mui/icons-material/Favorite'; // Added FavoriteIcon import
import PeopleIcon from '@mui/icons-material/People'; // Added PeopleIcon import
import FlashOnIcon from '@mui/icons-material/FlashOn'; // Added FlashOnIcon import
import SecurityIcon from '@mui/icons-material/Security'; // Added SecurityIcon import
import PublicIcon from '@mui/icons-material/Public'; // Added PublicIcon import
import Link from 'next/link';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation'; // Import useRouter
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import ArrowBackIcon
import { useTheme } from '@mui/material/styles';

export default function AboutPage() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{
          py: { xs: 8, md: 12 }, 
          px: { xs: 4, sm: 3, lg: 4 }, 
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
            : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))', 
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="back" 
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h2" component="h1" sx={{ 
                fontWeight: 'bold', 
                color: theme.palette.text.primary, 
                fontSize: { xs: '2.5rem', sm: '3rem', lg: '3.125rem' }
              }}>
                Empowering Creators Worldwide
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
          <Typography variant="h5" sx={{ 
            color: theme.palette.text.secondary, 
            mb: 4,
            // Removed dark mode explicit override as theme.palette.text.secondary should handle it
          }}>
            We&apos;re building the future of content creation, one creator at a time.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box component="section" sx={{ 
        py: 8, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        bgcolor: theme.palette.background.default,
        // Removed dark mode explicit override as theme.palette.background.default should handle it
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 2,
              // Removed dark mode explicit override as theme.palette.text.primary should handle it
            }}>
              Our Mission
            </Typography>
            <Typography variant="h6" sx={{ 
              color: theme.palette.text.secondary,
              // Removed dark mode explicit override as theme.palette.text.secondary should handle it
            }}>
              To democratize content creation by providing creators with the tools, insights, and opportunities they need to succeed in the digital economy.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.primary.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  // Removed dark mode explicit override as theme.palette.primary.light/dark should handle it
                }}>
                  <GpsFixedIcon style={{ height: 32, width: 32, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Empower
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'grey.600',
                  '& .dark &': { color: 'grey.300' }
                }}>
                  Give creators the tools and insights they need to grow their audience and income.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.secondary.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  '& .dark &': { bgcolor: 'purple.900' }
                }}>
                  <FavoriteIcon style={{ height: 32, width: 32, color: theme.palette.secondary.main }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.primary should handle it
                }}>
                  Support
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                }}>
                  Build a community where creators can learn, collaborate, and succeed together.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.success.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  // Removed dark mode explicit override as theme.palette.success.light/dark should handle it
                }}>
                  <FlashOnIcon style={{ height: 32, width: 32, color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.primary should handle it
                }}>
                  Innovate
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                }}>
                  Continuously develop cutting-edge tools that adapt to the evolving creator economy.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary,
              // Removed dark mode explicit override as theme.palette.text.primary should handle it
            }}>
              Our Values
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} component="div">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: theme.palette.primary.light, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  // Removed dark mode explicit override as theme.palette.primary.light/dark should handle it
                }}>
                  <PeopleIcon style={{ height: 24, width: 24, color: theme.palette.primary.dark }} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: theme.palette.text.primary, 
                    mb: 1,
                    // Removed dark mode explicit override as theme.palette.text.primary should handle it
                  }}>
                    Creator-First
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: theme.palette.text.secondary,
                    // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                  }}>
                    Every decision we make is guided by what's best for creators and their communities.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} component="div">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: theme.palette.secondary.light, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  // Removed dark mode explicit override as theme.palette.secondary.light/dark should handle it
                }}>
                  <SecurityIcon style={{ height: 24, width: 24, color: theme.palette.secondary.dark }} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'grey.900', 
                    mb: 1,
                    '& .dark &': { color: 'white' }
                  }}>
                    Transparency
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'grey.600',
                    '& .dark &': { color: 'grey.300' }
                  }}>
                    We believe in open communication and clear, honest relationships with our users.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} component="div">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: theme.palette.success.light, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  // Removed dark mode explicit override as theme.palette.success.light/dark should handle it
                }}>
                  <PublicIcon style={{ height: 24, width: 24, color: theme.palette.success.main }} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'grey.900', 
                    mb: 1,
                    '& .dark &': { color: 'white' }
                  }}>
                    Inclusivity
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'grey.600',
                    '& .dark &': { color: 'grey.300' }
                  }}>
                    We celebrate diversity and create tools that work for creators from all backgrounds.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} component="div">
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: theme.palette.warning.light, 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  // Removed dark mode explicit override as theme.palette.warning.light/dark should handle it
                }}>
                  <FlashOnIcon style={{ height: 24, width: 24, color: theme.palette.warning.dark }} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'grey.900', 
                    mb: 1,
                    '& .dark &': { color: 'white' }
                  }}>
                    Innovation
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'grey.600',
                    '& .dark &': { color: 'grey.300' }
                  }}>
                    We constantly push boundaries to deliver cutting-edge solutions for creators.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box component="section" sx={{ 
        py: 8, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        bgcolor: theme.palette.background.default,
        // Removed dark mode explicit override as theme.palette.background.default should handle it
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 2,
              // Removed dark mode explicit override as theme.palette.text.primary should handle it
            }}>
              Our Team
            </Typography>
            <Typography variant="h6" sx={{ 
              color: theme.palette.text.secondary,
              // Removed dark mode explicit override as theme.palette.text.secondary should handle it
            }}>
              A passionate group of creators, developers, and entrepreneurs building the future of content creation.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: theme.palette.primary.main, // Using primary.main for a solid color, or could use a custom gradient if defined in theme
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: theme.palette.common.white,
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  DM
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.primary should handle it
                }}>
                  Derrell Kilo
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                }}>
                  Founder & CEO
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.disabled,
                  // Removed dark mode explicit override as theme.palette.text.disabled should handle it
                }}>
                  Former creator turned entrepreneur, passionate about empowering the next generation of digital creators.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: theme.palette.success.main, // Using success.main for a solid color
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: theme.palette.common.white,
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  SM
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.primary should handle it
                }}>
                  Shawn Montgomery
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                }}>
                  CTO
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.disabled,
                  // Removed dark mode explicit override as theme.palette.text.disabled should handle it
                }}>
                  Tech leader with 15+ years building scalable platforms for creators and businesses.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: theme.palette.secondary.main, // Using secondary.main for a solid color
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: theme.palette.common.white,
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  LA
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.primary should handle it
                }}>
                  Lloyd Alexander
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  // Removed dark mode explicit override as theme.palette.text.secondary should handle it
                }}>
                  Head of Product
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.disabled,
                  // Removed dark mode explicit override as theme.palette.text.disabled should handle it
                }}>
                  Product strategist focused on creating intuitive experiences that creators love to use.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box component="section" sx={{ 
        py: 8, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        bgcolor: theme.palette.background.default,
        // Removed dark mode explicit override as theme.palette.background.default should handle it
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.text.primary, 
            mb: 2,
            // Removed dark mode explicit override as theme.palette.text.primary should handle it
          }}>
            Ready to Start Your Creator Journey?
          </Typography>
          <Typography variant="h6" sx={{ 
            color: theme.palette.text.secondary,
            mb: 2,
            // Removed dark mode explicit override as theme.palette.text.secondary should handle it
          }}>
            Join thousands of creators who are already using floai.studio to grow their audience and income.
          </Typography>
          <Box 
            component={Link}
            href="/auth" 
            sx={{ 
              display: 'inline-block', 
              bgcolor: theme.palette.primary.main, // Using primary.main for the button background
              color: theme.palette.common.white, 
              fontWeight: 'semibold', 
              borderRadius: '0.5rem', 
              px: 3, 
              py: 1, 
              textDecoration: 'none',
              '&:hover': { 
                bgcolor: theme.palette.primary.dark, // Using primary.dark for hover state
              }
            }}
          >
            Get Started Free
          </Box>
        </Container>
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 32, sm: 10 }, width: '100%' }}></Box>
    </PublicPageLayout>
  );
} 