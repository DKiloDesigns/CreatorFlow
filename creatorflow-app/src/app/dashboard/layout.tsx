"use client";

import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { BarChart2, Users, FileText, Handshake, CreditCard, Menu } from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                  CreatorFlow
                </Link>
              </div>
              {/* Mobile Hamburger */}
              <button className="sm:hidden ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation menu">
                <Menu className="h-6 w-6" />
              </button>
              {/* Navigation Links (Desktop) */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard/content"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/dashboard/content') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <FileText className="h-4 w-4 mr-1" /> Content
                </Link>
                <Link
                  href="/dashboard/accounts"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/dashboard/accounts') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <Users className="h-4 w-4 mr-1" /> Accounts
                </Link>
                <Link
                  href="/dashboard/analytics"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/dashboard/analytics') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <BarChart2 className="h-4 w-4 mr-1" /> Analytics
                </Link>
                <Link
                  href="/dashboard/collabs"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/dashboard/collabs') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <Handshake className="h-4 w-4 mr-1" /> Brand Collabs
                </Link>
                <Link
                  href="/dashboard/billing"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/dashboard/billing') ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                >
                  <CreditCard className="h-4 w-4 mr-1" /> Billing
                </Link>
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="flex items-center">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
            <button className="self-end mb-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation menu">✕</button>
            <Link href="/dashboard/content" className="mb-4 text-lg font-medium flex items-center gap-2" onClick={() => setMobileNavOpen(false)}><FileText className="h-5 w-5" /> Content</Link>
            <Link href="/dashboard/accounts" className="mb-4 text-lg font-medium flex items-center gap-2" onClick={() => setMobileNavOpen(false)}><Users className="h-5 w-5" /> Accounts</Link>
            <Link href="/dashboard/analytics" className="mb-4 text-lg font-medium flex items-center gap-2" onClick={() => setMobileNavOpen(false)}><BarChart2 className="h-5 w-5" /> Analytics</Link>
            <Link href="/dashboard/collabs" className="mb-4 text-lg font-medium flex items-center gap-2" onClick={() => setMobileNavOpen(false)}><Handshake className="h-5 w-5" /> Brand Collabs</Link>
            <Link href="/dashboard/billing" className="mb-4 text-lg font-medium flex items-center gap-2" onClick={() => setMobileNavOpen(false)}><CreditCard className="h-5 w-5" /> Billing</Link>
            <button onClick={() => { setMobileNavOpen(false); signOut({ callbackUrl: "/" }) }} className="mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Sign Out</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <a href="#dashboard-main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-primary text-white px-4 py-2 rounded z-50">Skip to main content</a>
        {children}
      </main>
    </div>
  )
} 