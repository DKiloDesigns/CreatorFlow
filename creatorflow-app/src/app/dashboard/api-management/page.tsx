'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Api,
  Key,
  Webhook,
  Settings,
  Add,
  ContentCopy,
  Delete,
  Edit,
  Visibility,
  VisibilityOff
} from '@/lib/mui-optimized-imports';

export default function APIManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showApiKey, setShowApiKey] = useState(false);

  // Simulate API data
  const apiKeys = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_prod_1234567890abcdef',
      permissions: ['read', 'write'],
      lastUsed: '2025-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_dev_abcdef1234567890',
      permissions: ['read'],
      lastUsed: '2025-01-14T15:45:00Z',
      status: 'active'
    }
  ];

  const webhooks = [
    {
      id: '1',
      name: 'Order Created',
      url: 'https://webhook.site/abc123',
      events: ['order.created'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Payment Success',
      url: 'https://webhook.site/def456',
      events: ['payment.success'],
      status: 'active'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you'd show a success message
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1600, mx: 'auto', pb: { xs: 12, sm: 8 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Api color="primary" />
          API Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage API keys, webhooks, and integration settings
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3, mb: 6 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              {apiKeys.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active API Keys
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              {webhooks.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Webhooks
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              99.9%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              API Uptime
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" color="primary" gutterBottom>
              2.5M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              API Calls Today
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="API Keys" icon={<Key />} />
          <Tab label="Webhooks" icon={<Webhook />} />
          <Tab label="Documentation" icon={<Api />} />
          <Tab label="Settings" icon={<Settings />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">API Keys</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowApiKey(true)}
            >
              Generate New API Key
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {apiKey.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {showApiKey ? apiKey.key : '••••••••••••••••••••'}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        {apiKey.permissions.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Last used: {new Date(apiKey.lastUsed).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">Webhooks</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
            >
              Add Webhook
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {webhooks.map((webhook) => (
              <Card key={webhook.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {webhook.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {webhook.url}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        {webhook.events.map((event) => (
                          <Chip
                            key={event}
                            label={event}
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Chip
                        label={webhook.status}
                        size="small"
                        color={webhook.status === 'active' ? 'success' : 'default'}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small">
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>API Documentation</Typography>
          <Typography variant="body1">
            Comprehensive API documentation will be displayed here.
          </Typography>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h5" gutterBottom>API Settings</Typography>
          <Typography variant="body1">
            API configuration and settings will be displayed here.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
