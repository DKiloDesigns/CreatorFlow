'use client';

import { useSession } from 'next-auth/react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Grid,
  Container,
  Divider
} from '@mui/material';
import { 
  Brain, 
  Users, 
  Users2, 
  Settings, 
  Shield, 
  Bell, 
  LifeBuoy,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  
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
        { href: '/dashboard/ai-tools', label: 'AI Tools', icon: Brain, description: 'AI-powered content tools' },
        { href: '/dashboard/accounts', label: 'Social Accounts', icon: Users, description: 'Manage connected platforms' },
        { href: '/dashboard/teams', label: 'Teams', icon: Users2, description: 'Collaborate with team members' },
      ]
    },
    {
      title: 'Settings & Security',
      items: [
        { href: '/dashboard/settings', label: 'Settings', icon: Settings, description: 'App preferences and configuration' },
        { href: '/dashboard/security', label: 'Security', icon: Shield, description: 'Password and account security' },
        { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
                {session.user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {session.user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Sections */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {profileSections.map((section) => (
            <Card key={section.title}>
              <CardContent>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {section.items.map((item) => {
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
                            bgcolor: 'primary.main', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            <Icon style={{ width: 20, height: 20, color: 'white' }} />
                          </Box>
                          <Box sx={{ flex: 1, textAlign: 'left' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {item.label}
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
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Sign Out */}
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
    </Container>
  );
} 