import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorFlow - Social Media Management for Content Creators",
  description: "The ultimate social media management platform for content creators. Schedule posts, analyze performance, and grow your audience across all platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-primary text-white px-4 py-2 rounded z-50">Skip to main content</a>
        {/* Top Navigation */}
        <nav className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-xl font-bold text-primary">CreatorFlow</Link>
              <Link href="/#features" className="text-sm font-medium hover:underline">Features</Link>
              <Link href="/#plans" className="text-sm font-medium hover:underline">Plans</Link>
              <Link href="/contact" className="text-sm font-medium hover:underline">Contact</Link>
            </div>
            <Link href="/signin" className="text-sm font-medium hover:underline">Login</Link>
          </div>
        </nav>
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
