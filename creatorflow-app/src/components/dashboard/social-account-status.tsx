"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';
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
  }, [accounts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'needs_reauth':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHealthIcon = (isHealthy: boolean) => {
    return isHealthy 
      ? <CheckCircle className="w-4 h-4 text-green-600" />
      : <XCircle className="w-4 h-4 text-red-600" />;
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
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Account Status
          </CardTitle>
          <CardDescription>Monitor the health of your connected social accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Account Status
            </CardTitle>
            <CardDescription>Monitor the health of your connected social accounts</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkAllHealth}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Checking...' : 'Check Health'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health Summary */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {healthPercentage >= 80 ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : healthPercentage >= 50 ? (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">Overall Health</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold">{healthyAccounts}/{totalAccounts}</div>
              <div className="text-sm text-muted-foreground">Healthy Accounts</div>
            </div>
            <div className="w-20">
              <Progress value={healthPercentage} className="h-2" />
            </div>
          </div>
        </div>

        {/* Individual Account Status */}
        <div className="space-y-3">
          {accounts.map((account) => {
            const health = accountHealth.find(h => h.accountId === account.id);
            const tokenStatus = getTokenExpiryStatus(account);
            const isChecking = checkingHealth.includes(account.id);
            
            return (
              <div key={account.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(account.status)}
                    <div>
                      <div className="font-medium">{account.platform}</div>
                      <div className="text-sm text-muted-foreground">@{account.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {health && getHealthIcon(health.isHealthy)}
                    <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                      {account.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {/* Token Status */}
                  <div>
                    <div className="font-medium mb-1">Token Status</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        tokenStatus.status === 'good' ? 'bg-green-500' :
                        tokenStatus.status === 'warning' ? 'bg-orange-500' :
                        tokenStatus.status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className={`
                        ${tokenStatus.status === 'good' ? 'text-green-600' :
                          tokenStatus.status === 'warning' ? 'text-orange-600' :
                          tokenStatus.status === 'critical' ? 'text-red-600' : 'text-gray-600'}
                      `}>
                        {tokenStatus.text}
                      </span>
                    </div>
                    {tokenStatus.percentage !== undefined && (
                      <Progress value={tokenStatus.percentage} className="h-1 mt-1" />
                    )}
                  </div>

                  {/* Health Status */}
                  <div>
                    <div className="font-medium mb-1">Health Status</div>
                    {health ? (
                      <div className="flex items-center gap-2">
                        {getHealthIcon(health.isHealthy)}
                        <span className={health.isHealthy ? 'text-green-600' : 'text-red-600'}>
                          {health.isHealthy ? 'Healthy' : 'Issues Detected'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-600">Checking...</span>
                      </div>
                    )}
                    {health?.lastChecked && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Last checked: {new Date(health.lastChecked).toLocaleTimeString()}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div>
                    <div className="font-medium mb-1">Actions</div>
                    <div className="flex gap-2">
                      {account.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRefresh(account.id)}
                          disabled={isChecking}
                          className="flex items-center gap-1"
                        >
                          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      )}
                      {account.status === 'needs_reauth' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReauth(account.platform)}
                          className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Re-auth
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Health Issues */}
                {health && health.issues.length > 0 && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="font-medium text-red-800 mb-1">Issues Detected:</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {health.issues.map((issue, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <XCircle className="w-3 h-3" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                {health?.metrics && (
                  <div className="mt-3 grid grid-cols-3 gap-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    {health.metrics.followers !== undefined && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-800">{health.metrics.followers.toLocaleString()}</div>
                        <div className="text-xs text-blue-600">Followers</div>
                      </div>
                    )}
                    {health.metrics.engagement !== undefined && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-800">{health.metrics.engagement}%</div>
                        <div className="text-xs text-blue-600">Engagement</div>
                      </div>
                    )}
                    {health.metrics.reach !== undefined && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-800">{health.metrics.reach.toLocaleString()}</div>
                        <div className="text-xs text-blue-600">Reach</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 