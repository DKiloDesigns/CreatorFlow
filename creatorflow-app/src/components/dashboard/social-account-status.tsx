"use client";

import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { Button as UiButton } from '@/components/ui/mui-button';
import { Alert, AlertDescription } from '@/components/ui/feedback/mui-alert';
import { 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon, 
  AccessTime as AccessTimeIcon, 
  Cancel as CancelIcon, 
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

type SocialAccount = {
  id: string;
  platform: string;
  platformUserId: string;
  username: string;
  status: 'active' | 'pending' | 'needs_reauth' | 'error';
  createdAt: string;
  updatedAt: string;
  tokenExpiresAt?: string;
  scopes?: string;
};

type AccountHealth = {
  accountId: string;
  platform: string;
  isHealthy: boolean;
  lastChecked: string;
  issues: string[];
  metrics?: {
    followers?: number;
    engagement?: number;
    reach?: number;
  };
};

type SocialAccountStatusProps = {
  accounts: SocialAccount[];
  onRefresh: (accountId: string) => void;
  onReauth: (platform: string) => void;
};

export function SocialAccountStatus({ accounts, onRefresh, onReauth }: SocialAccountStatusProps) {
  const [accountHealth, setAccountHealth] = useState<AccountHealth[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState<string[]>([]);

  // Check account health
  const checkAccountHealth = async (account: SocialAccount) => {
    setCheckingHealth(prev => [...prev, account.id]);
    
    try {
      const response = await fetch(`/api/accounts/${account.id}/health`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const healthData = await response.json();
        setAccountHealth(prev => 
          prev.filter(h => h.accountId !== account.id).concat(healthData)
        );
      } else {
        // If health check fails, mark as unhealthy
        setAccountHealth(prev => 
          prev.filter(h => h.accountId !== account.id).concat({
            accountId: account.id,
            platform: account.platform,
            isHealthy: false,
            lastChecked: new Date().toISOString(),
            issues: ['Health check failed'],
          })
        );
      }
    } catch (error) {
      console.error('Health check error:', error);
      setAccountHealth(prev => 
        prev.filter(h => h.accountId !== account.id).concat({
          accountId: account.id,
          platform: account.platform,
          isHealthy: false,
          lastChecked: new Date().toISOString(),
          issues: ['Network error during health check'],
        })
      );
    } finally {
      setCheckingHealth(prev => prev.filter(id => id !== account.id));
    }
  };

  // Check all accounts health
  const checkAllHealth = async () => {
    setLoading(true);
    const promises = accounts.map(account => checkAccountHealth(account));
    await Promise.all(promises);
    setLoading(false);
    toast.success('Account health check completed');
  };

  // Auto-check health on mount and every 5 minutes
  useEffect(() => {
    if (accounts.length > 0) {
      checkAllHealth();
    }

    const interval = setInterval(() => {
      if (accounts.length > 0) {
        checkAllHealth();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [accounts, checkAllHealth]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon sx={{ width: 16, height: 16, color: 'success.main' }} />;
      case 'pending':
        return <AccessTimeIcon sx={{ width: 16, height: 16, color: 'info.main' }} />;
      case 'needs_reauth':
        return <ErrorIcon sx={{ width: 16, height: 16, color: 'warning.main' }} />;
      case 'error':
        return <CancelIcon sx={{ width: 16, height: 16, color: 'error.main' }} />;
      default:
        return <TrendingUpIcon sx={{ width: 16, height: 16, color: 'text.secondary' }} />;
    }
  };

  const getHealthIcon = (isHealthy: boolean) => {
    return isHealthy 
      ? <CheckCircleIcon sx={{ width: 16, height: 16 }} className="text-green-600" />
      : <CancelIcon sx={{ width: 16, height: 16 }} className="text-red-600" />;
  };

  const getTokenExpiryStatus = (account: SocialAccount) => {
    if (!account.tokenExpiresAt) return { status: 'unknown', text: 'No expiry info' };
    
    const expiryDate = new Date(account.tokenExpiresAt);
    const now = new Date();
    const timeUntilExpiry = expiryDate.getTime() - now.getTime();
    const daysUntilExpiry = timeUntilExpiry / (1000 * 60 * 60 * 24);
    
    if (timeUntilExpiry < 0) {
      return { status: 'expired', text: 'Token expired', percentage: 0 };
    } else if (daysUntilExpiry < 1) {
      return { status: 'critical', text: 'Expires today', percentage: 10 };
    } else if (daysUntilExpiry < 7) {
      return { status: 'warning', text: `Expires in ${Math.ceil(daysUntilExpiry)} days`, percentage: 30 };
    } else {
      return { status: 'good', text: `Expires in ${Math.ceil(daysUntilExpiry)} days`, percentage: 80 };
    }
  };

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <Typography variant="h5" component="div" className="flex items-center gap-2">
            <TrendingUpIcon sx={{ width: 20, height: 20 }} />
            Account Status
          </Typography>
          <Typography variant="body2" color="text.secondary">Monitor the health of your connected social accounts</Typography>
        </CardHeader>
        <CardContent>
          <Alert>
            <ErrorIcon className="h-4 w-4" />
            <AlertDescription>
              No social accounts connected. Connect your first account to start monitoring.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const healthyAccounts = accountHealth.filter(h => h.isHealthy).length;
  const totalAccounts = accounts.length;
  const healthPercentage = totalAccounts > 0 ? (healthyAccounts / totalAccounts) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div" className="flex items-center gap-2">
              <TrendingUpIcon sx={{ width: 20, height: 20 }} />
              Account Status
            </Typography>
            <Typography variant="body2" color="text.secondary">Monitor the health of your connected social accounts</Typography>
          </Box>
          <Button
            variant="outlined"
            size="sm"
            onClick={checkAllHealth}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshIcon sx={{ width: 16, height: 16 }} className={`${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Check Health'}
          </Button>
        </Box>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Summary */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={6} component="div">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {healthPercentage >= 80 ? (
                  <CheckCircleIcon sx={{ width: 20, height: 20 }} className="text-green-600" />
                ) : healthPercentage >= 50 ? (
                  <ErrorIcon sx={{ width: 20, height: 20 }} className="text-orange-600" />
                ) : (
                  <CancelIcon sx={{ width: 20, height: 20 }} className="text-red-600" />
                )}
                <Typography variant="subtitle1" component="span" fontWeight="medium">Overall Health</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} component="div">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h5" fontWeight="bold">{healthyAccounts}/{totalAccounts}</Typography>
                  <Typography variant="body2" color="text.secondary">Healthy Accounts</Typography>
                </Box>
                <Box sx={{ width: 100 }}>
                  <LinearProgress variant="determinate" value={healthPercentage} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Individual Account Status */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {accounts.map((account) => {
            const health = accountHealth.find(h => h.accountId === account.id);
            const tokenStatus = getTokenExpiryStatus(account);
            const isChecking = checkingHealth.includes(account.id);
            
            return (
              <Box key={account.id} sx={{ border: '1px solid', borderRadius: 1, p: 2 }}>
                <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                  <Grid item xs={12} sm={6} md={7}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getStatusIcon(account.status)}
                      <Box>
                        <Typography variant="subtitle2">{account.platform}</Typography>
                        <Typography variant="body2" color="text.secondary">@{account.username}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {health && getHealthIcon(health.isHealthy)}
                      <Chip label={account.status} variant={account.status === 'active' ? 'filled' : 'outlined'} />
                    </Box>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {/* Token Status */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Token Status</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 
                        tokenStatus.status === 'good' ? 'green.500' :
                        tokenStatus.status === 'warning' ? 'orange.500' :
                        tokenStatus.status === 'critical' ? 'red.500' : 'gray.500'
                      }} />
                      <Typography variant="body2" color={
                        tokenStatus.status === 'good' ? 'green.600' :
                          tokenStatus.status === 'warning' ? 'orange.600' :
                          tokenStatus.status === 'critical' ? 'red.600' : 'gray.600'
                      }>
                        {tokenStatus.text}
                      </Typography>
                    </Box>
                    {tokenStatus.percentage !== undefined && (
                      <LinearProgress variant="determinate" value={tokenStatus.percentage} sx={{ mt: 0.5 }} />
                    )}
                  </Grid>

                  {/* Health Status */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Health Status</Typography>
                    {health ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getHealthIcon(health.isHealthy)}
                        <Typography variant="body2" color={health.isHealthy ? 'green.600' : 'red.600'}>
                          {health.isHealthy ? 'Healthy' : 'Issues Detected'}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ width: 16, height: 16 }} className="text-gray-600" />
                        <Typography variant="body2" color="text.secondary">Checking...</Typography>
                      </Box>
                    )}
                    {health?.lastChecked && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
                      </Typography>
                    )}
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" gutterBottom>Actions</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {account.status === 'active' && (
                        <UiButton
                          variant="outlined"
                          size="sm"
                          onClick={() => onRefresh(account.id)}
                          disabled={isChecking}
                          className="flex items-center gap-1"
                        >
                          <RefreshIcon sx={{ width: 16, height: 16 }} className={`${isChecking ? 'animate-spin' : ''}`} />
                          Refresh
                        </UiButton>
                      )}
                      {account.status === 'needs_reauth' && (
                        <UiButton
                          variant="outlined"
                          size="sm"
                          onClick={() => onReauth(account.platform)}
                          className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <ErrorIcon sx={{ width: 16, height: 16 }} />
                          Re-auth
                        </UiButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {/* Health Issues */}
                {health && health.issues.length > 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'red.50', border: '1px solid', borderColor: 'red.200', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="red.800" gutterBottom>Issues Detected:</Typography>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {health.issues.map((issue, index) => (
                        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                          <CancelIcon sx={{ width: 12, height: 12 }} />
                          <Typography variant="body2" color="red.700">{issue}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}

                {/* Metrics */}
                {health?.metrics && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'blue.50', border: '1px solid', borderColor: 'blue.200', borderRadius: 1 }}>
                    <Grid container spacing={2}>
                      {health.metrics.followers !== undefined && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold" color="blue.800">{health.metrics.followers.toLocaleString()}</Typography>
                            <Typography variant="body2" color="blue.600">Followers</Typography>
                          </Box>
                        </Grid>
                      )}
                      {health.metrics.engagement !== undefined && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold" color="blue.800">{health.metrics.engagement}%</Typography>
                            <Typography variant="body2" color="blue.600">Engagement</Typography>
                          </Box>
                        </Grid>
                      )}
                      {health.metrics.reach !== undefined && (
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" fontWeight="bold" color="blue.800">{health.metrics.reach.toLocaleString()}</Typography>
                            <Typography variant="body2" color="blue.600">Reach</Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
} 