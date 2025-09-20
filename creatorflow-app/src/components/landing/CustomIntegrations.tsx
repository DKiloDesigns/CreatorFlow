'use client';

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Zoom
} from '@mui/material';
import { 
  Extension, 
  Code, 
  Api, 
  Webhook, 
  Storage, 
  CloudUpload, 
  Security, 
  Speed,
  CheckCircle,
  ExpandMore,
  Build,
  Integration,
  Settings,
  DataObject,
  CloudDone
} from '@mui/icons-material';

const INTEGRATION_CATEGORIES = [
  {
    title: 'CRM & Sales',
    icon: <Storage />,
    integrations: [
      { name: 'Salesforce', status: 'Available', type: 'Native' },
      { name: 'HubSpot', status: 'Available', type: 'Native' },
      { name: 'Pipedrive', status: 'Available', type: 'API' },
      { name: 'Zoho CRM', status: 'Available', type: 'Webhook' }
    ],
    color: '#3B82F6'
  },
  {
    title: 'Marketing Tools',
    icon: <Extension />,
    integrations: [
      { name: 'Mailchimp', status: 'Available', type: 'Native' },
      { name: 'ConvertKit', status: 'Available', type: 'API' },
      { name: 'ActiveCampaign', status: 'Available', type: 'Native' },
      { name: 'Klaviyo', status: 'Available', type: 'Webhook' }
    ],
    color: '#10B981'
  },
  {
    title: 'Analytics & Data',
    icon: <DataObject />,
    integrations: [
      { name: 'Google Analytics', status: 'Available', type: 'Native' },
      { name: 'Mixpanel', status: 'Available', type: 'API' },
      { name: 'Amplitude', status: 'Available', type: 'Webhook' },
      { name: 'Segment', status: 'Available', type: 'Native' }
    ],
    color: '#8B5CF6'
  },
  {
    title: 'E-commerce',
    icon: <CloudUpload />,
    integrations: [
      { name: 'Shopify', status: 'Available', type: 'Native' },
      { name: 'WooCommerce', status: 'Available', type: 'API' },
      { name: 'BigCommerce', status: 'Available', type: 'Webhook' },
      { name: 'Magento', status: 'Available', type: 'API' }
    ],
    color: '#F59E0B'
  }
];

const API_FEATURES = [
  {
    icon: <Api />,
    title: 'RESTful API',
    description: 'Full REST API with comprehensive endpoints',
    features: ['Authentication', 'Rate Limiting', 'Webhooks', 'SDKs']
  },
  {
    icon: <Webhook />,
    title: 'Real-time Webhooks',
    description: 'Get instant notifications for events',
    features: ['Event Triggers', 'Retry Logic', 'Security', 'Monitoring']
  },
  {
    icon: <Code />,
    title: 'SDKs & Libraries',
    description: 'Ready-to-use libraries for popular languages',
    features: ['JavaScript', 'Python', 'PHP', 'Ruby', 'Go']
  },
  {
    icon: <Security />,
    title: 'Enterprise Security',
    description: 'Bank-grade security for your integrations',
    features: ['OAuth 2.0', 'JWT Tokens', 'IP Whitelisting', 'Audit Logs']
  }
];

const CUSTOM_INTEGRATION_STEPS = [
  {
    step: 1,
    title: 'Choose Integration Type',
    description: 'Select from API, Webhook, or Native integration',
    icon: <Settings />
  },
  {
    step: 2,
    title: 'Configure Connection',
    description: 'Set up authentication and connection parameters',
    icon: <Build />
  },
  {
    step: 3,
    title: 'Test & Validate',
    description: 'Test your integration with our validation tools',
    icon: <CheckCircle />
  },
  {
    step: 4,
    title: 'Deploy & Monitor',
    description: 'Deploy your integration and monitor performance',
    icon: <CloudDone />
  }
];

export function CustomIntegrations() {
  const [expandedCategory, setExpandedCategory] = useState(0);

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.default',
      position: 'relative'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Custom Integrations & APIs
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Connect CreatorFlow with any tool in your stack using our powerful APIs and pre-built integrations
          </Typography>
        </Box>

        {/* Integration Categories */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Available Integrations
          </Typography>
          <Grid container spacing={2}>
            {INTEGRATION_CATEGORIES.map((category, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Accordion 
                  expanded={expandedCategory === index}
                  onChange={() => setExpandedCategory(expandedCategory === index ? -1 : index)}
                  sx={{
                    '&:before': { display: 'none' },
                    boxShadow: 2,
                    borderRadius: 2,
                    '&.Mui-expanded': {
                      margin: 0
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{
                      bgcolor: category.color,
                      color: 'white',
                      borderRadius: expandedCategory === index ? '8px 8px 0 0' : '8px',
                      '&:hover': {
                        bgcolor: category.color,
                        opacity: 0.9
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Box sx={{ mr: 2, '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }}>
                        {category.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {category.title}
                      </Typography>
                      <Chip 
                        label={`${category.integrations.length} integrations`}
                        size="small"
                        sx={{ 
                          ml: 'auto', 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 0 }}>
                    <List>
                      {category.integrations.map((integration, idx) => (
                        <ListItem key={idx} sx={{ px: 3 }}>
                          <ListItemIcon>
                            <CheckCircle sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={integration.name}
                            secondary={`${integration.type} Integration`}
                          />
                          <Chip 
                            label={integration.status}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* API Features */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            API Features & Capabilities
          </Typography>
          <Grid container spacing={3}>
            {API_FEATURES.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={true} style={{ transitionDelay: `${index * 0.1}s` }}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box sx={{ 
                        color: 'primary.main',
                        mb: 2,
                        '& .MuiSvgIcon-root': {
                          fontSize: '3rem'
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
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                        {feature.features.map((item, idx) => (
                          <Chip 
                            key={idx}
                            label={item} 
                            size="small" 
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Custom Integration Process */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Build Custom Integrations
          </Typography>
          <Grid container spacing={3}>
            {CUSTOM_INTEGRATION_STEPS.map((step, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in={true} style={{ transitionDelay: `${index * 0.2}s` }}>
                  <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                    <Box sx={{ 
                      color: 'primary.main',
                      mb: 2,
                      '& .MuiSvgIcon-root': {
                        fontSize: '2.5rem'
                      }
                    }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: 'primary.main'
                    }}>
                      Step {step.step}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Code Example */}
        <Paper sx={{ p: 4, mb: 6, bgcolor: 'grey.50' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Quick Start Example
          </Typography>
          <Box sx={{ 
            bgcolor: 'grey.900', 
            color: 'white', 
            p: 3, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto'
          }}>
            <pre>{`// Initialize CreatorFlow API
const creatorflow = new CreatorFlowAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.creatorflow.com'
});

// Create a new post
const post = await creatorflow.posts.create({
  content: 'Hello from CreatorFlow API!',
  platforms: ['instagram', 'twitter', 'facebook'],
  scheduledAt: '2024-01-15T14:00:00Z'
});

// Set up webhook for real-time updates
creatorflow.webhooks.subscribe('post.published', (event) => {
  console.log('Post published:', event.data);
});`}</pre>
          </Box>
        </Paper>

        {/* CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Code />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)'
              }
            }}
          >
            View API Documentation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
