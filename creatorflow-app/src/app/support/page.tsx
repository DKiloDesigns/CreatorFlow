'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Description as FileTextIcon,
  Security as ShieldIcon,
  Mail as MailIcon,
  Group as UsersIcon,
  BarChart as BarChart3Icon,
  Search as SearchIcon,
  BookOutlined as BookOpenIcon,
  Chat as MessageSquareIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
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
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles'; // Import useTheme

const helpCategories = [
  {
    title: "Getting Started",
    description: "Learn the basics of floai.studio",
    icon: BookOpenIcon,
    articles: 12
  },
  {
    title: "Account & Billing",
    description: "Manage your account and payments",
    icon: UsersIcon,
    articles: 8
  },
  {
    title: "Content Creation",
    description: "Tips for creating great content",
    icon: FileTextIcon,
    articles: 15
  },
  {
    title: "Analytics & Insights",
    description: "Understand your performance data",
    icon: BarChart3Icon,
    articles: 10
  }
];

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email",
    icon: MailIcon,
    contact: "support@floai.studio",
    response: "Within 24 hours"
  },
  {
    title: "Live Chat",
    description: "Chat with our team",
    icon: MessageSquareIcon,
    contact: "Available 9AM-6PM PST",
    response: "Real-time"
  },
  {
    title: "Phone Support",
    description: "Call us directly",
    icon: PhoneIcon,
    contact: "+1 (555) 123-4567",
    response: "Mon-Fri 9AM-6PM PST"
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const theme = useTheme(); // Initialize useTheme

  // Search function
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.articles);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          px: { xs: 2, sm: 3, lg: 4 }, 
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
            : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))', // Custom gradient, can be moved to theme if frequently used
        }}
      >
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
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
            </Box>
            <Box sx={{ width: 48, mr: 2 }} /> {/* Spacer to balance the IconButton */}
          </Box>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              color: 'text.secondary', 
              mb: 4 
            }}
          >
            Find answers, get support, and learn how to make the most of floai.studio.
          </Typography>
          
          {/* Search Bar */}
          <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: isSearching ? (
                  <InputAdornment position="end">
                    <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: theme.palette.background.paper,
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  }
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Search Results */}
      {showResults && (
        <Box component="section" sx={{ py: 4, px: { xs: 2, sm: 3, lg: 4 } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.text.primary }}>
              Search Results
            </Typography>
            
            {searchResults.length > 0 ? (
              <List>
                {searchResults.map((article, index) => (
                  <React.Fragment key={article.id}>
                    <ListItem 
                      component="a" 
                      href={`/support/article/${article.id}`}
                      sx={{ 
                        textDecoration: 'none',
                        '&:hover': { bgcolor: theme.palette.action.hover },
                        borderRadius: 1,
                        mb: 1,
                        color: theme.palette.text.primary // Ensure link text color is primary
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            {article.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                              {article.content.substring(0, 150)}...
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              <Chip 
                                label={article.category} 
                                size="small" 
                                color="primary" 
                                variant="outlined" 
                              />
                              <Chip 
                                label={article.difficulty} 
                                size="small" 
                                color="secondary" 
                                variant="outlined" 
                              />
                              <Chip 
                                label={`${article.readTime} min read`} 
                                size="small" 
                                color="default" // Use default color for consistency
                                variant="outlined" 
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < searchResults.length - 1 && <Divider sx={{ borderColor: theme.palette.divider }} />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
                  No articles found for "{searchQuery}"
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  Try different keywords or browse our help categories below
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      )}

      {/* Help Categories */}
      <Box component="section" sx={{ py: 8, px: { xs: 2, sm: 3, lg: 4 } }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
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
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out',
                        },
                        border: `1px solid ${theme.palette.divider}` // Ensure border is theme-consistent
                      }}
                    >
                      <CardContent>
                        <Box 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            bgcolor: theme.palette.primary.light, // Using primary.light for consistency
                            borderRadius: 1, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mx: 'auto', 
                            mb: 2 
                          }}
                        >
                          <Icon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                        </Box>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600, 
                            color: theme.palette.text.primary, 
                            mb: 1 
                          }}
                        >
                          {category.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: theme.palette.text.secondary, 
                            mb: 1.5 
                          }}
                        >
                          {category.description}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.disabled 
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
          bgcolor: theme.palette.background.default 
        }}
      >
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
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
                  <Card sx={{ p: 3, textAlign: 'center', border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Box 
                        sx={{ 
                          width: 48, 
                          height: 48, 
                          bgcolor: theme.palette.primary.light, // Using primary.light for consistency
                          borderRadius: 1, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mx: 'auto', 
                          mb: 2 
                        }}
                      >
                        <Icon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                      </Box>
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 600, 
                          color: theme.palette.text.primary, 
                          mb: 1 
                        }}
                      >
                        {method.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: theme.palette.text.secondary, 
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
                            color: theme.palette.text.primary 
                          }}
                        >
                          {method.contact}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: theme.palette.text.disabled 
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
              color: theme.palette.text.primary, 
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
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                    border: `1px solid ${theme.palette.divider}` // Ensure border is theme-consistent
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: theme.palette.primary.light, // Using primary.light for consistency
                      borderRadius: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}
                  >
                    <FileTextIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.text.primary, 
                        mb: 0.5 
                      }}
                    >
                      Terms of Service
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary 
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
                      borderColor: theme.palette.secondary.main,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out',
                    },
                    border: `1px solid ${theme.palette.divider}` // Ensure border is theme-consistent
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: theme.palette.secondary.light, // Using secondary.light for consistency
                      borderRadius: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      flexShrink: 0 
                    }}
                  >
                    <ShieldIcon sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.text.primary, 
                        mb: 0.5 
                      }}
                    >
                      Privacy Policy
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary 
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
          bgcolor: theme.palette.background.default 
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 'bold', 
              color: theme.palette.text.primary, 
              mb: 4, 
              textAlign: 'center' 
            }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1 
                }}
              >
                How do I get started with floai.studio?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary 
                }}
              >
                Sign up for a free account and connect your social media platforms. Our guided setup will help you get started in minutes.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1 
                }}
              >
                What platforms does floai.studio support?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary 
                }}
              >
                We support all major platforms including Instagram, TikTok, YouTube, Twitter, LinkedIn, Facebook, and more.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1 
                }}
              >
                How much does floai.studio cost?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary 
                }}
              >
                We offer a free plan to get started, with Pro plans starting at $12/month for advanced features and analytics.
              </Typography>
            </Card>
            
            <Card sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
              <Typography 
                variant="h6" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.primary, 
                  mb: 1 
                }}
              >
                Is my data secure?
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.secondary 
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
              color: theme.palette.text.primary, 
              mb: 2 
            }}
          >
            Still Need Help?
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              color: theme.palette.text.secondary, 
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
                bgcolor: theme.palette.primary.main, // Use theme.palette.primary.main for button background
                color: theme.palette.common.white,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark, // Use theme.palette.primary.dark for hover
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
                borderColor: theme.palette.primary.main, // Outline button border color
                color: theme.palette.primary.main, // Outline button text color
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                  borderColor: theme.palette.primary.dark,
                }
              }}
            >
              Sign Up Free
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{ height: { xs: 32, sm: 10 }, width: '100%' }} />
    </PublicPageLayout>
  );
} 