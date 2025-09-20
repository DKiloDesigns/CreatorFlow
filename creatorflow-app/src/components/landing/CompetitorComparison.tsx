'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  CheckCircle,
  Close,
  Star,
  StarBorder,
  TrendingUp,
  ArrowForward,
  Info,
  Security,
  Support,
  Speed,
  Analytics
} from '@mui/icons-material';

const COMPETITORS = [
  {
    name: 'CreatorFlow',
    logo: 'CF',
    color: '#3B82F6',
    isCreatorFlow: true,
    rating: 5.0,
    reviews: '2,500+',
    price: '$29/month',
    features: {
      platforms: '16+',
      teamMembers: 'Unlimited',
      postsPerMonth: 'Unlimited',
      analytics: 'Advanced AI',
      scheduling: 'Smart AI',
      collaboration: 'Full Suite',
      whiteLabel: 'Included',
      support: '24/7 Priority',
      apiAccess: 'Full API',
      customBranding: 'Included',
      sso: 'Included',
      compliance: 'SOC 2 + GDPR'
    }
  },
  {
    name: 'Hootsuite',
    logo: 'H',
    color: '#1DA1F2',
    isCreatorFlow: false,
    rating: 4.2,
    reviews: '15,000+',
    price: '$49/month',
    features: {
      platforms: '8',
      teamMembers: '1',
      postsPerMonth: '10',
      analytics: 'Basic',
      scheduling: 'Manual',
      collaboration: 'Limited',
      whiteLabel: '$200/month',
      support: 'Email Only',
      apiAccess: 'Limited',
      customBranding: 'Extra Cost',
      sso: 'Extra Cost',
      compliance: 'Basic'
    }
  },
  {
    name: 'Buffer',
    logo: 'B',
    color: '#168EEA',
    isCreatorFlow: false,
    rating: 4.1,
    reviews: '8,500+',
    price: '$15/month',
    features: {
      platforms: '6',
      teamMembers: '1',
      postsPerMonth: '25',
      analytics: 'Basic',
      scheduling: 'Basic',
      collaboration: 'None',
      whiteLabel: 'Not Available',
      support: 'Community',
      apiAccess: 'None',
      customBranding: 'Not Available',
      sso: 'Not Available',
      compliance: 'Basic'
    }
  },
  {
    name: 'Sprout Social',
    logo: 'S',
    color: '#25D366',
    isCreatorFlow: false,
    rating: 4.3,
    reviews: '12,000+',
    price: '$249/month',
    features: {
      platforms: '10',
      teamMembers: '1',
      postsPerMonth: '5',
      analytics: 'Advanced',
      scheduling: 'Advanced',
      collaboration: 'Full Suite',
      whiteLabel: '$500/month',
      support: '24/7',
      apiAccess: 'Full API',
      customBranding: 'Extra Cost',
      sso: 'Extra Cost',
      compliance: 'SOC 2'
    }
  }
];

const FEATURE_CATEGORIES = [
  {
    title: 'Platform Support',
    icon: <TrendingUp />,
    features: [
      { key: 'platforms', label: 'Social Platforms', description: 'Number of platforms supported' },
      { key: 'teamMembers', label: 'Team Members', description: 'Included team members' },
      { key: 'postsPerMonth', label: 'Posts per Month', description: 'Monthly post limit' }
    ]
  },
  {
    title: 'Features & Tools',
    icon: <Analytics />,
    features: [
      { key: 'analytics', label: 'Analytics', description: 'Analytics capabilities' },
      { key: 'scheduling', label: 'Scheduling', description: 'Post scheduling features' },
      { key: 'collaboration', label: 'Collaboration', description: 'Team collaboration tools' }
    ]
  },
  {
    title: 'Enterprise Features',
    icon: <Security />,
    features: [
      { key: 'whiteLabel', label: 'White-Label', description: 'White-label capabilities' },
      { key: 'apiAccess', label: 'API Access', description: 'API access level' },
      { key: 'customBranding', label: 'Custom Branding', description: 'Custom branding options' },
      { key: 'sso', label: 'SSO', description: 'Single Sign-On support' },
      { key: 'compliance', label: 'Compliance', description: 'Security compliance' }
    ]
  },
  {
    title: 'Support & Service',
    icon: <Support />,
    features: [
      { key: 'support', label: 'Support', description: 'Customer support level' }
    ]
  }
];

export function CompetitorComparison() {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [hoveredCompetitor, setHoveredCompetitor] = useState<string | null>(null);

  const getFeatureValue = (competitor: any, featureKey: string) => {
    return competitor.features[featureKey] || 'N/A';
  };

  const getFeatureColor = (value: string, isCreatorFlow: boolean) => {
    if (isCreatorFlow) return 'success';
    if (value.includes('Unlimited') || value.includes('Full') || value.includes('Included')) return 'success';
    if (value.includes('Limited') || value.includes('Basic') || value.includes('Extra Cost')) return 'warning';
    if (value.includes('Not Available') || value.includes('None')) return 'error';
    return 'default';
  };

  const getFeatureIcon = (value: string) => {
    if (value.includes('Unlimited') || value.includes('Full') || value.includes('Included')) return <CheckCircle />;
    if (value.includes('Not Available') || value.includes('None')) return <Close />;
    return null;
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            CreatorFlow vs Competitors
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            See how CreatorFlow compares to the leading social media management platforms
          </Typography>
        </Box>

        {/* Competitor Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {COMPETITORS.map((competitor, index) => (
            <Grid item xs={12} sm={6} md={3} key={competitor.name}>
              <Fade in={true} timeout={500 + index * 100}>
                <Card sx={{ 
                  height: '100%',
                  position: 'relative',
                  border: competitor.isCreatorFlow ? 3 : 1,
                  borderColor: competitor.isCreatorFlow ? 'primary.main' : 'divider',
                  transition: 'all 0.3s ease',
                  transform: hoveredCompetitor === competitor.name ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCompetitor === competitor.name ? 8 : 2,
                  '&:hover': {
                    boxShadow: 8
                  }
                }}
                onMouseEnter={() => setHoveredCompetitor(competitor.name)}
                onMouseLeave={() => setHoveredCompetitor(null)}
                >
                  {competitor.isCreatorFlow && (
                    <Chip
                      label="RECOMMENDED"
                      color="primary"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: competitor.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <Typography variant="h4" sx={{ 
                        color: 'white', 
                        fontWeight: 'bold' 
                      }}>
                        {competitor.logo}
                      </Typography>
                    </Box>

                    <Typography variant="h5" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: 'text.primary'
                    }}>
                      {competitor.name}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            sx={{ 
                              color: i < Math.floor(competitor.rating) ? 'warning.main' : 'grey.300',
                              fontSize: '1.2rem'
                            }} 
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {competitor.rating} ({competitor.reviews})
                      </Typography>
                    </Box>

                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: competitor.isCreatorFlow ? 'primary.main' : 'text.primary'
                    }}>
                      {competitor.price}
                    </Typography>

                    <Button
                      variant={competitor.isCreatorFlow ? 'contained' : 'outlined'}
                      fullWidth
                      sx={{
                        py: 1.5,
                        fontWeight: 'bold',
                        background: competitor.isCreatorFlow 
                          ? 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)'
                          : 'transparent',
                        '&:hover': {
                          background: competitor.isCreatorFlow 
                            ? 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                            : 'action.hover'
                        }
                      }}
                    >
                      {competitor.isCreatorFlow ? 'Start Free Trial' : 'View Details'}
                    </Button>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Feature Comparison Table */}
        <Paper sx={{ mb: 6 }}>
          <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Detailed Feature Comparison
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {FEATURE_CATEGORIES.map((category, index) => (
                <Chip
                  key={index}
                  label={category.title}
                  variant={selectedCategory === index ? 'filled' : 'outlined'}
                  color={selectedCategory === index ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(index)}
                  icon={category.icon}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>
                    Feature
                  </TableCell>
                  {COMPETITORS.map((competitor) => (
                    <TableCell 
                      key={competitor.name}
                      sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center',
                        bgcolor: competitor.isCreatorFlow ? 'primary.50' : 'transparent',
                        color: competitor.isCreatorFlow ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {competitor.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {FEATURE_CATEGORIES[selectedCategory].features.map((feature, featureIndex) => (
                  <TableRow key={featureIndex}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }} component="div">
                          {feature.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div">
                          {feature.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    {COMPETITORS.map((competitor) => {
                      const value = getFeatureValue(competitor, feature.key);
                      return (
                        <TableCell 
                          key={competitor.name}
                          sx={{ 
                            textAlign: 'center',
                            bgcolor: competitor.isCreatorFlow ? 'primary.50' : 'transparent'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            {getFeatureIcon(value)}
                            <Chip
                              label={value}
                              color={getFeatureColor(value, competitor.isCreatorFlow) as any}
                              size="small"
                              variant={competitor.isCreatorFlow ? 'filled' : 'outlined'}
                            />
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Key Advantages */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Why Choose CreatorFlow?
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <TrendingUp />,
                title: 'Most Platforms',
                description: 'Support for 16+ platforms vs 6-10 for competitors',
                advantage: '2x More Platforms'
              },
              {
                icon: <Speed />,
                title: 'Best Value',
                description: 'More features at lower cost than competitors',
                advantage: '50% Less Cost'
              },
              {
                icon: <Analytics />,
                title: 'AI-Powered',
                description: 'Advanced AI analytics and scheduling',
                advantage: 'AI Advantage'
              },
              {
                icon: <Security />,
                title: 'Enterprise Ready',
                description: 'White-label and SSO included at no extra cost',
                advantage: 'No Extra Fees'
              }
            ].map((advantage, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} timeout={500 + index * 100}>
                  <Paper sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {advantage.icon}
                    </Box>
                    <Chip
                      label={advantage.advantage}
                      color="success"
                      sx={{ mb: 2, fontWeight: 'bold' }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {advantage.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {advantage.description}
                    </Typography>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Experience the Difference?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Join thousands of creators who've made the switch to CreatorFlow
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            Start Your Free Trial Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
