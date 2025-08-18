'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  TrendingUp,
  Person,
  AttachMoney,
  Settings,
  Add,
  Analytics,
  Campaign,
  Business,
  IntegrationInstructions
} from '@mui/icons-material';

export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto', pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Business color="primary" />
          Enterprise Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive overview of enterprise metrics, team performance, and client management
        </Typography>
      </Box>

      {/* Basic Metrics */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              $1.25M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              47
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Clients
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Team Members
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              99.97%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform Uptime
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              fullWidth
            >
              Add Team Member
            </Button>
            <Button
              variant="outlined"
              startIcon={<Analytics />}
              fullWidth
            >
              View Analytics
            </Button>
            <Button
              variant="outlined"
              startIcon={<Campaign />}
              fullWidth
            >
              Create Campaign
            </Button>
            <Button
              variant="outlined"
              startIcon={<IntegrationInstructions />}
              fullWidth
            >
              Manage Integrations
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Navigation to Advanced Features */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3, mb: { xs: 8, sm: 6 } }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Advanced Analytics</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Deep insights into performance metrics, audience behavior, and ROI analysis
            </Typography>
            <Button
              variant="contained"
              startIcon={<Analytics />}
              fullWidth
              onClick={() => window.location.href = '/dashboard/enterprise/analytics'}
            >
              View Advanced Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Integrations</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Connect with third-party tools, APIs, and enterprise systems
            </Typography>
            <Button
              variant="contained"
              startIcon={<IntegrationInstructions />}
              fullWidth
              onClick={() => window.location.href = '/dashboard/api-management'}
            >
              Manage Integrations
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
