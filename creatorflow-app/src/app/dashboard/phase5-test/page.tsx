"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Group,
  Analytics,
  Api,
  Security,
  Rocket,
  Star
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';
import EnhancedTeamManagement from '@/components/enterprise/enhanced-team-management';
import EnhancedEnterpriseAnalytics from '@/components/enterprise/enhanced-enterprise-analytics';
import EnhancedAPIManagement from '@/components/enterprise/enhanced-api-management';
import EnhancedAdvancedSecurity from '@/components/enterprise/enhanced-advanced-security';

export default function Phase5TestPage() {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const components = [
    {
      id: 'team-management',
      name: 'Enhanced Team Management',
      description: 'Enterprise-grade team management with advanced permissions and AI-powered insights',
      icon: <Group sx={{ fontSize: 32, color: designTokens.colors.success[600] }} />,
      component: <EnhancedTeamManagement />
    },
    {
      id: 'enterprise-analytics',
      name: 'Enhanced Enterprise Analytics',
      description: 'Advanced business intelligence with AI-powered insights and custom dashboards',
      icon: <Analytics sx={{ fontSize: 32, color: designTokens.colors.primary[600] }} />,
      component: <EnhancedEnterpriseAnalytics />
    },
    {
      id: 'api-management',
      name: 'Enhanced API Management',
      description: 'Enterprise-grade API key management, webhook configuration, and performance monitoring',
      icon: <Api sx={{ fontSize: 32, color: designTokens.colors.warning[600] }} />,
      component: <EnhancedAPIManagement />
    },
    {
      id: 'advanced-security',
      name: 'Enhanced Advanced Security',
      description: 'Enterprise-grade security monitoring, threat detection, and compliance management',
      icon: <Security sx={{ fontSize: 32, color: designTokens.colors.error[600] }} />,
      component: <EnhancedAdvancedSecurity />
    }
  ];

  if (activeComponent) {
    const selectedComponent = components.find(c => c.id === activeComponent);
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setActiveComponent(null)}
            startIcon={<Rocket />}
          >
            ← Back to Phase 5 Overview
          </Button>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            {selectedComponent?.name}
          </Typography>
        </Box>
        {selectedComponent?.component}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            mb: 2
          }}
        >
          <Star sx={{ fontSize: 40, color: designTokens.colors.primary[600] }} />
        </Box>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: designTokens.typography.fontWeight.bold,
            color: designTokens.colors.neutral[900],
            mb: 2
          }}
        >
          Phase 5: Enterprise Features & Scaling
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: designTokens.colors.neutral[600],
            fontWeight: designTokens.typography.fontWeight.normal,
            maxWidth: 800,
            margin: '0 auto'
          }}
        >
          Complete enterprise-grade features for scaling teams, advanced analytics, API management, and security
        </Typography>
      </Box>

      {/* Success Alert */}
      <Alert 
        severity="success" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.success[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.success[700] }}>
          🎉 Phase 5 Complete!
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.success[700] }}>
          All enterprise features have been successfully implemented and are ready for testing. 
          This includes Enhanced Team Management, Enterprise Analytics, API Management, and Advanced Security.
        </Typography>
      </Alert>

      {/* Component Grid */}
      <Grid container spacing={4}>
                        {components.map((component) => (
                  <Grid key={component.id} xs={12} md={6}>
            <Card 
              elevation={0} 
              sx={{ 
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                cursor: 'pointer',
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.lg,
                  borderColor: designTokens.colors.primary[300],
                  transform: 'translateY(-2px)'
                }
              }}
              onClick={() => setActiveComponent(component.id)}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  {component.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: designTokens.colors.neutral[800],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    mb: 2
                  }}
                >
                  {component.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: designTokens.colors.neutral[600],
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  {component.description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Rocket />}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(59, 130, 246, 1) 100%)'
                    }
                  }}
                >
                  Test Component
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Summary */}
      <Box sx={{ mt: 6, p: 4, background: designTokens.colors.neutral[50], borderRadius: designTokens.borderRadius.lg }}>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 3, textAlign: 'center' }}>
          What's Been Implemented
        </Typography>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              🚀 Enhanced Team Management
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Advanced role-based access control
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Department management and analytics
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • AI-powered team performance insights
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Custom permission management
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              📊 Enhanced Enterprise Analytics
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Custom dashboard creation
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Business metrics and KPIs
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • AI-powered business insights
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Automated reporting system
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              🔌 Enhanced API Management
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • API key management and permissions
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Webhook configuration and monitoring
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Performance metrics and monitoring
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Rate limiting and security controls
            </Typography>
          </Grid>
          <Grid xs={12} md={6}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              🛡️ Enhanced Advanced Security
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Real-time threat detection
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Security policy management
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Compliance monitoring and reporting
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 1 }}>
              • Incident response and resolution
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
