"use client";

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu } from 'lucide-react';
import { useState } from 'react';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                  CreatorFlow
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:ml-8">
                <EnhancedNavigation />
              </div>
            </div>

            {/* Right side - User menu and mobile nav */}
            <div className="flex items-center gap-4">
              {/* Desktop User Menu */}
              <div className="hidden lg:block">
                <UserMenu />
              </div>
              
              {/* Mobile Navigation Toggle */}
              <div className="lg:hidden">
                <EnhancedNavigation />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs />
        <div id="dashboard-main-content">
          {children}
        </div>
      </main>
    </div>
  )
} 