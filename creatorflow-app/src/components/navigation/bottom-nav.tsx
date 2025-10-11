'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Home as HomeIcon,
  Create as PenToolIcon,
  BarChart as BarChart3Icon,
  Image as ImageIcon,
  Person as UserIcon,
  CloudUpload as UploadIcon,
  Build as WrenchIcon,
  Notifications as BellIcon,
  Chat as MessageSquareIcon,
  Calculate as CalculateIcon,
  Tag as TagIcon,
  CalendarMonth as CalendarIcon,
  Assessment as AssessmentIcon,
  AccessTime as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Badge
} from '@mui/material';
import { useState, useRef } from 'react';

// Tools data for the drawer - organized by plan tier
const freeTools = [
  {
    id: 'calculator',
    label: 'Social Media Calculator',
    icon: <CalculateIcon />,
    path: '/tools/social-media-calculator',
    color: '#4CAF50',
    description: 'Calculate optimal posting times and engagement rates',
    tier: 'free'
  },
  {
    id: 'hashtag',
    label: 'Hashtag Research',
    icon: <TagIcon />,
    path: '/tools/hashtag-research',
    color: '#FF9800',
    description: 'Find trending hashtags for your content',
    tier: 'free'
  },
  {
    id: 'templates',
    label: 'Calendar Templates',
    icon: <CalendarIcon />,
    path: '/tools/calendar-templates',
    color: '#9C27B0',
    description: 'Pre-made content calendar templates',
    tier: 'free'
  },
  {
    id: 'audit',
    label: 'Social Media Audit',
    icon: <AssessmentIcon />,
    path: '/tools/social-media-audit',
    color: '#F44336',
    description: 'Analyze your social media performance',
    tier: 'free'
  },
  {
    id: 'timing',
    label: 'Posting Time Optimizer',
    icon: <ScheduleIcon />,
    path: '/tools/posting-time-optimizer',
    color: '#2196F3',
    description: 'Find the best times to post for maximum engagement',
    tier: 'free'
  },
  {
    id: 'predictor',
    label: 'Content Predictor',
    icon: <TrendingUpIcon />,
    path: '/tools/content-predictor',
    color: '#E91E63',
    description: 'AI-powered content performance prediction',
    tier: 'free'
  }
];

const creatorTools = [
  {
    id: 'voice-tone',
    label: 'Voice & Tone Analyzer',
    icon: <CalculateIcon />,
    path: '/tools/voice-tone-analyzer',
    color: '#FF6B6B',
    description: 'Analyze your content\'s voice and tone for brand consistency',
    tier: 'creator'
  },
  {
    id: 'ai-content',
    label: 'AI Content Creation',
    icon: <TagIcon />,
    path: '/tools/ai-content-creation',
    color: '#4ECDC4',
    description: 'Complete AI-powered content generation and optimization',
    tier: 'creator'
  },
  {
    id: 'content-repurposing',
    label: 'Content Repurposing',
    icon: <CalendarIcon />,
    path: '/tools/content-repurposing',
    color: '#45B7D1',
    description: 'Automatically create platform-specific versions of content',
    tier: 'creator'
  },
  {
    id: 'hashtag-tracker',
    label: 'Hashtag Performance Tracker',
    icon: <AssessmentIcon />,
    path: '/tools/hashtag-tracker',
    color: '#96CEB4',
    description: 'Track which hashtags work best for your content',
    tier: 'creator'
  }
];

const proTools = [
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    icon: <CalculateIcon />,
    path: '/tools/advanced-analytics',
    color: '#6C5CE7',
    description: 'Comprehensive cross-platform analytics with AI insights',
    tier: 'pro'
  },
  {
    id: 'trend-prediction',
    label: 'Trend Prediction',
    icon: <TagIcon />,
    path: '/tools/trend-prediction',
    color: '#A29BFE',
    description: 'AI-powered trend forecasting and analysis',
    tier: 'pro'
  },
  {
    id: 'content-gap',
    label: 'Content Gap Analyzer',
    icon: <CalendarIcon />,
    path: '/tools/content-gap-analyzer',
    color: '#FD79A8',
    description: 'Competitor analysis and content opportunity identification',
    tier: 'pro'
  },
  {
    id: 'sentiment-tracker',
    label: 'Audience Sentiment Tracker',
    icon: <AssessmentIcon />,
    path: '/tools/sentiment-tracker',
    color: '#FDCB6E',
    description: 'Monitor audience sentiment and brand perception',
    tier: 'pro'
  }
];

const enterpriseTools = [
  {
    id: 'ai-suite',
    label: 'AI Content Suite',
    icon: <CalculateIcon />,
    path: '/tools/ai-content-suite',
    color: '#E17055',
    description: 'Advanced AI-powered content generation for enterprise teams',
    tier: 'enterprise'
  },
  {
    id: 'enterprise-analytics',
    label: 'Enterprise Analytics',
    icon: <TagIcon />,
    path: '/tools/enterprise-analytics',
    color: '#00B894',
    description: 'Comprehensive analytics and reporting for enterprise teams',
    tier: 'enterprise'
  },
  {
    id: 'team-collaboration',
    label: 'Team Collaboration',
    icon: <CalendarIcon />,
    path: '/tools/team-collaboration',
    color: '#00CEC9',
    description: 'Advanced team management and collaboration tools',
    tier: 'enterprise'
  },
  {
    id: 'white-label',
    label: 'White-label Solutions',
    icon: <AssessmentIcon />,
    path: '/tools/white-label-solutions',
    color: '#FDCB6E',
    description: 'Custom branding and white-label experiences',
    tier: 'enterprise'
  }
];

const navItems = [
  {
    href: '/dashboard',
    icon: HomeIcon,
    label: 'Home',
    activePattern: /^\/dashboard$/,
    isTools: false
  },
  {
    href: '/dashboard/media',
    icon: ImageIcon,
    label: 'Media',
    activePattern: /^\/dashboard\/media$/,
    isTools: false
  },
  {
    href: '/dashboard/content',
    icon: PenToolIcon,
    label: 'Create',
    activePattern: /^\/dashboard\/content$/,
    isTools: false
  },
  {
    href: '/dashboard/analytics',
    icon: BarChart3Icon,
    label: 'Analytics',
    activePattern: /^\/dashboard\/analytics$/,
    isTools: false
  },
  {
    href: '/dashboard/profile',
    icon: UserIcon,
    label: 'Profile',
    activePattern: /^\/dashboard\/(profile|security|collabs|accounts|teams|settings|notifications|support)$/,
    isTools: false
  }
];

function ProfilePicture({ session, isActive }: { session: any; isActive: boolean }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userImage = session?.user?.image;
  const userName = session?.user?.name || 'User';
  
  // Helper for initials if no image
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Refresh the session to get the new image
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <Button
        onClick={handleImageClick}
        disabled={isUploading}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 64,
          borderRadius: 2,
          minWidth: 44,
          minHeight: 44,
          position: 'relative',
          color: isActive ? 'primary.main' : 'text.secondary',
          bgcolor: isActive ? 'primary.50' : 'transparent',
          '&:hover': {
            bgcolor: isActive ? 'primary.100' : 'action.hover'
          },
          '&:disabled': {
            opacity: 0.6
          }
        }}
      >
        {userImage ? (
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={userImage} 
              alt={userName}
              sx={{ 
                width: 32, 
                height: 32, 
                border: 2, 
                borderColor: 'currentColor' 
              }}
            />
            {isUploading && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UploadIcon sx={{ fontSize: 16, color: 'white' }} />
              </Box>
            )}
            {/* Upload indicator */}
            <Box sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s'
            }}>
              <UploadIcon sx={{ fontSize: 10, color: 'white' }} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'transparent',
              border: 2, 
              borderColor: 'currentColor',
              color: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              {getInitials(userName)}
            </Avatar>
            {isUploading && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UploadIcon sx={{ fontSize: 16, color: 'white' }} />
              </Box>
            )}
            {/* Upload indicator */}
            <Box sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s'
            }}>
              <UploadIcon sx={{ fontSize: 10, color: 'white' }} />
            </Box>
          </Box>
        )}
        
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            fontWeight: 500,
            color: 'inherit'
          }}
        >
          Profile
        </Typography>
      </Button>
    </Box>
  );
}

// Tools Drawer Component
function ToolsDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleToolClick = (path: string) => {
    router.push(path);
    onClose();
  };

  // Get tools based on user plan
  const getUserTools = () => {
    const plan = session?.user?.plan || 'FREE';
    
    switch (plan) {
      case 'CREATOR':
        return [...freeTools, ...creatorTools];
      case 'PRO':
        return [...freeTools, ...creatorTools, ...proTools];
      case 'ENTERPRISE':
        return [...freeTools, ...creatorTools, ...proTools, ...enterpriseTools];
      default:
        return freeTools;
    }
  };

  const userTools = getUserTools();
  const plan = session?.user?.plan || 'FREE';

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '80vh',
          pb: 2
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 2
        }}>
          <Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
              {plan === 'FREE' ? 'Free Tools' : 
               plan === 'CREATOR' ? 'Creator Tools' :
               plan === 'PRO' ? 'Pro Tools' : 'Enterprise Tools'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              {plan === 'FREE' ? '6 free tools available' : 
               plan === 'CREATOR' ? '10 tools (6 free + 4 creator)' :
               plan === 'PRO' ? '14 tools (6 free + 4 creator + 4 pro)' : '18 tools (all tiers)'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Tools List */}
        <List sx={{ px: 0 }}>
          {userTools.map((tool, index) => (
            <ListItem
              key={tool.id}
              onClick={() => handleToolClick(tool.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                },
                transition: 'background-color 0.2s'
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{ color: tool.color, position: 'relative' }}>
                  {tool.icon}
                  {/* Tier indicator */}
                  {tool.tier !== 'free' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: tool.tier === 'creator' ? '#FF6B6B' :
                                       tool.tier === 'pro' ? '#6C5CE7' : '#E17055',
                        border: '2px solid white',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    >
                      {tool.tier === 'creator' ? 'C' : tool.tier === 'pro' ? 'P' : 'E'}
                    </Box>
                  )}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {tool.label}
                    {tool.tier !== 'free' && (
                      <Box
                        sx={{
                          px: 1,
                          py: 0.25,
                          borderRadius: 1,
                          backgroundColor: tool.tier === 'creator' ? '#FF6B6B20' :
                                         tool.tier === 'pro' ? '#6C5CE720' : '#E1705520',
                          color: tool.tier === 'creator' ? '#FF6B6B' :
                                 tool.tier === 'pro' ? '#6C5CE7' : '#E17055',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}
                      >
                        {tool.tier}
                      </Box>
                    )}
                  </Box>
                }
                secondary={tool.description}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.95rem'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.8rem',
                  color: 'text.secondary'
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'primary.50', 
          borderRadius: 2,
          textAlign: 'center'
        }}>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
            💡 All tools are free to use!
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [toolsDrawerOpen, setToolsDrawerOpen] = useState(false);

  return (
    <Paper
      component="nav"
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: { xs: 'block', md: 'none' }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        px: 2, 
        py: 2 
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? item.activePattern.test(pathname) : false;
          
          // Special handling for Profile item
          if (item.label === 'Profile') {
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <ProfilePicture session={session} isActive={isActive} />
              </Link>
            );
          }
          
          
          // Special handling for Tools item
          if (item.isTools) {
            return (
              <Button
                key={item.href}
                onClick={() => setToolsDrawerOpen(true)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 64,
                  borderRadius: 2,
                  minWidth: 44,
                  minHeight: 44,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.100' : 'action.hover'
                  }
                }}
              >
                <Icon 
                  sx={{ fontSize: 22, color: 'inherit', transition: 'color 0.2s' }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    fontWeight: 500,
                    color: 'inherit',
                    transition: 'color 0.2s'
                  }}
                >
                  {item.label}
                </Typography>
              </Button>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none' }}
            >
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 64,
                  borderRadius: 2,
                  minWidth: 44,
                  minHeight: 44,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.100' : 'action.hover'
                  }
                }}
              >
                <Icon 
                  sx={{ fontSize: 22, color: 'inherit', transition: 'color 0.2s' }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    fontWeight: 500,
                    color: 'inherit',
                    transition: 'color 0.2s'
                  }}
                >
                  {item.label}
                </Typography>
              </Button>
            </Link>
          );
        })}
      </Box>
      
      {/* Tools Drawer */}
      <ToolsDrawer 
        open={toolsDrawerOpen} 
        onClose={() => setToolsDrawerOpen(false)} 
      />
    </Paper>
  );
} 