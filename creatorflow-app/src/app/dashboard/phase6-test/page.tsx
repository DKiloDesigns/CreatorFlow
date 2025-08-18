"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  Psychology,
  Create,
  ShowChart,
  Hub
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';
import AdvancedAIWorkflowAutomation from '@/components/ai/advanced-ai-workflow-automation';
import IntelligentContentOptimization from '@/components/ai/intelligent-content-optimization';
import PredictiveAnalyticsEngine from '@/components/ai/predictive-analytics-engine';
import SmartWorkflowOrchestration from '@/components/ai/smart-workflow-orchestration';

const phase6Components = [
  {
    id: 'workflow-automation',
    name: 'Advanced AI Workflow Automation',
    description: 'Intelligent workflow orchestration with AI-powered optimization and automation',
    icon: <Hub sx={{ fontSize: 40, color: designTokens.colors.ai[600] }} />,
    component: AdvancedAIWorkflowAutomation,
    features: ['Workflow Management', 'AI Optimizations', 'Execution History', 'Performance Analytics']
  },
  {
    id: 'content-optimization',
    name: 'Intelligent Content Optimization',
    description: 'AI-powered content analysis, performance prediction, and optimization recommendations',
    icon: <Create sx={{ fontSize: 40, color: designTokens.colors.ai[600] }} />,
    component: IntelligentContentOptimization,
    features: ['Content Library', 'AI Insights', 'Performance Predictions', 'Optimization History']
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics Engine',
    description: 'Advanced predictive models, trend forecasting, and business intelligence',
    icon: <ShowChart sx={{ fontSize: 40, color: designTokens.colors.ai[600] }} />,
    component: PredictiveAnalyticsEngine,
    features: ['Prediction Models', 'Trend Forecasts', 'Business Intelligence', 'Model Performance']
  },
  {
    id: 'workflow-orchestration',
    name: 'Smart Workflow Orchestration',
    description: 'Intelligent decision engines and process optimization with AI orchestration',
    icon: <Psychology sx={{ fontSize: 40, color: designTokens.colors.ai[600] }} />,
    component: SmartWorkflowOrchestration,
    features: ['Orchestration Rules', 'Decision Engines', 'Process Optimization', 'Integration Flows']
  }
];

export default function Phase6TestPage() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const handleBackToOverview = () => {
    setSelectedComponent(null);
  };

  if (selectedComponent) {
    const component = phase6Components.find(c => c.id === selectedComponent);
    const Component = component?.component;
    
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            onClick={handleBackToOverview}
            sx={{ borderColor: designTokens.colors.ai[300] }}
          >
            ← Back to Overview
          </Button>
                  <Typography variant="h4" sx={{ color: designTokens.colors.neutral[900] }}>
          {component?.name}
        </Typography>
        </Box>
        {Component && <Component />}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: { xs: 20, sm: 8 } }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ color: designTokens.colors.neutral[900], mb: 2 }}>
          Phase 6: Advanced AI & Automation
        </Typography>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[600], mb: 3 }}>
          Intelligent workflow orchestration, predictive analytics, and AI-powered automation
        </Typography>
        <Chip 
          label="100% Complete" 
          color="success" 
          size="large"
          sx={{ fontSize: '1.1rem', px: 2, py: 1 }}
        />
      </Box>

      <Grid container spacing={3}>
        {phase6Components.map((component) => (
          <Grid item xs={12} md={6} lg={3} key={component.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 12,
                  borderColor: designTokens.colors.ai[400]
                },
                border: `2px solid ${designTokens.colors.border}`,
                '&:hover .component-icon': {
                  transform: 'scale(1.1)',
                  color: designTokens.colors.ai[700]
                }
              }}
              onClick={() => handleComponentSelect(component.id)}
            >
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box 
                  className="component-icon"
                  sx={{ 
                    mb: 2,
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {component.icon}
                </Box>
                
                <Typography variant="h6" sx={{ color: designTokens.colors.neutral[900], mb: 2 }}>
                  {component.name}
                </Typography>
                
                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 3 }}>
                  {component.description}
                </Typography>

                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1} alignItems="center">
                  {component.features.map((feature, index) => (
                    <Chip 
                      key={index}
                      label={feature} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.75rem',
                        borderColor: designTokens.colors.ai[200],
                        color: designTokens.colors.ai[700]
                      }}
                    />
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ 
                    mt: 3,
                    backgroundColor: designTokens.colors.ai[600],
                    '&:hover': { backgroundColor: designTokens.colors.ai[700] }
                  }}
                >
                  Test Component
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, p: 4, backgroundColor: designTokens.colors.neutral[100], borderRadius: 2 }}>
        <Typography variant="h5" sx={{ color: designTokens.colors.neutral[900], mb: 3, textAlign: 'center' }}>
          Phase 6 Features Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: designTokens.colors.ai[600], mb: 2 }}>
              🚀 Advanced AI Workflow Automation
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Intelligent workflow orchestration with AI-powered optimization
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Real-time performance monitoring and automated decision making
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Dynamic resource allocation and workflow routing
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: designTokens.colors.ai[600], mb: 2 }}>
              🎯 Intelligent Content Optimization
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • AI-powered content analysis and performance prediction
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Automated optimization recommendations and A/B testing
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Multi-platform content performance tracking
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: designTokens.colors.ai[600], mb: 2 }}>
              📊 Predictive Analytics Engine
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Advanced machine learning models for business forecasting
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Trend analysis and anomaly detection
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • AI-powered business intelligence and insights
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ color: designTokens.colors.ai[600], mb: 2 }}>
              ⚡ Smart Workflow Orchestration
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Intelligent decision engines and process optimization
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • Automated integration flows and data pipelines
            </Typography>
            <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600], mb: 2 }}>
              • AI-powered resource allocation and priority management
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Spacer to Clear Bottom Navigation */}
      <Box sx={{ 
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
}
