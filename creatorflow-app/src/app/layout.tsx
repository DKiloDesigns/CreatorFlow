import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import Link from "next/link";
import { Providers } from "./providers";
import ClientRoot from "./client-root";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorFlow - Social Media Management for Content Creators",
  description: "The ultimate social media management platform for content creators. Schedule posts, analyze performance, and grow your audience across all platforms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-primary text-white px-4 py-2 rounded z-50">Skip to main content</a>
        <Providers>
          <ClientRoot>{children}</ClientRoot>
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
