"use client";

import React, { useEffect, useState } from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { SocialAccountStatus } from '@/components/dashboard/social-account-status';

const PROVIDERS = [
  { name: 'Facebook', id: 'facebook', icon: '📘', color: '#1877F3' },
  { name: 'Instagram', id: 'instagram', icon: '📸', color: '#E1306C' },
  { name: 'X', id: 'twitter', icon: '🐦', color: '#000000' },
  { name: 'LinkedIn', id: 'linkedin', icon: '💼', color: '#0077B5' },
  { name: 'YouTube', id: 'youtube', icon: '▶️', color: '#FF0000' },
  { name: 'TikTok', id: 'tiktok', icon: '🎵', color: '#010101' },
  { name: 'Pinterest', id: 'pinterest', icon: '📌', color: '#E60023' },
  { name: 'Threads', id: 'threads', icon: '🧵', color: '#000000' },
  { name: 'WhatsApp', id: 'whatsapp', icon: '💬', color: '#25D366' },
  { name: 'Messenger', id: 'messenger', icon: '💭', color: '#0084FF' },
  { name: 'WeChat', id: 'wechat', icon: '🟩', color: '#09B83E' },
  { name: 'Telegram', id: 'telegram', icon: '✈️', color: '#229ED9' },
  { name: 'Reddit', id: 'reddit', icon: '👽', color: '#FF4500' },
  { name: 'Snapchat', id: 'snapchat', icon: '👻', color: '#FFFC00' },
  { name: 'Google My Business', id: 'gmb', icon: '🏢', color: '#4285F4' },
];

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

type Account = {
  id: string;
  provider: string;
  providerAccountId: string;
};

type AccountConnectButtonsProps = {
  accounts: SocialAccount[];
  onConnect: (provider: string) => void;
  loading: boolean;
};

function AccountConnectButtons({ accounts, onConnect, loading }: AccountConnectButtonsProps) {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {PROVIDERS.map((p) => {
          const connectedAccount = accounts.find((a: SocialAccount) => a.platform === p.id);
          const isConnected = !!connectedAccount;
          const isPending = connectedAccount?.status === 'pending';
          const needsReauth = connectedAccount?.status === 'needs_reauth';
          
          return (
            <div key={p.id} className="flex-shrink-0">
              <button
                onClick={() => onConnect(p.id)}
                disabled={loading || (isConnected && !needsReauth)}
                className={`
                  relative group flex flex-col items-center justify-center
                  w-20 h-20 rounded-full border-2 transition-all duration-200
                  ${isConnected && !needsReauth
                    ? 'border-green-500 bg-green-50 cursor-not-allowed' 
                    : needsReauth
                    ? 'border-orange-500 bg-orange-50 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                style={{
                  background: isConnected && !needsReauth 
                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                    : needsReauth
                    ? 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)'
                    : 'white'
                }}
              >
                <div 
                  className="text-2xl mb-1 transition-transform group-hover:scale-110"
                  style={{ filter: isConnected && !needsReauth ? 'grayscale(0)' : 'grayscale(0)' }}
                >
                  {p.icon}
                </div>
                <div className={`
                  text-xs font-medium text-center px-1
                  ${isConnected && !needsReauth ? 'text-green-700' : needsReauth ? 'text-orange-700' : 'text-gray-600'}
                `}>
                  {p.name}
                </div>
                {isConnected && !needsReauth && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                {needsReauth && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-white" />
                  </div>
                )}
                {isPending && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

type ConnectedAccountCardProps = {
  account: SocialAccount;
  onDisconnect: (accountId: string) => void;
  onRefresh: (accountId: string) => void;
  onReauth: (platform: string) => void;
  loading: boolean;
};

function ConnectedAccountCard({ account, onDisconnect, onRefresh, onReauth, loading }: ConnectedAccountCardProps) {
  const provider = PROVIDERS.find((p) => p.id === account.platform);
  const isTokenExpired = account.tokenExpiresAt && new Date(account.tokenExpiresAt) < new Date();
  const isExpiringSoon = account.tokenExpiresAt && 
    new Date(account.tokenExpiresAt) < new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const getStatusBadge = () => {
    switch (account.status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'needs_reauth':
        return <Badge variant="destructive" className="bg-orange-100 text-orange-800">Needs Re-auth</Badge>;
      case 'error':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: provider?.color || '#eee' }}
            >
              <span className="text-xl">{provider?.icon}</span>
            </div>
            <div>
              <CardTitle className="text-lg">{provider?.name}</CardTitle>
              <CardDescription>@{account.username}</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p>Platform ID: {account.platformUserId}</p>
          <p>Connected: {new Date(account.createdAt).toLocaleDateString()}</p>
          {account.tokenExpiresAt && (
            <p className={`${isTokenExpired ? 'text-red-600' : isExpiringSoon ? 'text-orange-600' : 'text-green-600'}`}>
              Token expires: {new Date(account.tokenExpiresAt).toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {account.status === 'active' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRefresh(account.id)}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </>
          )}
          
          {account.status === 'needs_reauth' && (
            // SPECIAL COLOR BUTTON: Re-authorize (add color later)
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReauth(account.platform)}
              disabled={loading}
              className="flex items-center gap-1 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <AlertCircle className="w-4 h-4" />
              Re-authorize
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDisconnect(account.id)}
            disabled={loading}
            className="flex items-center gap-1 bg-red-700 text-white border-red-700 hover:bg-red-800 hover:border-red-800"
          >
            <XCircle className="w-4 h-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');

  // Agent API Key Management
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [apiKeyName, setApiKeyName] = useState('');
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [creatingKey, setCreatingKey] = useState(false);
  const [plan, setPlan] = useState('');

  const [ariaMessage, setAriaMessage] = useState('');

  const fetchSocialAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounts', { method: 'GET' });
      if (!res.ok) throw new Error('Failed to fetch social accounts');
      const data = await res.json();
      setSocialAccounts(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to fetch accounts');
      setAccounts(await res.json());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchSocialAccounts();
    fetchAccounts();
  }, []);

  useEffect(() => {
    // Fetch API keys and plan
    const fetchKeys = async () => {
      setLoadingKeys(true);
      try {
        const res = await fetch('/api/api-keys');
        if (!res.ok) throw new Error('Failed to fetch API keys');
        const keys = await res.json();
        setApiKeys(keys);
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoadingKeys(false);
      }
    };
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/accounts/plan');
        if (!res.ok) return;
        const data = await res.json();
        setPlan(data.plan);
      } catch {}
    };
    fetchKeys();
    fetchPlan();
  }, []);

  useEffect(() => {
    if (action && action.toLowerCase().includes('error')) setAriaMessage(action);
    else setAriaMessage('');
  }, [action]);

  // Handle OAuth callback messages
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const platform = urlParams.get('platform');

    if (success === 'connected' && platform) {
      toast.success(`Successfully connected to ${platform}!`);
      fetchSocialAccounts(); // Refresh the list
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error && platform) {
      let errorMessage = 'Failed to connect account';
      switch (error) {
        case 'oauth_failed':
          errorMessage = `OAuth authentication failed for ${platform}`;
          break;
        case 'no_code':
          errorMessage = `No authorization code received from ${platform}`;
          break;
        case 'callback_failed':
          errorMessage = `Failed to complete ${platform} connection`;
          break;
        default:
          errorMessage = `Error connecting to ${platform}: ${error}`;
      }
      toast.error(errorMessage);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleConnect = async (provider: string) => {
    setAction(`Connecting to ${provider}...`);
    try {
      const res = await fetch(`/api/accounts/connect/${provider}`, { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        toast.success(`Redirecting to ${provider}...`);
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to get sign-in URL');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setAction('');
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this account? This will remove all access.')) {
      return;
    }
    
    setAction('Disconnecting...');
    try {
      const res = await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Disconnected successfully');
        fetchSocialAccounts();
      } else {
        toast.error(data.error || 'Failed to disconnect');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setAction('');
    }
  };

  const handleRefresh = async (accountId: string) => {
    setAction('Refreshing token...');
    try {
      const res = await fetch(`/api/accounts/${accountId}/refresh`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        toast.success('Token refreshed successfully');
        fetchSocialAccounts();
      } else {
        toast.error(data.error || 'Failed to refresh token');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setAction('');
    }
  };

  const handleReauth = async (platform: string) => {
    setAction(`Re-authorizing ${platform}...`);
    try {
      const res = await fetch(`/api/accounts/connect/${platform}`, { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        toast.success(`Redirecting to ${platform} for re-authorization...`);
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to get re-authorization URL');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setAction('');
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingKey(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: apiKeyName }),
      });
      if (res.status === 402) {
        toast.error('AI Agent API access requires a paid plan.');
        setCreatingKey(false);
        return;
      }
      if (!res.ok) throw new Error('Failed to create API key');
      const key = await res.json();
      setApiKeys(keys => [...keys, key]);
      setApiKeyName('');
      toast.success('API key created!');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!window.confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to revoke API key');
      setApiKeys(keys => keys.map(k => k.id === id ? { ...k, revokedAt: new Date().toISOString() } : k));
      toast.success('API key revoked.');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <h2 className="sr-only" id="accounts-dashboard-heading">Accounts Dashboard</h2>
        <Heading
          title="Connected Accounts"
          description="Manage your connected social media accounts and add new ones."
        />

        {/* Section to Add New Accounts */}
        <section>
          <div className="flex gap-4" aria-label="Connect social accounts">
            <AccountConnectButtons 
              accounts={socialAccounts} 
              onConnect={handleConnect} 
              loading={loading} 
            />
          </div>
        </section>

        <Separator />

        {/* Social Account Status Monitoring */}
        <section>
          <SocialAccountStatus 
            accounts={socialAccounts}
            onRefresh={handleRefresh}
            onReauth={handleReauth}
          />
        </section>

        <Separator />

        {/* Section to Display Connected Accounts */}
        <section>
          <h3 className="text-lg font-medium mb-4">Your Connections</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading accounts...</span>
            </div>
          ) : socialAccounts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No social accounts connected yet.</p>
              <p className="text-sm">Connect your first account above to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialAccounts.map((account) => (
                <ConnectedAccountCard
                  key={account.id}
                  account={account}
                  onDisconnect={handleDisconnect}
                  onRefresh={handleRefresh}
                  onReauth={handleReauth}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-2">Agent API Key Management</h2>
          <p className="text-sm text-muted-foreground mb-4">Generate API keys for your AI agent to access CreatorFlow programmatically. <b>Requires a paid plan.</b></p>
          {plan === 'Free' && (
            <div className="bg-yellow-100 text-yellow-800 p-2 rounded mb-4">Upgrade to a paid plan to enable agent API access.</div>
          )}
          <form className="flex gap-2 mb-4" onSubmit={handleCreateKey}>
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Key name (optional)"
              value={apiKeyName}
              onChange={e => setApiKeyName(e.target.value)}
              disabled={plan === 'Free' || creatingKey}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-1 rounded focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                  disabled={plan === 'Free' || creatingKey}
                  aria-label="Create API Key"
                >
                  {creatingKey ? 'Creating...' : 'Create API Key'}
                </button>
              </TooltipTrigger>
              <TooltipContent>{plan === 'Free' ? 'Upgrade to create API keys' : 'Create a new API key for agent access'}</TooltipContent>
            </Tooltip>
          </form>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Key</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Created</th>
                  <th className="text-left p-2">Revoked</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingKeys ? (
                  <tr><td colSpan={5}>Loading...</td></tr>
                ) : apiKeys.length === 0 ? (
                  <tr><td colSpan={5}>No API keys found.</td></tr>
                ) : apiKeys.map((key: any) => (
                  <tr key={key.id} className={key.revokedAt ? 'text-gray-400' : ''}>
                    <td className="p-2 font-mono">{key.key.slice(0, 8)}...{key.key.slice(-4)}</td>
                    <td className="p-2">{key.name || '-'}</td>
                    <td className="p-2">{new Date(key.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">{key.revokedAt ? new Date(key.revokedAt).toLocaleDateString() : '-'}</td>
                    <td className="p-2">
                      {!key.revokedAt && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="text-red-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary transition-colors px-2 py-1 rounded" onClick={() => handleRevokeKey(key.id)} aria-label="Revoke API Key">
                              Revoke
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Revoke this API key</TooltipContent>
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div aria-live="polite" className="sr-only" id="accounts-dashboard-aria-live">{ariaMessage}</div>
      </div>
    </TooltipProvider>
  );
} 