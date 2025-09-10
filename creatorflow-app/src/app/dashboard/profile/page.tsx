'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Users, 
  Users2, 
  Settings, 
  Shield, 
  Bell, 
  LifeBuoy,
  LogOut,
  User,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { ExpandMore } from '@/lib/mui-optimized-imports';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) {
        setIsAdmin(false);
        return;
      }

      try {
        const response = await fetch('/api/admin/users');
        if (response.status === 403) {
          setIsAdmin(false);
        } else if (response.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session]);
  
  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  
  if (!session) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>Please sign in to view your profile.</Typography>
      </Box>
    );
  }

  const profileSections = [
    {
      title: 'Account Management',
      items: [
        { href: '/dashboard/accounts', label: 'Social Accounts', icon: Users, description: 'Manage connected platforms' },
        { href: '/dashboard/teams', label: 'Teams', icon: Users2, description: 'Collaborate with team members' },
      ]
    },
    {
      title: 'Billing & Subscription',
      items: [
        { href: '/dashboard/billing', label: 'Manage Billing', icon: CreditCard, description: 'View plans, payment history, and manage subscription' },
      ]
    },
    {
      title: 'Settings & Security',
      items: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, description: 'App preferences and configuration' },
        { href: '/dashboard/security', label: 'Security', icon: Shield, description: 'Password and account security' },
        { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
        { href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldCheck, description: 'System administration and monitoring', adminOnly: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { href: '/dashboard/support', label: 'Help & Support', icon: LifeBuoy, description: 'Get help and contact support' },
      ]
    }
  ];

  return (
    <Box sx={{ 
      pb: { xs: 20, sm: 8 } // 80px on mobile, 32px on desktop for consistent bottom spacing
    }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Profile & Settings
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Manage your account and preferences
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                <User style={{ width: 20, height: 20 }} />
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {session.user?.name || 'User'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {session.user?.email}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Profile Sections - Now Collapsible */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
            {profileSections.map((section, index) => (
              <Accordion key={section.title} defaultExpanded={index === 0}>
                <AccordionSummary
                  expandIcon={<ExpandMore style={{ width: 20, height: 20 }} />}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {section.items
                      .filter(item => !item.adminOnly || isAdmin)
                      .map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.href}
                            component={Link}
                            href={item.href}
                            variant="text"
                            fullWidth
                            sx={{ 
                              justifyContent: 'flex-start', 
                              textAlign: 'left',
                              p: 2,
                              borderRadius: 1,
                              '&:hover': {
                                bgcolor: 'action.hover'
                              }
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 2, 
                              width: '100%' 
                            }}>
                              <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: 1, 
                                bgcolor: item.adminOnly ? 'error.main' : 'primary.main', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}>
                                <Icon style={{ width: 20, height: 20, color: 'white' }} />
                              </Box>
                              <Box sx={{ flex: 1, textAlign: 'left' }}>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {item.label}
                                  {item.adminOnly && (
                                    <Typography component="span" variant="caption" sx={{ 
                                      ml: 1, 
                                      px: 1, 
                                      py: 0.5, 
                                      bgcolor: 'error.light', 
                                      color: 'error.contrastText',
                                      borderRadius: 0.5,
                                      fontSize: '0.7rem'
                                    }}>
                                      ADMIN
                                    </Typography>
                                  )}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {item.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Button>
                        );
                      })}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Sign Out */}
          <Box sx={{ mb: 4 }}>
            <Card>
              <CardContent>
                <Button
                  component={Link}
                  href="/api/auth/signout"
                  variant="contained"
                  fullWidth
                  startIcon={<LogOut style={{ width: 16, height: 16 }} />}
                  sx={{ 
                    bgcolor: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.dark'
                    }
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Massive Spacer to Clear Bottom Navigation */}
          <Box sx={{ 
            height: { xs: '120px', sm: '40px' }, // 120px on mobile, 40px on desktop
            width: '100%'
          }} />
        </Box>
      </Container>
    </Box>
  );
} 