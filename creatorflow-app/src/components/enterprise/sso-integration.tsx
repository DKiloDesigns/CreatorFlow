/**
 * SSO Integration Component
 * Single Sign-On integration with enterprise providers
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip,
  Alert,
  alpha,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  TestTube as TestIcon,
  Cloud as CloudIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Link as LinkIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface SSOProvider {
  id: string;
  name: string;
  type: 'saml' | 'oauth' | 'ldap' | 'azure' | 'google' | 'okta' | 'auth0';
  displayName: string;
  description: string;
  icon: React.ReactNode;
  isConfigured: boolean;
  isActive: boolean;
  configuration: SSOConfiguration;
  lastSync?: Date;
  userCount: number;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
}

interface SSOConfiguration {
  clientId?: string;
  clientSecret?: string;
  domain?: string;
  metadataUrl?: string;
  certificate?: string;
  redirectUri?: string;
  scopes?: string[];
  attributes?: {
    email: string;
    firstName: string;
    lastName: string;
    groups: string;
  };
  settings?: {
    autoProvision: boolean;
    updateProfile: boolean;
    syncGroups: boolean;
    requireMFA: boolean;
  };
}

interface SSOIntegrationProps {
  onProviderConfigure?: (provider: SSOProvider) => void;
  onProviderTest?: (providerId: string) => void;
  onProviderSync?: (providerId: string) => void;
  className?: string;
}

export function SSOIntegration({
  onProviderConfigure,
  onProviderTest,
  onProviderSync,
  className,
}: SSOIntegrationProps) {
  const [providers, setProviders] = useState<SSOProvider[]>([]);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<SSOProvider | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();

  // Mock data for demonstration
  const mockProviders: SSOProvider[] = [
    {
      id: 'azure',
      name: 'azure',
      type: 'azure',
      displayName: 'Microsoft Azure AD',
      description: 'Enterprise identity and access management',
      icon: <BusinessIcon />,
      isConfigured: true,
      isActive: true,
      configuration: {
        clientId: 'azure-client-id',
        domain: 'company.onmicrosoft.com',
        redirectUri: 'https://creatorflow.com/auth/azure/callback',
        scopes: ['openid', 'profile', 'email'],
        attributes: {
          email: 'userPrincipalName',
          firstName: 'givenName',
          lastName: 'surname',
          groups: 'memberOf',
        },
        settings: {
          autoProvision: true,
          updateProfile: true,
          syncGroups: true,
          requireMFA: false,
        },
      },
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      userCount: 1250,
      status: 'connected',
    },
    {
      id: 'okta',
      name: 'okta',
      type: 'okta',
      displayName: 'Okta',
      description: 'Identity and access management platform',
      icon: <SecurityIcon />,
      isConfigured: true,
      isActive: false,
      configuration: {
        clientId: 'okta-client-id',
        domain: 'company.okta.com',
        redirectUri: 'https://creatorflow.com/auth/okta/callback',
        scopes: ['openid', 'profile', 'email'],
        attributes: {
          email: 'email',
          firstName: 'firstName',
          lastName: 'lastName',
          groups: 'groups',
        },
        settings: {
          autoProvision: true,
          updateProfile: true,
          syncGroups: true,
          requireMFA: true,
        },
      },
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
      userCount: 890,
      status: 'disconnected',
    },
    {
      id: 'google',
      name: 'google',
      type: 'google',
      displayName: 'Google Workspace',
      description: 'Google Cloud Identity and Workspace',
      icon: <CloudIcon />,
      isConfigured: false,
      isActive: false,
      configuration: {
        clientId: '',
        clientSecret: '',
        redirectUri: 'https://creatorflow.com/auth/google/callback',
        scopes: ['openid', 'profile', 'email'],
        attributes: {
          email: 'email',
          firstName: 'given_name',
          lastName: 'family_name',
          groups: 'groups',
        },
        settings: {
          autoProvision: true,
          updateProfile: true,
          syncGroups: false,
          requireMFA: false,
        },
      },
      userCount: 0,
      status: 'disconnected',
    },
    {
      id: 'saml',
      name: 'saml',
      type: 'saml',
      displayName: 'SAML 2.0',
      description: 'Security Assertion Markup Language',
      icon: <LockIcon />,
      isConfigured: false,
      isActive: false,
      configuration: {
        metadataUrl: '',
        certificate: '',
        attributes: {
          email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
          firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
          lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
          groups: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/groups',
        },
        settings: {
          autoProvision: true,
          updateProfile: true,
          syncGroups: true,
          requireMFA: false,
        },
      },
      userCount: 0,
      status: 'disconnected',
    },
  ];

  useEffect(() => {
    setProviders(mockProviders);
  }, []);

  const handleConfigureProvider = useCallback((provider: SSOProvider) => {
    setEditingProvider(provider);
    setIsConfigDialogOpen(true);
  }, []);

  const handleTestProvider = useCallback(async (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    if (!provider) return;

    setIsTestDialogOpen(true);
    setTestResults(null);

    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults = {
      connection: Math.random() > 0.2 ? 'success' : 'error',
      authentication: Math.random() > 0.1 ? 'success' : 'error',
      userSync: Math.random() > 0.3 ? 'success' : 'error',
      groupSync: Math.random() > 0.4 ? 'success' : 'error',
      errors: Math.random() > 0.7 ? ['Invalid certificate', 'Connection timeout'] : [],
    };

    setTestResults(mockResults);
    onProviderTest?.(providerId);
  }, [providers, onProviderTest]);

  const handleSyncProvider = useCallback(async (providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { ...p, lastSync: new Date(), status: 'connected' as const }
        : p
    ));
    onProviderSync?.(providerId);
  }, [onProviderSync]);

  const handleToggleProvider = useCallback((providerId: string) => {
    setProviders(prev => prev.map(p => 
      p.id === providerId 
        ? { ...p, isActive: !p.isActive, status: p.isActive ? 'disconnected' as const : 'connected' as const }
        : p
    ));
  }, []);

  const getStatusIcon = (status: SSOProvider['status']) => {
    switch (status) {
      case 'connected': return <CheckCircleIcon color="success" />;
      case 'disconnected': return <ErrorIcon color="error" />;
      case 'error': return <WarningIcon color="warning" />;
      case 'pending': return <RefreshIcon color="action" />;
      default: return <ErrorIcon color="error" />;
    }
  };

  const getStatusColor = (status: SSOProvider['status']) => {
    switch (status) {
      case 'connected': return 'success';
      case 'disconnected': return 'error';
      case 'error': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const ProviderCard = ({ provider }: { provider: SSOProvider }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton size="large" color="primary">
                {provider.icon}
              </IconButton>
              <Box>
                <Typography variant="h6">
                  {provider.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {provider.description}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={provider.status}
                color={getStatusColor(provider.status) as any}
                size="small"
                icon={getStatusIcon(provider.status)}
              />
              <Switch
                checked={provider.isActive}
                onChange={() => handleToggleProvider(provider.id)}
                disabled={!provider.isConfigured}
              />
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Users:</Typography>
                <Typography variant="body2">{provider.userCount.toLocaleString()}</Typography>
              </Box>
              
              {provider.lastSync && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="subtitle2">Last Sync:</Typography>
                  <Typography variant="body2">
                    {provider.lastSync.toLocaleString()}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={provider.isConfigured ? 'Configured' : 'Not Configured'}
                  color={provider.isConfigured ? 'success' : 'default'}
                  size="small"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={() => handleConfigureProvider(provider)}
                >
                  Configure
                </Button>
                {provider.isConfigured && (
                  <Button
                    size="small"
                    startIcon={<TestIcon />}
                    onClick={() => handleTestProvider(provider.id)}
                  >
                    Test
                  </Button>
                )}
                {provider.isActive && (
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleSyncProvider(provider.id)}
                  >
                    Sync
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ConfigurationDialog = () => (
    <Dialog
      open={isConfigDialogOpen}
      onClose={() => setIsConfigDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Configure {editingProvider?.displayName}
      </DialogTitle>
      <DialogContent>
        {editingProvider && (
          <Box>
            <Stepper activeStep={activeStep} orientation="vertical">
              <Step>
                <StepLabel>Basic Configuration</StepLabel>
                <StepContent>
                  <TextField
                    fullWidth
                    label="Client ID"
                    value={editingProvider.configuration.clientId || ''}
                    margin="normal"
                    placeholder="Enter your client ID"
                  />
                  <TextField
                    fullWidth
                    label="Client Secret"
                    type="password"
                    value={editingProvider.configuration.clientSecret || ''}
                    margin="normal"
                    placeholder="Enter your client secret"
                  />
                  <TextField
                    fullWidth
                    label="Domain"
                    value={editingProvider.configuration.domain || ''}
                    margin="normal"
                    placeholder="company.onmicrosoft.com"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(1)}
                    >
                      Next
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Attribute Mapping</StepLabel>
                <StepContent>
                  <TextField
                    fullWidth
                    label="Email Attribute"
                    value={editingProvider.configuration.attributes?.email || ''}
                    margin="normal"
                    placeholder="userPrincipalName"
                  />
                  <TextField
                    fullWidth
                    label="First Name Attribute"
                    value={editingProvider.configuration.attributes?.firstName || ''}
                    margin="normal"
                    placeholder="givenName"
                  />
                  <TextField
                    fullWidth
                    label="Last Name Attribute"
                    value={editingProvider.configuration.attributes?.lastName || ''}
                    margin="normal"
                    placeholder="surname"
                  />
                  <TextField
                    fullWidth
                    label="Groups Attribute"
                    value={editingProvider.configuration.attributes?.groups || ''}
                    margin="normal"
                    placeholder="memberOf"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => setActiveStep(2)}
                    >
                      Next
                    </Button>
                  </Box>
                </StepContent>
              </Step>
              
              <Step>
                <StepLabel>Settings</StepLabel>
                <StepContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingProvider.configuration.settings?.autoProvision || false}
                      />
                    }
                    label="Auto-provision users"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingProvider.configuration.settings?.updateProfile || false}
                      />
                    }
                    label="Update user profiles on login"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingProvider.configuration.settings?.syncGroups || false}
                      />
                    }
                    label="Sync user groups"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingProvider.configuration.settings?.requireMFA || false}
                      />
                    }
                    label="Require MFA"
                  />
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        onProviderConfigure?.(editingProvider);
                        setIsConfigDialogOpen(false);
                        setActiveStep(0);
                      }}
                    >
                      Save Configuration
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            </Stepper>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsConfigDialogOpen(false)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );

  const TestDialog = () => (
    <Dialog
      open={isTestDialogOpen}
      onClose={() => setIsTestDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Test SSO Connection</DialogTitle>
      <DialogContent>
        {testResults ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Test Results
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {testResults.connection === 'success' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                  <Typography>Connection</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {testResults.authentication === 'success' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                  <Typography>Authentication</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {testResults.userSync === 'success' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                  <Typography>User Sync</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {testResults.groupSync === 'success' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ErrorIcon color="error" />
                  )}
                  <Typography>Group Sync</Typography>
                </Box>
              </Grid>
            </Grid>
            
            {testResults.errors.length > 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Errors:
                </Typography>
                {testResults.errors.map((error: string, index: number) => (
                  <Typography key={index} variant="body2">
                    • {error}
                  </Typography>
                ))}
              </Alert>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <RefreshIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Testing Connection...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we test your SSO configuration.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsTestDialogOpen(false)}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            SSO Integration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure Single Sign-On with enterprise identity providers
          </Typography>
        </Box>
      </Box>

      {/* Providers List */}
      <Box>
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </Box>

      {/* Configuration Dialog */}
      <ConfigurationDialog />

      {/* Test Dialog */}
      <TestDialog />
    </Box>
  );
}

export default SSOIntegration;
