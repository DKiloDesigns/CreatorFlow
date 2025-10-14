"use client";

export const dynamic = 'force-dynamic';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import {
  BarChart as BarChartIcon,
  Group as GroupIcon,
  Description as DescriptionIcon,
  Handshake as HandshakeIcon,
  CreditCard as CreditCardIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  BarChart as BarChart3Icon, // Re-using BarChartIcon for BarChart3
  Target as TargetIcon,
  Message as MessageIcon,
  CalendarMonth as CalendarMonthIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Star as StarIcon,
  Business as BusinessIcon,
  Smartphone as SmartphoneIcon,
  Share as ShareIcon, // Using ShareIcon for Plug as it often represents integrations
  Science as ScienceIcon, // Using ScienceIcon for TestTube
  Home as HomeIcon,
  Event as EventIcon, // Using EventIcon for Calendar
  Psychology as PsychologyIcon, // Using PsychologyIcon for Brain
  Help as HelpIcon,
  Storage as StorageIcon, // Using StorageIcon for HardDrive
  SmartToy as SmartToyIcon, // Using SmartToyIcon for Bot
  Bolt as BoltIcon,
  Accessibility as AccessibilityIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon, // Using DashboardIcon for Layout
  Image as ImageIcon,
  Build as BuildIcon, // Using BuildIcon for Wrench
  Calculate as CalculateIcon, // Using CalculateIcon for Calculator
  Tag as TagIcon, // Using TagIcon for Hash
  AccessTime as AccessTimeIcon,
  TrendingUp as TrendingUp2Icon, // Re-using TrendingUpIcon for TrendingUp
} from '@mui/icons-material';
import { FloatingNotificationIcon } from '@/components/notifications/FloatingNotificationIcon';
import { FloatingMessengerIcon } from '@/components/messaging/FloatingMessengerIcon';
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
import Image from 'next/image';
import {
  MuiEnhancedNavigation
} from '@/components/ui/mui-components';
import { MinimalCollaborationPanel } from '@/components/collaboration/MinimalCollaborationPanel';
import { CommandPalette, useCommandPalette } from '@/components/ui/command-palette';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { MinimalThemeToggle } from '@/components/ui/MinimalThemeToggle';
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
  const { open, openCommandPalette, closeCommandPalette } = useCommandPalette();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch('/api/announcements', {
          credentials: 'include'
        });
        if (!res.ok) {
          if (res.status === 401) {
            console.warn('User not authenticated, skipping announcements fetch');
            return;
          }
          return;
        }
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
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/dashboard/content', label: 'Content', icon: DescriptionIcon },
    { href: '/dashboard/media', label: 'Media Library', icon: ImageIcon },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChartIcon },
    { href: '/tools', label: 'Free Tools', icon: BuildIcon },
    { href: '/tools/social-media-calculator', label: 'ROI Calculator', icon: CalculateIcon },
    { href: '/tools/hashtag-research', label: 'Hashtag Research', icon: TagIcon },
    { href: '/tools/calendar-templates', label: 'Calendar Templates', icon: CalendarMonthIcon },
    { href: '/tools/social-media-audit', label: 'Social Media Audit', icon: BarChartIcon },
    { href: '/tools/posting-time-optimizer', label: 'Time Optimizer', icon: AccessTimeIcon },
    { href: '/tools/content-predictor', label: 'Content Predictor', icon: TrendingUpIcon },
    { href: '/dashboard/phase2-hub', label: 'Phase 2 Hub', icon: PsychologyIcon },
    { href: '/dashboard/phase3-hub', label: 'Phase 3 Hub', icon: SmartToyIcon },
    { href: '/dashboard/ai-api-test', label: 'AI API Test', icon: ScienceIcon },
    { href: '/dashboard/phase5-test', label: 'Phase 5 Test', icon: StarIcon },
    { href: '/dashboard/phase4-test', label: 'Phase 4 Test', icon: BarChart3Icon },
    { href: '/dashboard/phase6-test', label: 'Phase 6 Test', icon: BoltIcon },
    { href: '/dashboard/phase7-test', label: 'Phase 7 Test', icon: SettingsIcon },
    { href: '/dashboard/content-builder', label: 'Content Builder', icon: DashboardIcon },
    { href: '/dashboard/accounts', label: 'Accounts', icon: GroupIcon },
    { href: '/dashboard/scheduling', label: 'Scheduling', icon: EventIcon },
    { href: '/dashboard/ai-tools', label: 'AI Tools', icon: PsychologyIcon },
    { href: '/dashboard/collabs', label: 'Collabs', icon: HandshakeIcon },
    { href: '/dashboard/team', label: 'Team', icon: BusinessIcon },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCardIcon },
    { href: '/dashboard/mobile', label: 'Mobile', icon: SmartphoneIcon },
    { href: '/dashboard/integrations', label: 'Integrations', icon: ShareIcon },
    { href: '/dashboard/api', label: 'API', icon: CodeIcon },
    { href: '/dashboard/testing', label: 'Testing', icon: ScienceIcon },
            { href: '/dashboard/accessibility-testing', label: 'Accessibility', icon: AccessibilityIcon },
        { href: '/saca-demo', label: 'SACA Demo', icon: AccessibilityIcon },
        { href: '/dashboard/enterprise', label: 'Enterprise', icon: BusinessIcon },
        { href: '/dashboard/api-management', label: 'API Management', icon: CodeIcon },
        { href: '/dashboard/advanced-integrations', label: 'Advanced', icon: AutoAwesomeIcon },
        { href: '/dashboard/security/account', label: 'Account Security', icon: SecurityIcon },
    { href: '/dashboard/security/api', label: 'API Security', icon: CodeIcon },
    { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
    { href: '/dashboard/support', label: 'Support', icon: HelpIcon },
    { href: '/dashboard/messaging', label: 'Messages', icon: MessageIcon },
    { href: '/dashboard/notifications/enhanced', label: 'Notifications', icon: NotificationsIcon },
    { href: '/dashboard/admin', label: 'Admin Panel', icon: SecurityIcon },
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
              <Image
                src="/logo-light.png"
                alt="floai.studio logo"
                width={82} /* Set initial width for Next/Image optimization */
                height={82}
                style={{ height: '82px', width: 'auto', borderRadius: '4px' }}
              />
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 4 }}
              role="navigation"
              aria-label="Main navigation"
            >
              {navigationItems.slice(0, 8).map((item) => {
                const IconComponent = item.icon;
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
                  const IconComponent = item.icon;
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
                      <IconComponent sx={{ fontSize: 20 }} />
                    </IconButton>
                  );
                })}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* MuiUserMenu */}
                <MinimalThemeToggle />
              </Box>
            </Box>

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              {/* Theme Toggle */}
              <Box sx={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MinimalThemeToggle />
              </Box>
              
              {/* Messenger Icon - Only render on client */}
              {isClient && (
                <Box sx={{ position: 'relative', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FloatingMessengerIcon
                    unreadCount={3}
                    href="/dashboard/messaging"
                    size="medium"
                    variant="creative"
                  />
                </Box>
              )}

              {/* Notification Icon - Only render on client */}
              {isClient && (
                <Box sx={{ position: 'relative', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FloatingNotificationIcon
                    unreadCount={unreadCount}
                    href="/dashboard/notifications/enhanced"
                    size="medium"
                    variant="creative"
                  />
                </Box>
              )}
              
              {/* Command Palette Button */}
              <IconButton
                onClick={openCommandPalette}
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  bgcolor: 'action.hover',
                  '&:hover': { bgcolor: 'action.selected' }
                }}
                title="Open Command Palette (⌘K)"
              >
                <BarChart3Icon sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Collaboration Panel - Only render on client */}
              {isClient && (
                <Box sx={{ position: 'relative', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MinimalCollaborationPanel />
                </Box>
              )}
              
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pb: { xs: 10, sm: 6 } }}>
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>

      {/* Command Palette */}
      <CommandPalette
        open={open}
        onClose={closeCommandPalette}
      />
    </MobileLayout>
  );
}