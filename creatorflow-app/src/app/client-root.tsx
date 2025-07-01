'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAnnouncementSocket } from '@/hooks/useAnnouncementSocket';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const { user } = useUserProfile();
  const [showBanner, setShowBanner] = useState(true);
  const [impersonatedUser, setImpersonatedUser] = useState<{ name?: string | null; email?: string | null } | null>(null);
  const [bannerAnnouncement, setBannerAnnouncement] = useState<any>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!user?.impersonated) setShowBanner(false);
    // Fetch impersonated user details if impersonated
    if (user?.impersonated && user.id) {
      fetch(`/api/admin/users/${user.id}/details`).then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setImpersonatedUser({ name: data.name, email: data.email });
        }
      });
    }
    async function fetchBanner() {
      try {
        const res = await fetch('/api/announcements');
        if (!res.ok) return;
        const data = await res.json();
        let userId = null;
        if (data.length > 0 && data[0].readBy) {
          const allIds = data.flatMap((a: any) => a.readBy.map((u: any) => u.id));
          if (allIds.length > 0) userId = allIds[0];
        }
        const unread = data.filter((a: any) => !a.readBy.some((u: any) => u.id === userId));
        if (unread.length > 0) setBannerAnnouncement(unread[0]);
      } catch {}
    }
    fetchBanner();
  }, [user]);
  useAnnouncementSocket((announcement) => {
    setToast({ title: announcement.title, body: announcement.body });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 5000);
  });
  async function dismissBanner() {
    if (bannerAnnouncement) {
      await fetch('/api/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bannerAnnouncement.id }),
      });
    }
    setBannerDismissed(true);
  }
  // Use Next.js usePathname hook for SSR-safe route detection
  const pathname = usePathname();
  // Only show nav on landing page
  const showNav = pathname === '/';
  return (
    <>
      {user?.impersonated && showBanner && (
        <div className="bg-yellow-600 text-white text-center py-2 px-4 font-bold z-50 flex items-center justify-center gap-4">
          <span>
            You are viewing as: <b>{impersonatedUser?.name || impersonatedUser?.email || user.id}</b>
            {user.impersonatorId && <span className="ml-2 text-xs">(Impersonator: {user.impersonatorId})</span>}
            <span className="ml-2 text-xs">(Admin Impersonation Mode)</span>
          </span>
          <button className="underline" onClick={async () => {
            await fetch('/api/admin/impersonate/revert', { method: 'POST' });
            window.location.reload();
          }}>Return to admin</button>
          <button className="ml-4 underline" onClick={() => setShowBanner(false)}>Dismiss</button>
        </div>
      )}
      {bannerAnnouncement && !bannerDismissed && (
        <div className="bg-yellow-500 text-white text-center py-2 px-4 font-bold z-50 flex items-center justify-center gap-4">
          <span>{bannerAnnouncement.title}: {bannerAnnouncement.body}</span>
          <button className="ml-4 underline" onClick={dismissBanner}>Dismiss</button>
        </div>
      )}
      {showNav && (
        <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white !bg-white dark:bg-[#18181b] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link href="/" className="text-lg sm:text-xl font-bold text-primary !text-black">CreatorFlow</Link>
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/#features" className="text-sm font-medium hover:underline !text-black">Features</Link>
                <Link href="/#plans" className="text-sm font-medium hover:underline !text-black">Plans</Link>
                <Link href="/contact" className="text-sm font-medium hover:underline !text-black">Contact</Link>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="sm:hidden">
                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <ThemeToggle isLandingPage={true} />
              <Link href="/signin" className="text-sm font-medium hover:underline !text-black">Login</Link>
            </div>
          </div>
        </nav>
      )}
      {children}
      {toast && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded shadow-lg z-[1000] cursor-pointer" onClick={() => setToast(null)}>
          <div className="font-bold">{toast.title}</div>
          <div>{toast.body}</div>
        </div>
      )}
    </>
  );
} 