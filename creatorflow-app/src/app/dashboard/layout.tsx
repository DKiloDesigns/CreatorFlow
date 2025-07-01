"use client";

export const dynamic = 'force-dynamic';

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ThemeToggle } from '@/components/theme-toggle';

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
    <div className="min-h-screen bg-background">
      {/* Enhanced Top Navigation Bar */}
      <nav className="bg-card shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-black dark:text-white hover:text-primary transition-colors">
                  CreatorFlow
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:ml-8">
                <EnhancedNavigation />
              </div>
            </div>

            {/* Right side - User menu and mobile nav */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Theme Toggle */}
              <ThemeToggle isLandingPage={false} />
              
              {/* Notification Button - Only render on client */}
              {isClient && (
                <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                  <PopoverTrigger asChild>
                    <button className="relative p-2 hover:bg-muted focus:outline-none" aria-label="Notifications">
                      <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-black dark:text-white" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-80 bg-white dark:bg-gray-800 border-0">
                    <div className="font-semibold mb-2 text-black dark:text-white">Recent Activity</div>
                    <div className="text-sm text-black dark:text-white">(Placeholder) No new notifications.</div>
                  </PopoverContent>
                </Popover>
              )}
              
              {/* Desktop User Menu - Only render on client */}
              {isClient && (
                <div className="hidden lg:block">
                  <UserMenu />
                </div>
              )}
              
              {/* Mobile Navigation Toggle */}
              <div className="lg:hidden">
                <EnhancedNavigation />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div id="dashboard-main-content">
          {children}
        </div>
      </main>
    </div>
  )
} 