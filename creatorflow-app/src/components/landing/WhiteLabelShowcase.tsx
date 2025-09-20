'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Button,
  Fade,
  Zoom,
  Tabs,
  Tab,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  Palette,
  Business,
  Code,
  Security,
  CheckCircle,
  ArrowForward,
  Visibility,
  Edit,
  BrandingWatermark,
  Api,
  CloudSync,
  Support
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`white-label-tabpanel-${index}`}
      aria-labelledby={`white-label-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const WHITE_LABEL_FEATURES = [
  {
    icon: <Palette />,
    title: 'Custom Branding',
    description: 'Complete visual customization to match your brand',
    features: [
      'Custom logo and favicon',
      'Brand colors and typography',
      'Custom domain (yourname.com)',
      'White-label email templates',
      'Custom login/signup pages'
    ]
  },
  {
    icon: <Business />,
    title: 'Client Management',
    description: 'Manage multiple client accounts from one dashboard',
    features: [
      'Multi-tenant architecture',
      'Client-specific dashboards',
      'Role-based access control',
      'Client billing management',
      'Usage analytics per client'
    ]
  },
  {
    icon: <Code />,
    title: 'API Access',
    description: 'Full API access for custom integrations',
    features: [
      'RESTful API endpoints',
      'Webhook support',
      'SDK for popular languages',
      'Rate limiting and monitoring',
      'Custom integration support'
    ]
  },
  {
    icon: <Security />,
    title: 'Enterprise Security',
    description: 'Advanced security features for enterprise clients',
    features: [
      'SSO and SAML integration',
      'Custom security policies',
      'Audit logs and compliance',
      'Data residency options',
      'Private cloud deployment'
    ]
  }
];

const CUSTOMIZATION_OPTIONS = [
  {
    category: 'Visual Branding',
    options: [
      'Logo and brand colors',
      'Custom typography',
      'Dashboard themes',
      'Email templates',
      'Mobile app branding'
    ]
  },
  {
    category: 'Functionality',
    options: [
      'Custom feature sets',
      'White-label integrations',
      'Custom workflows',
      'Client-specific tools',
      'API customizations'
    ]
  },
  {
    category: 'Deployment',
    options: [
      'Custom domain setup',
      'SSL certificate management',
      'CDN configuration',
      'Database setup',
      'Monitoring and alerts'
    ]
  }
];

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '$99/month',
    description: 'Perfect for small agencies',
    features: [
      'Up to 5 client accounts',
      'Basic white-labeling',
      'Custom domain',
      'Email support',
      'Standard integrations'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '$299/month',
    description: 'Ideal for growing agencies',
    features: [
      'Up to 25 client accounts',
      'Full white-labeling',
      'Custom branding',
      'API access',
      'Priority support',
      'Advanced analytics'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited client accounts',
      'Complete customization',
      'Private cloud option',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantees'
    ],
    popular: false
  }
];

export function WhiteLabelShowcase() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      borderTop: 1,
      borderBottom: 1,
      borderColor: 'divider'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            White-Label Solutions
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Rebrand CreatorFlow as your own platform and serve your clients
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {WHITE_LABEL_FEATURES.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in={true} timeout={500 + index * 100}>
                <Card sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <List dense>
                      {feature.features.slice(0, 3).map((item, itemIndex) => (
                        <ListItem key={itemIndex} sx={{ py: 0.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Customization Options */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Customization Options
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Visual Branding" />
              <Tab label="Functionality" />
              <Tab label="Deployment" />
            </Tabs>
          </Box>

          {CUSTOMIZATION_OPTIONS.map((category, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {category.category}
                  </Typography>
                  <List>
                    {category.options.map((option, optionIndex) => (
                      <ListItem key={optionIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircle sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={option}
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'primary.50',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Visibility sx={{ 
                        color: 'primary.main', 
                        fontSize: '4rem',
                        mb: 2
                      }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Live Preview
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        See your customizations in real-time
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
          ))}
        </Paper>

        {/* Pricing Tiers */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            White-Label Pricing
          </Typography>
          <Grid container spacing={3}>
            {PRICING_TIERS.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={true} timeout={500 + index * 100}>
                  <Card sx={{ 
                    height: '100%',
                    position: 'relative',
                    border: tier.popular ? 3 : 1,
                    borderColor: tier.popular ? 'primary.main' : 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    {tier.popular && (
                      <Chip
                        label="MOST POPULAR"
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
                    
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {tier.name}
                      </Typography>
                      <Typography variant="h3" sx={{ 
                        fontWeight: 'bold', 
                        mb: 1,
                        color: tier.popular ? 'primary.main' : 'text.primary'
                      }}>
                        {tier.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {tier.description}
                      </Typography>
                      
                      <List dense>
                        {tier.features.map((feature, featureIndex) => (
                          <ListItem key={featureIndex} sx={{ py: 0.5, px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={feature}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      <Button
                        variant={tier.popular ? 'contained' : 'outlined'}
                        fullWidth
                        sx={{
                          mt: 3,
                          py: 1.5,
                          fontWeight: 'bold',
                          background: tier.popular 
                            ? 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)'
                            : 'transparent',
                          '&:hover': {
                            background: tier.popular 
                              ? 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)'
                              : 'action.hover'
                          }
                        }}
                      >
                        {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Implementation Process */}
        <Paper sx={{ p: 4, mb: 6, bgcolor: 'success.50' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Implementation Process
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                step: '1',
                title: 'Discovery & Planning',
                description: 'We work with you to understand your requirements and create a custom implementation plan.',
                icon: <Edit />
              },
              {
                step: '2',
                title: 'Design & Branding',
                description: 'Our team creates custom designs and branding that matches your visual identity.',
                icon: <Palette />
              },
              {
                step: '3',
                title: 'Development & Integration',
                description: 'We implement your white-label solution with all requested customizations and integrations.',
                icon: <Code />
              },
              {
                step: '4',
                title: 'Testing & Launch',
                description: 'Thorough testing and quality assurance before launching your branded platform.',
                icon: <CheckCircle />
              }
            ].map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'success.main',
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
                      {step.step}
                    </Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready to Launch Your White-Label Platform?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Get a custom demo and pricing quote for your organization
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #3B82F6 30%, #8B5CF6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2563EB 30%, #7C3AED 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: 4
                }
              }}
            >
              Request Custom Demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
            >
              Download White-Label Guide
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
