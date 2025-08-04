"use client";

export const dynamic = 'force-dynamic';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu, Bell, BarChart3, Target, MessageSquare, CalendarIcon, Activity, Shield, Settings, Sparkles, Building2, Smartphone, Plug, TestTube, Home, Calendar, Brain, HelpCircle, HardDrive } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
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

  return (
    <MobileLayout>
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="font-bold text-xl text-black dark:text-black">CreatorFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center ${
                  pathname === '/dashboard' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/analytics" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center ${
                  pathname === '/dashboard/analytics' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Analytics
              </Link>
              <Link 
                href="/dashboard/content" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center ${
                  pathname === '/dashboard/content' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Content
              </Link>
              <Link 
                href="/dashboard/notifications/enhanced" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] flex items-center ${
                  pathname === '/dashboard/notifications/enhanced' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Notifications
              </Link>
            </div>

            {/* Tablet Navigation */}
            <div className="hidden md:flex lg:hidden items-center justify-between w-full px-4 py-2 bg-background border-b">
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-foreground hover:text-foreground/80">
                  <Home className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/content" className="text-foreground hover:text-foreground/80">
                  <FileText className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/analytics" className="text-foreground hover:text-foreground/80">
                  <BarChart3 className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/accounts" className="text-foreground hover:text-foreground/80">
                  <Users className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/scheduling" className="text-foreground hover:text-foreground/80">
                  <Calendar className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/ai-tools" className="text-foreground hover:text-foreground/80">
                  <Brain className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/settings" className="text-foreground hover:text-foreground/80">
                  <Settings className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/billing" className="text-foreground hover:text-foreground/80">
                  <CreditCard className="h-5 w-5" />
                </Link>
                <Link href="/dashboard/support" className="text-foreground hover:text-foreground/80">
                  <HelpCircle className="h-5 w-5" />
                </Link>
                <Link href="/admin/campaign" className="text-foreground hover:text-foreground/80">
                  <Target className="h-5 w-5" />
                </Link>
                <Link href="/admin/feedback" className="text-foreground hover:text-foreground/80">
                  <MessageSquare className="h-5 w-5" />
                </Link>
                <Link href="/admin/performance" className="text-foreground hover:text-foreground/80">
                  <HardDrive className="h-5 w-5" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <UserMenu />
                <NotificationCenter />
                <ThemeToggle />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
                <ThemeToggle isLandingPage={false} />
              </div>
              
              {/* Notification Center - Only render on client */}
              {isClient && (
                <div className="relative min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <NotificationCenter />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Desktop User Menu - Only render on client */}
              {isClient && (
                <div className="hidden lg:block">
                  <UserMenu />
                </div>
              )}
              
              {/* Tablet User Menu - Only render on client */}
              {isClient && (
                <div className="hidden md:block lg:hidden">
                  <UserMenu />
                </div>
              )}
              
              {/* Mobile Navigation Toggle - REMOVED for bottom nav */}
              {/* <div className="lg:hidden">
                <EnhancedNavigation />
              </div> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        
        <Breadcrumbs />
        {/* Admin Navigation */}
        {session?.user?.email === 'renee@creatorflow.com' && (
          <div className="border-b pb-4 mb-4">
            <h3 className="text-sm font-medium mb-2">Admin Tools</h3>
            <div className="flex gap-2">
              <Link 
                href="/admin/analytics" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link 
                href="/admin/campaign" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Target className="h-4 w-4" />
                Campaign
              </Link>
              <Link 
                href="/admin/feedback" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <MessageSquare className="h-4 w-4" />
                Feedback
              </Link>
              <Link 
                href="/scheduling" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <CalendarIcon className="h-4 w-4" />
                Scheduling
              </Link>
              <Link 
                href="/admin/performance" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Activity className="h-4 w-4" />
                Performance
              </Link>
              <Link 
                href="/analytics" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              <Link 
                href="/security" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Shield className="h-4 w-4" />
                Security
              </Link>
              <Link 
                href="/integrations" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                Integrations
              </Link>
              <Link 
                href="/ai" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Sparkles className="h-4 w-4" />
                AI Features
              </Link>
              <Link 
                href="/settings" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
              <Link 
                href="/enterprise" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Building2 className="h-4 w-4" />
                Enterprise
              </Link>
              <Link 
                href="/mobile" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </Link>
              <Link 
                href="/advanced-integrations" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <Plug className="h-4 w-4" />
                Advanced Integrations
              </Link>
              <Link 
                href="/testing" 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
              >
                <TestTube className="h-4 w-4" />
                Testing
              </Link>
            </div>
          </div>
        )}
        <div id="dashboard-main-content">
          {children}
        </div>
      </main>
    </MobileLayout>
  )
} 