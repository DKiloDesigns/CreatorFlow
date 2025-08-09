"use client";

export const dynamic = 'force-dynamic';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu, Bell, BarChart3, Target, MessageSquare, CalendarIcon, Activity, Shield, Settings, Sparkles, Building2, Smartphone, Plug, TestTube, Home, Calendar, Brain, HelpCircle, HardDrive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import { 
  MuiEnhancedNavigation
} from '@/components/ui/mui-components';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileLayout } from '@/components/layout/mobile-layout';
import { useRealTimeNotifications } from '@/components/notifications/real-time-provider';
import { useSession } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { unreadCount, isConnected } = useRealTimeNotifications();
  const { data: session } = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/announcements');
        if (!res.ok) return;
        const data = await res.json();
        // Try to get user id from first readBy or from session
        let userId = null;
        if (data.length > 0 && data[0].readBy) {
          const allIds = data.flatMap((a: any) => a.readBy.map((u: any) => u.id));
          if (allIds.length > 0) userId = allIds[0];
        }
        const unread = data.filter((a: any) => !a.readBy.some((u: any) => u.id === userId)).length;
        setUnreadAnnouncements(unread);
      } catch {}
    }
    fetchUnread();
  }, []);

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/content', label: 'Content', icon: FileText },
    { href: '/dashboard/accounts', label: 'Accounts', icon: Users },
    { href: '/dashboard/scheduling', label: 'Scheduling', icon: Calendar },
    { href: '/dashboard/ai-tools', label: 'AI Tools', icon: Brain },
    { href: '/dashboard/collabs', label: 'Collabs', icon: Handshake },
    { href: '/dashboard/teams', label: 'Teams', icon: Building2 },
    { href: '/dashboard/mobile', label: 'Mobile', icon: Smartphone },
    { href: '/dashboard/integrations', label: 'Integrations', icon: Plug },
    { href: '/dashboard/testing', label: 'Testing', icon: TestTube },
    { href: '/dashboard/advanced-integrations', label: 'Advanced', icon: Sparkles },
    { href: '/dashboard/enterprise', label: 'Enterprise', icon: Building2 },
    { href: '/dashboard/security', label: 'Security', icon: Shield },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/support', label: 'Support', icon: HelpCircle },
    { href: '/dashboard/notifications/enhanced', label: 'Notifications', icon: Bell },
    { href: '/admin/campaign', label: 'Campaign', icon: Target },
    { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/admin/performance', label: 'Performance', icon: HardDrive },
  ];

  return (
    <MobileLayout>
      {/* Navigation */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 40
        }}
        role="banner"
        aria-label="Main navigation"
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', height: 64 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'black', 
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                role="img"
                aria-label="CreatorFlow logo"
              >
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>
                  CF
                </Typography>
              </Box>
              <Typography 
                variant="h5" 
                component="span" 
                sx={{ fontWeight: 'bold', color: 'text.primary' }}
                aria-label="CreatorFlow"
              >
                CreatorFlow
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box 
              sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 4 }}
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.slice(0, 8).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant="text"
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`Navigate to ${item.label}`}
                    sx={{
                      color: isActive 
                        ? 'primary.main' 
                        : 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'action.hover'
                      },
                      minWidth: 44,
                      minHeight: 44,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '2px'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Tablet Navigation */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex', lg: 'none' }, 
                alignItems: 'center', 
                justifyContent: 'space-between',
                width: '100%',
                px: 2,
                py: 1,
                bgcolor: 'background.default',
                borderBottom: 1,
                borderColor: 'divider'
              }}
              role="navigation"
              aria-label="Tablet navigation"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {navigationItems.slice(0, 8).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <IconButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      aria-label={`Navigate to ${item.label}`}
                      sx={{
                        color: isActive 
                          ? 'primary.main' 
                          : 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: 'action.hover'
                        },
                        '&:focus-visible': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px'
                        }
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </IconButton>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* MuiUserMenu */}
                <NotificationCenter />
                <ThemeToggle />
              </Box>
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Theme Toggle */}
              <Box sx={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ThemeToggle isLandingPage={false} />
              </Box>
              
              {/* Notification Center - Only render on client */}
              {isClient && (
                <Box sx={{ position: 'relative', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <NotificationCenter />
                  {unreadCount > 0 && (
                    <Badge
                      badgeContent={unreadCount > 99 ? '99+' : unreadCount}
                      color="error"
                      aria-label={`${unreadCount} unread notifications`}
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  )}
                </Box>
              )}
              
              {/* Desktop User Menu - Only render on client */}
              {isClient && (
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                  {/* MuiUserMenu */}
                </Box>
              )}
              
              {/* Tablet User Menu - Only render on client */}
              {isClient && (
                <Box sx={{ display: { xs: 'none', md: 'block', lg: 'none' } }}>
                  {/* MuiUserMenu */}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </MobileLayout>
  );
} 