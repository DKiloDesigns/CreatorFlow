"use client";

import React, { useEffect, useState } from 'react';
import { Heading } from '@/components/ui/heading'; // Assuming a shared Heading component
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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

type Account = {
  id: string;
  provider: string;
  providerAccountId: string;
};

type AccountConnectButtonsProps = {
  accounts: Account[];
  onConnect: (provider: string) => void;
  loading: boolean;
};

function AccountConnectButtons({ accounts, onConnect, loading }: AccountConnectButtonsProps) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          onClick={() => onConnect(p.id)}
          disabled={loading || accounts.some((a: Account) => a.provider === p.id)}
          style={{ opacity: loading || accounts.some((a: Account) => a.provider === p.id) ? 0.5 : 1 }}
        >
          {p.icon} Connect {p.name}
        </button>
      ))}
    </div>
  );
}

type ConnectedAccountListProps = {
  accounts: Account[];
  onDisconnect: (accountId: string) => void;
  loading: boolean;
};

function ConnectedAccountList({ accounts, onDisconnect, loading }: ConnectedAccountListProps) {
  return (
    <ul>
      {accounts.map((acc: Account) => (
        <li key={acc.id} style={{ marginBottom: 8 }}>
          <b>{PROVIDERS.find((p) => p.id === acc.provider)?.icon} {acc.provider}</b> ({acc.providerAccountId})
          <button
            style={{ marginLeft: 12 }}
            onClick={() => onDisconnect(acc.id)}
            disabled={loading}
          >
            Disconnect
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function AccountsPage() {
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

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/accounts', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to fetch accounts');
      setAccounts(await res.json());
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    setAction('Disconnecting...');
    try {
      const res = await fetch(`/api/accounts/${accountId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Disconnected successfully');
        fetchAccounts();
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

  // TODO: Add logic here to read query params for success/error messages from OAuth callback
  // and potentially display initial toasts

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <h2 className="sr-only" id="accounts-dashboard-heading">Accounts Dashboard</h2>
        <Heading
          title="Connected Accounts"
          description="Manage your connected social media accounts and add new ones."
        />

        {/* Section to Add New Accounts */}
        <section className="sm:block hidden">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4" aria-label="Connect social accounts">
            {PROVIDERS.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleConnect(p.id)}
                    disabled={loading || accounts.some((a: Account) => a.provider === p.id)}
                    className="px-4 py-2 rounded border bg-white shadow hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                    tabIndex={0}
                    aria-label={`Connect ${p.name}`}
                  >
                    {p.icon} Connect {p.name}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{accounts.some((a: Account) => a.provider === p.id) ? `Already connected to ${p.name}` : `Connect your ${p.name} account`}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </section>

        <Separator />

        {/* Section to Display Connected Accounts */}
        <section>
          <h3 className="text-lg font-medium mb-4">Your Connections</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {/* Mobile: horizontal scrollable row for all platforms */}
              <div className="flex sm:hidden overflow-x-auto gap-3 pb-2 -mx-2 px-2">
                {PROVIDERS.map((provider) => {
                  const acc = accounts.find((a) => a.provider === provider.id);
                  return (
                    <div
                      key={provider.id}
                      className="flex flex-col items-center justify-center min-w-[72px] max-w-[80px] relative group"
                    >
                      <button
                        className="rounded-full w-14 h-14 flex items-center justify-center border-2 shadow-md mb-1 relative focus:outline-none focus:ring-2 focus:ring-primary transition"
                        style={{ background: provider.color || '#eee', borderColor: provider.color || '#ccc' }}
                        title={provider.name}
                        onClick={() => acc ? handleDisconnect(acc.id) : handleConnect(provider.id)}
                        disabled={loading}
                        aria-label={acc ? `Disconnect ${provider.name}` : `Connect ${provider.name}`}
                        tabIndex={0}
                      >
                        <span className="text-2xl" aria-label={provider.name}>{provider.icon}</span>
                        {acc && (
                          <span className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 shadow hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-primary text-xs">×</span>
                        )}
                        {!acc && (
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-white rounded-full px-2 py-0.5 text-xs shadow">+</span>
                        )}
                      </button>
                      <span className="text-xs text-center truncate w-14" title={provider.name}>{provider.name}</span>
                    </div>
                  );
                })}
              </div>
              {/* Desktop: grid of cards */}
              <ul className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Connected accounts list">
                {accounts.map((acc) => {
                  const provider = PROVIDERS.find((p) => p.id === acc.provider);
                  return (
                    <li key={acc.id} className="rounded-xl shadow bg-white flex flex-col items-center p-4 relative border" style={{ borderColor: provider?.color || '#ccc' }}>
                      <div className="rounded-full w-12 h-12 flex items-center justify-center mb-2" style={{ background: provider?.color || '#eee' }}>
                        <span className="text-2xl" aria-label={provider?.name}>{provider?.icon}</span>
                      </div>
                      <span className="font-bold text-sm mb-1" title={provider?.name}>{provider?.name}</span>
                      <span className="text-xs text-muted-foreground mb-2 truncate max-w-[120px]">{acc.providerAccountId}</span>
                      <button
                        className="text-red-600 hover:underline focus-visible:ring-2 focus-visible:ring-primary transition-colors px-2 py-1 rounded text-xs"
                        onClick={() => handleDisconnect(acc.id)}
                        disabled={loading}
                        tabIndex={0}
                        aria-label={`Disconnect ${provider?.name}`}
                      >
                        Disconnect
                      </button>
                    </li>
                  );
                })}
              </ul>
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