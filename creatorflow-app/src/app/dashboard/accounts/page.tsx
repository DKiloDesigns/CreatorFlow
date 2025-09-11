"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Container,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  InputAdornment,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Switch
} from '@mui/material';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Globe, 
  Twitter, 
  Instagram, 
  Youtube,
  Plus,
  Trash2,
  Settings,
  Link,
  ExternalLink,
  Search,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import InstagramStoriesPlatforms, { createPlatformWithIcon } from '@/components/ui/instagram-stories-platforms';

const PROVIDERS = [
  // Most Popular Platforms First (Social Media)
  { name: 'Instagram', id: 'instagram', icon: '📸', color: '#E1306C' },
  { name: 'TikTok', id: 'tiktok', icon: '🎵', color: '#010101' },
  { name: 'YouTube', id: 'youtube', icon: '▶️', color: '#FF0000' },
  { name: 'Facebook', id: 'facebook', icon: '📘', color: '#1877F3' },
  { name: 'X', id: 'twitter', icon: '🐦', color: '#000000' },
  { name: 'LinkedIn', id: 'linkedin', icon: '💼', color: '#0077B5' },
  { name: 'Pinterest', id: 'pinterest', icon: '📌', color: '#E60023' },
  { name: 'Threads', id: 'threads', icon: '🧵', color: '#000000' },
  { name: 'WhatsApp', id: 'whatsapp', icon: '💬', color: '#25D366' },
  { name: 'Messenger', id: 'messenger', icon: '💭', color: '#0084FF' },
  { name: 'Snapchat', id: 'snapchat', icon: '👻', color: '#FFFC00' },
  { name: 'Reddit', id: 'reddit', icon: '👽', color: '#FF4500' },
  { name: 'Telegram', id: 'telegram', icon: '✈️', color: '#229ED9' },
  { name: 'WeChat', id: 'wechat', icon: '🟩', color: '#09B83E' },
  { name: 'Google My Business', id: 'gmb', icon: '🏢', color: '#4285F4' },
  { name: 'Mastodon', id: 'mastodon', icon: '🐘', color: '#6364FF', requiresInstance: true },
  
  // Content & Development Platforms
  { name: 'GitHub', id: 'github', icon: '🐙', color: '#333333' },
  { name: 'Discord', id: 'discord', icon: '🎮', color: '#5865F2' },
  { name: 'Slack', id: 'slack', icon: '💬', color: '#4A154B' },
  { name: 'Medium', id: 'medium', icon: '📝', color: '#00AB6C' },
  { name: 'Substack', id: 'substack', icon: '📧', color: '#FF6719' },
  { name: 'Twitch', id: 'twitch', icon: '🎥', color: '#9146FF' },
  { name: 'Vimeo', id: 'vimeo', icon: '🎬', color: '#1AB7EA' },
  { name: 'Product Hunt', id: 'producthunt', icon: '🔍', color: '#DA552F' },
  
  // Business & Productivity Tools
  { name: 'Notion', id: 'notion', icon: '📋', color: '#000000' },
  { name: 'Mailchimp', id: 'mailchimp', icon: '📧', color: '#FFE01B' },
  { name: 'Klaviyo', id: 'klaviyo', icon: '📊', color: '#E31C79' },
  { name: 'SMS', id: 'sms', icon: '📱', color: '#00C851' },
  { name: 'Behance', id: 'behance', icon: '🎨', color: '#1769FF' },
  { name: 'Dribbble', id: 'dribbble', icon: '🏀', color: '#EA4C89' },
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

function MastodonInstanceDialog({ 
  isOpen, 
  onClose, 
  onConnect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConnect: (instance: string) => void; 
}) {
  const [instance, setInstance] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instance.trim()) return;

    setIsValidating(true);
    try {
      // Validate the instance URL
      const cleanInstance = instance.trim().replace(/^https?:\/\//, '');
      const testUrl = `https://${cleanInstance}/api/v1/instance`;
      
      const response = await fetch(testUrl);
      if (response.ok) {
        onConnect(cleanInstance);
        onClose();
        setInstance('');
      } else {
        toast.error('Invalid Mastodon instance. Please check the URL and try again.');
      }
    } catch (error) {
      toast.error('Could not connect to Mastodon instance. Please check the URL and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Globe style={{ width: 20, height: 20 }} />
          Connect Mastodon Instance
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Instance URL"
            type="text"
            placeholder="mastodon.social"
            value={instance}
            onChange={(e) => setInstance(e.target.value)}
            disabled={isValidating}
            fullWidth
            required
            helperText="Enter your Mastodon instance domain without https:// (e.g., mastodon.social)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isValidating}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!instance.trim() || isValidating}
        >
          {isValidating ? 'Validating...' : 'Connect'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ConnectedAccountCard({ account, onDisconnect, onRefresh, onReauth, loading }: {
  account: SocialAccount;
  onDisconnect: (accountId: string) => void;
  onRefresh: (accountId: string) => void;
  onReauth: (platform: string) => void;
  loading: boolean;
}) {
  const getStatusBadge = () => {
    switch (account.status) {
      case 'active':
        return <Chip label="Active" color="success" size="small" />;
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'needs_reauth':
        return <Chip label="Needs Re-auth" color="error" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  const provider = PROVIDERS.find(p => p.id === account.platform);

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {provider?.name || account.platform}
            </Typography>
            {getStatusBadge()}
          </Box>
        }
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        avatar={
          <Avatar sx={{ bgcolor: provider?.color || 'primary.main' }}>
            {provider?.icon || '🔗'}
          </Avatar>
        }
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh">
              <IconButton 
                size="small"
                onClick={() => onRefresh(account.id)}
                disabled={loading}
              >
                <RefreshCw style={{ width: 16, height: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Re-authenticate">
              <IconButton 
                size="small"
                onClick={() => onReauth(account.platform)}
                disabled={loading}
              >
                <Settings style={{ width: 16, height: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Disconnect">
              <IconButton 
                size="small" 
                color="error"
                onClick={() => onDisconnect(account.id)}
                disabled={loading}
              >
                <Trash2 style={{ width: 16, height: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Username: {account.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Connected: {new Date(account.createdAt).toLocaleDateString()}
          </Typography>
          {account.tokenExpiresAt && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Expires: {new Date(account.tokenExpiresAt).toLocaleDateString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AccountsPage() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showMastodonDialog, setShowMastodonDialog] = useState(false);
  const [mastodonInstance, setMastodonInstance] = useState('');
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'social' | 'content' | 'business'>('all');
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter providers based on search and category
  const filteredProviders = React.useMemo(() => {
    let filtered = PROVIDERS;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap = {
        social: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'pinterest', 'threads', 'whatsapp', 'messenger', 'wechat', 'telegram', 'reddit', 'snapchat', 'gmb', 'mastodon'],
        content: ['github', 'discord', 'slack', 'medium', 'substack', 'twitch', 'vimeo', 'producthunt', 'behance', 'dribbble'],
        business: ['notion', 'mailchimp', 'klaviyo', 'sms']
      };
      filtered = filtered.filter(provider => 
        categoryMap[selectedCategory].includes(provider.id)
      );
    }
    
    // No mobile limitation - show all platforms
    return filtered;
  }, [searchTerm, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSocialAccounts(),
        fetchAccounts(),
        fetchKeys(),
        fetchPlan(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialAccounts = async () => {
    try {
      const response = await fetch('/api/social-accounts');
      if (response.ok) {
        const data = await response.json();
        setSocialAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching social accounts:', error);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    }
  };

  const fetchPlan = async () => {
    try {
      const response = await fetch('/api/plan');
      if (response.ok) {
        const data = await response.json();
        setPlan(data);
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const handleConnect = async (provider: string, instance?: string) => {
    setConnecting(provider);
    try {
      const response = await fetch('/api/social-accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, instance }),
      });

      if (response.ok) {
        toast.success(`Successfully connected to ${provider}`);
        await fetchSocialAccounts();
      } else {
        toast.error(`Failed to connect to ${provider}`);
      }
    } catch (error) {
      toast.error(`Error connecting to ${provider}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${accountId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Account disconnected successfully');
        await fetchSocialAccounts();
      } else {
        toast.error('Failed to disconnect account');
      }
    } catch (error) {
      toast.error('Error disconnecting account');
    }
  };

  const handleRefresh = async (accountId: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${accountId}/refresh`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Account refreshed successfully');
        await fetchSocialAccounts();
      } else {
        toast.error('Failed to refresh account');
      }
    } catch (error) {
      toast.error('Error refreshing account');
    }
  };

  const handleReauth = async (platform: string) => {
    try {
      const response = await fetch(`/api/social-accounts/${platform}/reauth`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Re-authentication initiated');
        await fetchSocialAccounts();
      } else {
        toast.error('Failed to re-authenticate');
      }
    } catch (error) {
      toast.error('Error re-authenticating');
    }
  };

  // Create platform data for Instagram Stories component
  const storiesPlatforms = React.useMemo(() => {
    return filteredProviders.map(provider => {
      const isConnected = socialAccounts.some(acc => acc.platform === provider.id);
      const isConnecting = connecting === provider.id;
      
      return createPlatformWithIcon(
        provider.id,
        provider.name,
        provider.color,
        isConnected,
        isConnecting,
        provider.requiresInstance
      );
    });
  }, [filteredProviders, socialAccounts, connecting]);

  const handlePlatformClick = (platformId: string) => {
    const provider = PROVIDERS.find(p => p.id === platformId);
    if (!provider) return;

    if (provider.requiresInstance) {
      setShowMastodonDialog(true);
    } else {
      handleConnect(platformId);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Connected Accounts
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Manage your social media and platform connections
          </Typography>
        </Box>

        {/* Connected Accounts */}
        <Card>
          <CardHeader
            title="Connected Accounts"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Link style={{ width: 24, height: 24, color: '#3b82f6' }} />}
          />
          <CardContent>
            {socialAccounts.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                {socialAccounts.map((account) => (
                  <Box key={account.id}>
                    <ConnectedAccountCard
                      account={account}
                      onDisconnect={handleDisconnect}
                      onRefresh={handleRefresh}
                      onReauth={handleReauth}
                      loading={connecting === account.platform}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No connected accounts
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Connect your social media accounts to get started
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Available Providers */}
        <Card>
          <CardHeader
            title="Available Platforms"
            titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
            avatar={<Plus style={{ width: 24, height: 24, color: '#10b981' }} />}
          />
          <CardContent>
            {/* Search/Filter for Mobile */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="All"
                  onClick={() => setSelectedCategory('all')}
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="Social Media"
                  onClick={() => setSelectedCategory('social')}
                  color={selectedCategory === 'social' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="Content"
                  onClick={() => setSelectedCategory('content')}
                  color={selectedCategory === 'content' ? 'primary' : 'default'}
                  size="small"
                />
                <Chip
                  label="Business"
                  onClick={() => setSelectedCategory('business')}
                  color={selectedCategory === 'business' ? 'primary' : 'default'}
                  size="small"
                />
              </Box>
            </Box>

            {/* Mobile Instagram Stories Style */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <InstagramStoriesPlatforms
                platforms={storiesPlatforms}
                onPlatformClick={handlePlatformClick}
                onConnect={(platformId) => handleConnect(platformId)}
                onDisconnect={(platformId) => {
                  const account = socialAccounts.find(acc => acc.platform === platformId);
                  if (account) {
                    handleDisconnect(account.id);
                  }
                }}
                searchTerm={searchTerm}
              />
            </Box>

            {/* Desktop Grid */}
            <Box sx={{ 
              display: { xs: 'none', md: 'grid' },
              gridTemplateColumns: { 
                md: 'repeat(4, 1fr)', 
                lg: 'repeat(5, 1fr)' 
              }, 
              gap: 2
            }}>
              {filteredProviders.map((provider) => {
                const isConnected = socialAccounts.some(acc => acc.platform === provider.id);
                const isConnecting = connecting === provider.id;
                
                return (
                  <Box key={provider.id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <CardContent sx={{ 
                        textAlign: 'center', 
                        py: 2,
                        px: 2
                      }}>
                        <Typography variant="h4" sx={{ mb: 1, fontSize: '2rem' }}>
                          {provider.icon}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            mb: 1,
                            fontSize: '0.875rem',
                            lineHeight: 1.2
                          }}
                        >
                          {provider.name}
                        </Typography>
                        {isConnected ? (
                          <Chip 
                            label="Connected" 
                            color="success" 
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            disabled={isConnecting}
                            onClick={() => {
                              if (provider.requiresInstance) {
                                setShowMastodonDialog(true);
                              } else {
                                handleConnect(provider.id);
                              }
                            }}
                            startIcon={isConnecting ? <CircularProgress size={14} /> : <Plus style={{ width: 14, height: 14 }} />}
                            sx={{ 
                              fontSize: '0.75rem',
                              minWidth: '80px',
                              px: 2
                            }}
                          >
                            {isConnecting ? 'Connecting...' : 'Connect'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </Box>

          </CardContent>
        </Card>

        {/* Mastodon Instance Dialog */}
        <MastodonInstanceDialog
          isOpen={showMastodonDialog}
          onClose={() => setShowMastodonDialog(false)}
          onConnect={(instance) => handleConnect('mastodon', instance)}
        />

        {/* Bottom Spacer to Clear Bottom Navigation */}
        <Box sx={{
          height: { xs: '120px', sm: '40px' },
          width: '100%'
        }} />
      </Box>
    </Container>
  );
} 