'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Shield, 
  Mail, 
  Users, 
  BarChart3, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Phone 
} from 'lucide-react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  InputAdornment,
  Chip,
  Button
} from '@mui/material';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of CreatorFlow",
    icon: BookOpen,
    articles: 12
  },
  {
    title: "Account & Billing",
    description: "Manage your account and payments",
    icon: Users,
    articles: 8
  },
  {
    title: "Content Creation",
    description: "Tips for creating great content",
    icon: FileText,
    articles: 15
  },
  {
    title: "Analytics & Insights",
    description: "Understand your performance data",
    icon: BarChart3,
    articles: 10
  }
];

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email",
    icon: Mail,
    contact: "support@creatorflow.com",
    response: "Within 24 hours"
  },
  {
    title: "Live Chat",
    description: "Chat with our team",
    icon: MessageSquare,
    contact: "Available 9AM-6PM PST",
    response: "Real-time"
  },
  {
    title: "Phone Support",
    description: "Call us directly",
    icon: Phone,
    contact: "+1 (555) 123-4567",
    response: "Mon-Fri 9AM-6PM PST"
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          py: 8, 
          px: { xs: 2, sm: 3, lg: 4 }, 
          background: 'linear-gradient(to right, #dbeafe, #e9d5ff)',
          '& .dark &': {
            background: 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', sm: '3rem' }, 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 3 
            }}
          >
            How Can We Help?
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              color: 'text.secondary', 
              mb: 4 
            }}
          >
            Find answers, get support, and learn how to make the most of CreatorFlow.
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ color: 'inherit' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Help Categories */}
      <Box component="section" sx={{ py: 8, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Help Categories
          </Typography>
          
          <Grid container spacing={3}>
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Grid item xs={12} sm={6} lg={3} key={category.title}>
                  <Link
                    href={`/support/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        '&:hover': {
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out',
                        }
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: 'primary.50', 
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mx: 'auto', 
                            mb: 2 
                          }}
                        >
                          <Icon style={{ color: 'inherit', fontSize: 24 }} />
                        </Box>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'text.primary', 
                            mb: 1 
                          }}
                        >
                          {category.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            mb: 1.5 
                          }}
                        >
                          {category.description}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.disabled' 
                          }}
                        >
                          {category.articles} articles
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Box 
        component="section" 
        sx={{ 
          py: 8, 
          px: { xs: 2, sm: 3, lg: 4 }, 
          bgcolor: 'grey.50' 
        }}
      >
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Get in Touch
          </Typography>
          
          <Grid container spacing={3}>
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Grid item xs={12} md={4} key={method.title}>
                  <Card sx={{ p: 3, textAlign: 'center' }}>
                    <CardContent>
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          bgcolor: 'primary.50', 
                          borderRadius: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mx: 'auto', 
                          mb: 2 
                        }}
                      >
                        <Icon style={{ color: 'inherit', fontSize: 24 }} />
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 600, 
                          color: 'text.primary', 
                          mb: 1 
                        }}
                      >
                        {method.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'text.secondary', 
                          mb: 1.5 
                        }}
                      >
                        {method.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500, 
                            color: 'text.primary' 
                          }}
                        >
                          {method.contact}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.disabled' 
                          }}
                        >
                          {method.response}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Legal & Policies */}
      <Box component="section" sx={{ py: 8, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Legal & Policies
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Link href="/terms" style={{ textDecoration: 'none' }}>
                <Card 
                  sx={{ 
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: 'primary.50', 
                      borderRadius: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}
                  >
                    <FileText style={{ color: 'inherit', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary', 
                        mb: 0.5 
                      }}
                    >
                      Terms of Service
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary' 
                      }}
                    >
                      Read our terms and conditions
                    </Typography>
                  </Box>
                </Card>
              </Link>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Link href="/privacy" style={{ textDecoration: 'none' }}>
                <Card 
                  sx={{ 
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    '&:hover': {
                      borderColor: 'secondary.main',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: 'secondary.50', 
                      borderRadius: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}
                  >
                    <Shield style={{ color: 'inherit', fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary', 
                        mb: 0.5 
                      }}
                    >
                      Privacy Policy
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary' 
                      }}
                    >
                      Learn how we protect your data
                    </Typography>
                  </Box>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box 
        component="section" 
        sx={{ 
          py: 8, 
          px: { xs: 2, sm: 3, lg: 4 }, 
          bgcolor: 'grey.50' 
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1 
                }}
              >
                How do I get started with CreatorFlow?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary' 
                }}
              >
                Sign up for a free account and connect your social media platforms. Our guided setup will help you get started in minutes.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1 
                }}
              >
                What platforms does CreatorFlow support?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary' 
                }}
              >
                We support all major platforms including Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, and more.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1 
                }}
              >
                How much does CreatorFlow cost?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary' 
                }}
              >
                We offer a free plan to get started, with Pro plans starting at $12/month for advanced features and analytics.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary', 
                  mb: 1 
                }}
              >
                Is my data secure?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary' 
                }}
              >
                Yes, we use industry-standard encryption and security measures to protect your data and account information.
              </Typography>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box component="section" sx={{ py: 8, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              mb: 2 
            }}
          >
            Still Need Help?
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              color: 'text.secondary', 
              mb: 4 
            }}
          >
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button 
              component={Link}
              href="/contact" 
              variant="contained"
              sx={{ 
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                }
              }}
            >
              Contact Support
            </Button>
            <Button 
              component={Link}
              href="/auth" 
              variant="outlined"
              sx={{ 
                '&:hover': {
                  bgcolor: 'grey.50',
                }
              }}
            >
              Sign Up Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: '128px', sm: '40px' }, width: '100%' }} />

      <Footer />
    </Box>
  );
} 