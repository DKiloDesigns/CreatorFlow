"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Badge,
  Skeleton,
  Fade,
  Zoom,
  Paper,
  Stack,
  Divider
} from '@mui/material';
import {
  Instagram,
  Twitter,
  Facebook,
  YouTube,
  TikTok,
  LinkedIn,
  Pinterest,
  Snapchat,
  Twitch,
  Discord,
  Add,
  CheckCircle,
  Warning,
  Error,
  Refresh,
  Settings,
  MoreVert,
  TrendingUp,
  TrendingDown,
  Schedule,
  Public,
  Lock
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

// Platform configuration with icons and colors
const platformConfig = {
  instagram: {
    icon: Instagram,
    color: '#E4405F',
    name: 'Instagram',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
  },
  twitter: {
    icon: Twitter,
    color: '#1DA1F2',
    name: 'Twitter',
    gradient: 'linear-gradient(45deg, #1DA1F2 0%, #0D8BD9 100%)'
  },
  facebook: {
    icon: Facebook,
    color: '#1877F2',
    name: 'Facebook',
    gradient: 'linear-gradient(45deg, #1877F2 0%, #0D6EFD 100%)'
  },
  youtube: {
    icon: YouTube,
    color: '#FF0000',
    name: 'YouTube',
    gradient: 'linear-gradient(45deg, #FF0000 0%, #CC0000 100%)'
  },
  tiktok: {
    icon: TikTok,
    color: '#000000',
    name: 'TikTok',
    gradient: 'linear-gradient(45deg, #000000 0%, #25F4EE 50%, #FE2C55 100%)'
  },
  linkedin: {
    icon: LinkedIn,
    color: '#0A66C2',
    name: 'LinkedIn',
    gradient: 'linear-gradient(45deg, #0A66C2 0%, #0077B5 100%)'
  },
  pinterest: {
    icon: Pinterest,
    color: '#BD081C',
    name: 'Pinterest',
    gradient: 'linear-gradient(45deg, #BD081C 0%, #E60023 100%)'
  },
  snapchat: {
    icon: Snapchat,
    color: '#FFFC00',
    name: 'Snapchat',
    gradient: 'linear-gradient(45deg, #FFFC00 0%, #FFD700 100%)'
  },
  twitch: {
    icon: Twitch,
    color: '#9146FF',
    name: 'Twitch',
    gradient: 'linear-gradient(45deg, #9146FF 0%, #7B3FE4 100%)'
  },
  discord: {
    icon: Discord,
    color: '#5865F2',
    name: 'Discord',
    gradient: 'linear-gradient(45deg, #5865F2 0%, #4752C4 100%)'
  }
};

// Account status types
type AccountStatus = 'connected' | 'disconnected' | 'error' | 'pending' | 'rate_limited';

// Connected account interface
interface ConnectedAccount {
  id: string;
  platform: keyof typeof platformConfig;
  username: string;
  displayName: string;
  avatar: string;
  status: AccountStatus;
  lastSync: Date;
  followers: number;
  engagement: number;
  isVerified: boolean;
  isPrivate: boolean;
  lastPost?: Date;
  nextScheduledPost?: Date;
}

interface ConnectedAccountsStoryProps {
  accounts?: ConnectedAccount[];
  loading?: boolean;
  onAccountClick?: (account: ConnectedAccount) => void;
  onAddAccount?: () => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  maxVisible?: number;
  showStats?: boolean;
  compact?: boolean;
}

export default function ConnectedAccountsStory({
  accounts = [],
  loading = false,
  onAccountClick,
  onAddAccount,
  onRefresh,
  onSettings,
  maxVisible = 8,
  showStats = true,
  compact = false
}: ConnectedAccountsStoryProps) {
  const [visibleAccounts, setVisibleAccounts] = useState<ConnectedAccount[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Mock data for demonstration
  const mockAccounts: ConnectedAccount[] = [
    {
      id: '1',
      platform: 'instagram',
      username: 'creatorflow_official',
      displayName: 'CreatorFlow',
      avatar: '/api/placeholder/40/40',
      status: 'connected',
      lastSync: new Date(),
      followers: 15420,
      engagement: 4.2,
      isVerified: true,
      isPrivate: false,
      lastPost: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      nextScheduledPost: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
    },
    {
      id: '2',
      platform: 'twitter',
      username: 'creatorflow_ai',
      displayName: 'CreatorFlow AI',
      avatar: '/api/placeholder/40/40',
      status: 'connected',
      lastSync: new Date(),
      followers: 8920,
      engagement: 3.8,
      isVerified: false,
      isPrivate: false,
      lastPost: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      id: '3',
      platform: 'youtube',
      username: 'creatorflow_tutorials',
      displayName: 'CreatorFlow Tutorials',
      avatar: '/api/placeholder/40/40',
      status: 'connected',
      lastSync: new Date(),
      followers: 23450,
      engagement: 5.1,
      isVerified: true,
      isPrivate: false,
      lastPost: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '4',
      platform: 'tiktok',
      username: '@creatorflow_tips',
      displayName: 'CreatorFlow Tips',
      avatar: '/api/placeholder/40/40',
      status: 'connected',
      lastSync: new Date(),
      followers: 18760,
      engagement: 6.7,
      isVerified: false,
      isPrivate: false,
      lastPost: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      id: '5',
      platform: 'linkedin',
      username: 'creatorflow-company',
      displayName: 'CreatorFlow Company',
      avatar: '/api/placeholder/40/40',
      status: 'connected',
      lastSync: new Date(),
      followers: 5430,
      engagement: 2.9,
      isVerified: true,
      isPrivate: false,
      lastPost: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    }
  ];

  // Use mock data if no accounts provided
  const displayAccounts = accounts.length > 0 ? accounts : mockAccounts;

  useEffect(() => {
    if (showAll) {
      setVisibleAccounts(displayAccounts);
    } else {
      setVisibleAccounts(displayAccounts.slice(0, maxVisible));
    }
  }, [displayAccounts, showAll, maxVisible]);

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case 'connected':
        return designTokens.colors.success[500];
      case 'disconnected':
        return designTokens.colors.neutral[400];
      case 'error':
        return designTokens.colors.error[500];
      case 'pending':
        return designTokens.colors.warning[500];
      case 'rate_limited':
        return designTokens.colors.warning[600];
      default:
        return designTokens.colors.neutral[400];
    }
  };

  const getStatusIcon = (status: AccountStatus) => {
    switch (status) {
      case 'connected':
        return <CheckCircle fontSize="small" />;
      case 'disconnected':
        return <Error fontSize="small" />;
      case 'error':
        return <Error fontSize="small" />;
      case 'pending':
        return <Refresh fontSize="small" />;
      case 'rate_limited':
        return <Warning fontSize="small" />;
      default:
        return <Error fontSize="small" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const handleAccountClick = (account: ConnectedAccount) => {
    if (onAccountClick) {
      onAccountClick(account);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width={120} height={24} />
          <Box sx={{ flexGrow: 1 }} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 80 }}>
              <Skeleton variant="circular" width={60} height={60} />
              <Skeleton variant="text" width={60} height={16} sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%)',
        border: `1px solid ${designTokens.colors.neutral[200]}`,
        borderRadius: designTokens.borderRadius.xl,
        overflow: 'hidden',
        transition: designTokens.animation.micro.cardHover,
        '&:hover': {
          boxShadow: designTokens.shadows.md,
          transform: 'translateY(-2px)'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: compact ? 2 : 3, 
        borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
        background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography 
              variant={compact ? "subtitle1" : "h6"} 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: designTokens.colors.neutral[800],
                mb: 0.5
              }}
            >
              Connected Accounts
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CheckCircle fontSize="small" sx={{ color: designTokens.colors.success[500] }} />
              {displayAccounts.filter(a => a.status === 'connected').length} accounts active
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onRefresh && (
              <Tooltip title="Refresh accounts">
                <IconButton 
                  size="small" 
                  onClick={onRefresh}
                  sx={{ 
                    color: designTokens.colors.neutral[600],
                    '&:hover': { 
                      color: designTokens.colors.primary[500],
                      background: designTokens.colors.primary[50]
                    }
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            
            {onSettings && (
              <Tooltip title="Account settings">
                <IconButton 
                  size="small" 
                  onClick={onSettings}
                  sx={{ 
                    color: designTokens.colors.neutral[600],
                    '&:hover': { 
                      color: designTokens.colors.primary[500],
                      background: designTokens.colors.primary[50]
                    }
                  }}
                >
                  <Settings fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Box>

      {/* Accounts Grid */}
      <Box sx={{ p: compact ? 2 : 3 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: compact ? 1.5 : 2, 
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: '4px'
          },
          '&::-webkit-scrollbar-track': {
            background: designTokens.colors.neutral[100],
            borderRadius: '2px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: designTokens.colors.neutral[300],
            borderRadius: '2px',
            '&:hover': {
              background: designTokens.colors.neutral[400]
            }
          }
        }}>
          {/* Add Account Button */}
          {onAddAccount && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              minWidth: compact ? 70 : 80,
              cursor: 'pointer'
            }}>
              <Paper
                elevation={0}
                onClick={onAddAccount}
                sx={{
                  width: compact ? 56 : 64,
                  height: compact ? 56 : 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  border: `2px dashed ${designTokens.colors.primary[300]}`,
                  cursor: 'pointer',
                  transition: designTokens.animation.micro.scale,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    borderColor: designTokens.colors.primary[500],
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)'
                  }
                }}
              >
                <Add sx={{ 
                  color: designTokens.colors.primary[500],
                  fontSize: compact ? 24 : 28
                }} />
              </Paper>
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1, 
                  color: designTokens.colors.primary[600],
                  fontWeight: designTokens.typography.fontWeight.medium,
                  textAlign: 'center',
                  fontSize: compact ? '0.7rem' : '0.75rem'
                }}
              >
                Add Account
              </Typography>
            </Box>
          )}

          {/* Connected Accounts */}
          {visibleAccounts.map((account) => {
            const platform = platformConfig[account.platform];
            const PlatformIcon = platform.icon;
            
            return (
              <Fade in={true} key={account.id}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  minWidth: compact ? 70 : 80,
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  {/* Account Avatar with Status */}
                  <Box sx={{ position: 'relative', mb: 1 }}>
                    <Avatar
                      src={account.avatar}
                      alt={account.displayName}
                      sx={{
                        width: compact ? 56 : 64,
                        height: compact ? 56 : 64,
                        border: `3px solid ${getStatusColor(account.status)}`,
                        cursor: 'pointer',
                        transition: designTokens.animation.micro.scale,
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => handleAccountClick(account)}
                    >
                      <PlatformIcon sx={{ 
                        color: 'white',
                        fontSize: compact ? 20 : 24
                      }} />
                    </Avatar>
                    
                    {/* Status Badge */}
                    <Badge
                      badgeContent={getStatusIcon(account.status)}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: getStatusColor(account.status),
                          color: 'white',
                          border: `2px solid white`,
                          fontSize: '0.6rem',
                          width: 16,
                          height: 16,
                          minWidth: 16
                        }
                      }}
                    />
                    
                    {/* Verification Badge */}
                    {account.isVerified && (
                      <Box sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white',
                        boxShadow: designTokens.shadows.sm
                      }}>
                        <CheckCircle sx={{ 
                          fontSize: 12, 
                          color: 'white' 
                        }} />
                      </Box>
                    )}
                  </Box>

                  {/* Account Info */}
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: designTokens.typography.fontWeight.medium,
                        color: designTokens.colors.neutral[800],
                        display: 'block',
                        fontSize: compact ? '0.7rem' : '0.75rem',
                        lineHeight: 1.2,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {account.displayName}
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: designTokens.colors.neutral[600],
                        fontSize: compact ? '0.65rem' : '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5
                      }}
                    >
                      {account.isPrivate ? (
                        <Lock fontSize="inherit" />
                      ) : (
                        <Public fontSize="inherit" />
                      )}
                      {account.username}
                    </Typography>

                    {/* Stats (if enabled and not compact) */}
                    {showStats && !compact && (
                      <Box sx={{ mt: 1 }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: designTokens.colors.neutral[500],
                            fontSize: '0.65rem',
                            display: 'block'
                          }}
                        >
                          {formatNumber(account.followers)} followers
                        </Typography>
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 0.5,
                          mt: 0.5
                        }}>
                          {account.engagement > 4 ? (
                            <TrendingUp sx={{ fontSize: 12, color: designTokens.colors.success[500] }} />
                          ) : (
                            <TrendingDown sx={{ fontSize: 12, color: designTokens.colors.warning[500] }} />
                          )}
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: account.engagement > 4 ? designTokens.colors.success[600] : designTokens.colors.warning[600],
                              fontSize: '0.65rem',
                              fontWeight: designTokens.typography.fontWeight.medium
                            }}
                          >
                            {account.engagement}%
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Last Post Indicator */}
                    {account.lastPost && !compact && (
                      <Box sx={{ 
                        mt: 1,
                        p: 0.5,
                        background: designTokens.colors.neutral[100],
                        borderRadius: designTokens.borderRadius.sm,
                        border: `1px solid ${designTokens.colors.neutral[200]}`
                      }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: designTokens.colors.neutral[600],
                            fontSize: '0.6rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5
                          }}
                        >
                          <Schedule fontSize="inherit" />
                          {formatTimeAgo(account.lastPost)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Fade>
            );
          })}
        </Box>

        {/* Show More/Less Toggle */}
        {displayAccounts.length > maxVisible && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${designTokens.colors.neutral[200]}`
          }}>
            <Chip
              label={showAll ? `Show Less` : `Show ${displayAccounts.length - maxVisible} More`}
              onClick={() => setShowAll(!showAll)}
              variant="outlined"
              size="small"
              sx={{
                borderColor: designTokens.colors.primary[300],
                color: designTokens.colors.primary[600],
                '&:hover': {
                  borderColor: designTokens.colors.primary[500],
                  background: designTokens.colors.primary[50]
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
