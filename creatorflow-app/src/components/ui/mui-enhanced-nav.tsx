import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Typography,
  Divider,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  FileText,
  Users,
  Users2,
  BarChart2,
  Handshake,
  Settings,
  LogOut,
  User,
  Bell,
  Home,
  TrendingUp,
  MessageSquare,
  HelpCircle,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/dashboard/content', label: 'Content', icon: FileText },
  { href: '/dashboard/accounts', label: 'Accounts', icon: Users },
  { href: '/dashboard/teams', label: 'Teams', icon: Users2 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/collabs', label: 'Brand Collabs', icon: Handshake },

];

export function MuiEnhancedNavigation() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const theme = useTheme();

  const isActive = (href: string) => {
    return pathname ? pathname.startsWith(href) : false;
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleSignOut = () => {
    signOut();
    handleUserMenuClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          href={item.href}
          selected={active}
          sx={{
            borderRadius: 1,
            mx: 0.5,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: active ? 'primary.contrastText' : 'inherit',
              minWidth: 40,
            }}
          >
            <Icon className="w-4 h-4" />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.875rem',
              fontWeight: active ? 600 : 500,
            }}
          />
          {item.badge && (
                              <Badge badgeContent={item.badge} color="error" />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <>
      {/* Desktop Navigation */}
      <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}>
        <Stack direction="row" spacing={1}>
          {navItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </Stack>
      </Box>

      {/* Mobile Navigation Toggle */}
      <IconButton
        sx={{ display: { xs: 'flex', lg: 'none' } }}
        onClick={() => setMobileNavOpen(true)}
        color="inherit"
        aria-label="Open mobile navigation menu"
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-nav-drawer"
      >
        <MenuIcon style={{ width: 20, height: 20 }} />
      </IconButton>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            backgroundColor: 'background.paper',
          },
        }}
        id="mobile-nav-drawer"
        aria-label="Mobile navigation menu"
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              CreatorFlow
            </Typography>
            <IconButton onClick={() => setMobileNavOpen(false)}>
              <X style={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>
          
          <List>
            {navItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </List>
        </Box>
      </Drawer>

      {/* User Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Notifications */}
        <IconButton
          color="inherit"
          onClick={handleNotificationsOpen}
          sx={{ position: 'relative' }}
          aria-label="Open notifications menu"
          aria-expanded={Boolean(notificationsAnchor)}
          aria-controls="notifications-menu"
        >
          <Badge badgeContent={3} color="error">
            <Bell style={{ width: 20, height: 20 }} />
          </Badge>
        </IconButton>

        {/* User Avatar & Menu */}
        <IconButton
          onClick={handleUserMenuOpen}
          sx={{ p: 0.5 }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            {session?.user?.name ? getInitials(session.user.name) : 'U'}
          </Avatar>
        </IconButton>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {session?.user?.name || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {session?.user?.email}
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <User style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <Settings style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </MenuItem>
          
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon>
              <HelpCircle style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogOut style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleNotificationsClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 300,
            },
          }}
        >
          <Box sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleNotificationsClose}>
            <ListItemIcon>
              <Bell style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText 
              primary="New content scheduled"
              secondary="Your post has been scheduled for tomorrow"
            />
          </MenuItem>
          
          <MenuItem onClick={handleNotificationsClose}>
            <ListItemIcon>
              <TrendingUp style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText 
              primary="Analytics update"
              secondary="Your latest post gained 15% more engagement"
            />
          </MenuItem>
          
          <MenuItem onClick={handleNotificationsClose}>
            <ListItemIcon>
              <MessageSquare style={{ width: 16, height: 16 }} />
            </ListItemIcon>
            <ListItemText 
              primary="New collaboration request"
              secondary="Brand X wants to collaborate with you"
            />
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export function MuiBreadcrumbs() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    const segments = pathname ? pathname.split('/').filter(Boolean) : [];
    const breadcrumbs = [];
    
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`;
      const label = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
      breadcrumbs.push({ label, href: currentPath });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <Chip
                      icon={<Home style={{ width: 16, height: 16 }} />}
          label="Dashboard"
          variant="outlined"
          size="small"
          clickable
        />
      </Link>
      
      {breadcrumbs.map((breadcrumb, _index) => (
        <Box key={breadcrumb.href} sx={{ display: 'flex', alignItems: 'center' }}>
                      <ChevronDown style={{ width: 16, height: 16, transform: 'rotate(-90deg)' }} />
          <Link href={breadcrumb.href} style={{ textDecoration: 'none' }}>
            <Chip
              label={breadcrumb.label}
              variant="outlined"
              size="small"
              clickable
            />
          </Link>
        </Box>
      ))}
    </Box>
  );
} 