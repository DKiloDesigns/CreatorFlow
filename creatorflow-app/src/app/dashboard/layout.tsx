"use client";

export const dynamic = 'force-dynamic';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
import { NotificationCenter } from '@/components/notifications/notification-center';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileLayout } from '@/components/layout/mobile-layout';
import { useRealTimeNotifications } from '@/components/notifications/real-time-provider';

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
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 min-w-[44px] min-h-[44px]">
                {/* Removed CF logo gradient square */}
                <span className="font-bold text-xl text-gray-900 dark:text-white break-words">CreatorFlow</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] ${
                  pathname === '/dashboard' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard/analytics" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] ${
                  pathname === '/dashboard/analytics' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Analytics
              </Link>
              <Link 
                href="/dashboard/content" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] ${
                  pathname === '/dashboard/content' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Content
              </Link>
              <Link 
                href="/dashboard/notifications/enhanced" 
                className={`text-sm font-medium transition-colors min-w-[44px] min-h-[44px] ${
                  pathname === '/dashboard/notifications/enhanced' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                Notifications
              </Link>
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
        <div id="dashboard-main-content">
          {children}
        </div>
      </main>
    </MobileLayout>
  )
} 