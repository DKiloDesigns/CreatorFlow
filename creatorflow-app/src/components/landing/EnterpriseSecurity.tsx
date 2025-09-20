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
  Chip,
  Button,
  Fade,
  Zoom,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Security,
  Verified,
  Shield,
  Lock,
  CheckCircle,
  ArrowForward,
  ExpandMore,
  Business,
  GppGood,
  Policy,
  Assessment,
  VpnKey,
  CloudSync,
  Backup,
  Monitor
} from '@mui/icons-material';

const SECURITY_FEATURES = [
  {
    icon: <Security />,
    title: 'SOC 2 Type II Certified',
    description: 'Audited security controls and processes',
    details: [
      'Annual third-party security audits',
      'Comprehensive security controls',
      'Risk assessment and management',
      'Continuous monitoring and improvement'
    ],
    status: 'Certified'
  },
  {
    icon: <Verified />,
    title: 'GDPR Compliant',
    description: 'Full compliance with EU data protection regulations',
    details: [
      'Data processing agreements (DPAs)',
      'Right to be forgotten implementation',
      'Data portability features',
      'Privacy by design principles'
    ],
    status: 'Compliant'
  },
  {
    icon: <Shield />,
    title: 'ISO 27001 Ready',
    description: 'Information security management system',
    details: [
      'Information security policies',
      'Risk management framework',
      'Security incident management',
      'Business continuity planning'
    ],
    status: 'Ready'
  },
  {
    icon: <Lock />,
    title: 'End-to-End Encryption',
    description: '256-bit SSL/TLS encryption for all data',
    details: [
      'Data in transit encryption',
      'Data at rest encryption',
      'API communication security',
      'Database encryption'
    ],
    status: 'Active'
  },
  {
    icon: <VpnKey />,
    title: 'SSO & SAML Integration',
    description: 'Enterprise single sign-on capabilities',
    details: [
      'SAML 2.0 support',
      'OAuth 2.0 integration',
      'Active Directory integration',
      'Multi-factor authentication'
    ],
    status: 'Available'
  },
  {
    icon: <CloudSync />,
    title: '99.9% Uptime SLA',
    description: 'Guaranteed service availability',
    details: [
      'Redundant infrastructure',
      'Automated failover',
      '24/7 monitoring',
      'Performance guarantees'
    ],
    status: 'Guaranteed'
  }
];

const COMPLIANCE_BADGES = [
  { name: 'SOC 2 Type II', status: 'Certified', color: 'success' },
  { name: 'GDPR', status: 'Compliant', color: 'success' },
  { name: 'ISO 27001', status: 'Ready', color: 'info' },
  { name: 'CCPA', status: 'Compliant', color: 'success' },
  { name: 'HIPAA', status: 'Ready', color: 'info' },
  { name: 'PCI DSS', status: 'Compliant', color: 'success' }
];

const SECURITY_METRICS = [
  { label: 'Security Score', value: '98/100', icon: <Security /> },
  { label: 'Uptime', value: '99.9%', icon: <Monitor /> },
  { label: 'Data Centers', value: '3+', icon: <CloudSync /> },
  { label: 'Penetration Tests', value: 'Monthly', icon: <Assessment /> }
];

export function EnterpriseSecurity() {
  const [expandedFeature, setExpandedFeature] = useState<number | false>(false);

  const handleFeatureExpand = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFeature(isExpanded ? panel : false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Certified':
      case 'Compliant':
      case 'Active':
      case 'Guaranteed':
        return 'success';
      case 'Ready':
      case 'Available':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ 
      py: 8, 
      bgcolor: 'background.paper'
    }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            color: 'text.primary'
          }}>
            Enterprise-Grade Security
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Built with security and compliance at its core
          </Typography>
        </Box>

        {/* Security Metrics */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {SECURITY_METRICS.map((metric, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Fade in={true} timeout={500 + index * 100}>
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
                    {metric.icon}
                  </Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    mb: 1,
                    color: 'text.primary'
                  }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {metric.label}
                  </Typography>
                </Paper>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Compliance Badges */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
            Compliance & Certifications
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            {COMPLIANCE_BADGES.map((badge, index) => (
              <Chip
                key={index}
                icon={<CheckCircle />}
                label={`${badge.name} - ${badge.status}`}
                color={badge.color as any}
                variant="outlined"
                sx={{ 
                  fontWeight: 'bold',
                  height: 40,
                  fontSize: '0.9rem'
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Security Features */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
            Security Features & Controls
          </Typography>
          <Grid container spacing={3}>
            {SECURITY_FEATURES.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in={true} timeout={500 + index * 100}>
                  <Card sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Accordion 
                      expanded={expandedFeature === index}
                      onChange={handleFeatureExpand(index)}
                      sx={{ 
                        boxShadow: 'none',
                        '&:before': { display: 'none' }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ 
                          minHeight: 80,
                          '& .MuiAccordionSummary-content': {
                            alignItems: 'center'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Box sx={{ 
                            color: 'primary.main',
                            '& .MuiSvgIcon-root': {
                              fontSize: '2rem'
                            }
                          }}>
                            {feature.icon}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {feature.title}
                              </Typography>
                              <Chip
                                label={feature.status}
                                color={getStatusColor(feature.status) as any}
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {feature.details.map((detail, detailIndex) => (
                            <ListItem key={detailIndex} sx={{ py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle sx={{ color: 'success.main', fontSize: '1.2rem' }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Data Protection */}
        <Paper sx={{ p: 4, mb: 6, bgcolor: 'primary.50' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Data Protection & Privacy
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <GppGood sx={{ color: 'primary.main', fontSize: '2rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Privacy by Design
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    We implement privacy controls from the ground up, ensuring your data is protected at every step.
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Data minimization principles"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Consent management"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Regular privacy impact assessments"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Backup sx={{ color: 'primary.main', fontSize: '2rem', mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Data Backup & Recovery
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Your data is safely backed up with multiple redundancy layers and rapid recovery capabilities.
                  </Typography>
                  <List dense>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Automated daily backups"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Cross-region replication"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: '1rem' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Point-in-time recovery"
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Enterprise CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
            Ready for Enterprise-Grade Security?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Get a custom security assessment and compliance report for your organization
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
              Request Security Assessment
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
              Download Security Whitepaper
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
