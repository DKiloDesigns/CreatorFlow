'use client';

import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
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
    return <div className="p-8">Loading...</div>;
  }
  
  if (!session) {
    return <div className="p-8">Please sign in to view your profile.</div>;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="grid gap-6">
        {profileSections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
            <div className="grid gap-3">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <div>
        <Button variant="outline" className="w-full bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700" asChild>
          <Link href="/api/auth/signout">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </Button>
      </div>
    </div>
  );
} 