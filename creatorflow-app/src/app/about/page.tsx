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

export default function AboutPage() {
  const router = useRouter();
  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 } }}>
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
                color: 'grey.900', 
                fontSize: { xs: '2.5rem', sm: '3rem', lg: '3.125rem' }
              }}>
                Empowering Creators Worldwide
              </Typography>
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
          <Typography variant="h5" sx={{ 
            color: 'grey.600', 
            mb: 4,
            '& .dark &': { color: 'grey.300' }
          }}>
            We&apos;re building the future of content creation, one creator at a time.
          </Typography>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box component="section" sx={{ 
        py: 8, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        bgcolor: 'grey.50',
        '& .dark &': { bgcolor: 'grey.800' }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: 'grey.900', 
              mb: 2,
              '& .dark &': { color: 'white' }
            }}>
              Our Mission
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'grey.600',
              '& .dark &': { color: 'grey.300' }
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
                  bgcolor: 'blue.100', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  '& .dark &': { bgcolor: 'blue.900' }
                }}>
                  <GpsFixedIcon style={{ height: 32, width: 32, color: 'var(--mui-palette-primary-main)' }} />
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
                  bgcolor: 'purple.100', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  '& .dark &': { bgcolor: 'purple.900' }
                }}>
                  <FavoriteIcon style={{ height: 32, width: 32, color: 'var(--mui-palette-secondary-main)' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Support
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'grey.600',
                  '& .dark &': { color: 'grey.300' }
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
                  bgcolor: 'green.100', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                  '& .dark &': { bgcolor: 'green.900' }
                }}>
                  <FlashOnIcon style={{ height: 32, width: 32, color: '#16a34a' }} />
                </Box>
                <Typography variant="h5" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Innovate
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'grey.600',
                  '& .dark &': { color: 'grey.300' }
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
              color: 'grey.900',
              '& .dark &': { color: 'white' }
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
                  bgcolor: 'blue.100', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  '& .dark &': { bgcolor: 'blue.900' }
                }}>
                  <PeopleIcon style={{ height: 24, width: 24, color: '#2563eb' }} />
                </Box>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ 
                    fontWeight: 600, 
                    color: 'grey.900', 
                    mb: 1,
                    '& .dark &': { color: 'white' }
                  }}>
                    Creator-First
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'grey.600',
                    '& .dark &': { color: 'grey.300' }
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
                  bgcolor: 'purple.100', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  '& .dark &': { bgcolor: 'purple.900' }
                }}>
                  <SecurityIcon style={{ height: 24, width: 24, color: '#9333ea' }} />
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
                  bgcolor: 'green.100', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  '& .dark &': { bgcolor: 'green.900' }
                }}>
                  <PublicIcon style={{ height: 24, width: 24, color: '#16a34a' }} />
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
                  bgcolor: 'orange.100', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0,
                  '& .dark &': { bgcolor: 'orange.900' }
                }}>
                  <FlashOnIcon style={{ height: 24, width: 24, color: '#ea580c' }} />
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
        bgcolor: 'grey.50',
        '& .dark &': { bgcolor: 'grey.800' }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 'bold', 
              color: 'grey.900', 
              mb: 2,
              '& .dark &': { color: 'white' }
            }}>
              Our Team
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'grey.600',
              '& .dark &': { color: 'grey.300' }
            }}>
              A passionate group of creators, developers, and entrepreneurs building the future of content creation.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: 'linear-gradient(to right, blue.500, purple.600)', 
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  DM
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Derrell Kilo
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.600',
                  mb: 1,
                  '& .dark &': { color: 'grey.300' }
                }}>
                  Founder & CEO
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.500',
                  '& .dark &': { color: 'grey.400' }
                }}>
                  Former creator turned entrepreneur, passionate about empowering the next generation of digital creators.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: 'linear-gradient(to right, green.500, blue.600)', 
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  SM
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Shawn Montgomery
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.600',
                  mb: 1,
                  '& .dark &': { color: 'grey.300' }
                }}>
                  CTO
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.500',
                  '& .dark &': { color: 'grey.400' }
                }}>
                  Tech leader with 15+ years building scalable platforms for creators and businesses.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4} component="div">
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 96, 
                  height: 96, 
                  bgcolor: 'linear-gradient(to right, purple.500, pink.600)', 
                  borderRadius: '50%', 
                  mx: 'auto', 
                  mb: 2,
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}>
                  LA
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 600, 
                  color: 'grey.900', 
                  mb: 1,
                  '& .dark &': { color: 'white' }
                }}>
                  Lloyd Alexander
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.600',
                  mb: 1,
                  '& .dark &': { color: 'grey.300' }
                }}>
                  Head of Product
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'grey.500',
                  '& .dark &': { color: 'grey.400' }
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
        bgcolor: 'grey.50',
        '& .dark &': { bgcolor: 'grey.800' }
      }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold', 
            color: 'grey.900', 
            mb: 2,
            '& .dark &': { color: 'white' }
          }}>
            Ready to Start Your Creator Journey?
          </Typography>
          <Typography variant="h6" sx={{ 
            color: 'grey.600',
            mb: 2,
            '& .dark &': { color: 'grey.300' }
          }}>
            Join thousands of creators who are already using floai.studio to grow their audience and income.
          </Typography>
          <Box 
            component={Link}
            href="/auth" 
            sx={{ 
              display: 'inline-block', 
              bgcolor: 'linear-gradient(to right, blue.500, purple.600)', 
              color: 'white', 
              fontWeight: 'semibold', 
              borderRadius: '0.5rem', 
              px: 3, 
              py: 1, 
              textDecoration: 'none',
              '&:hover': { 
                bgcolor: 'linear-gradient(to right, blue.600, purple.700)' 
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