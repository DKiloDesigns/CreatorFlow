import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { RealTimeNotificationProvider } from "@/components/notifications/real-time-provider";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { CriticalCSS } from "@/components/CriticalCSS";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorFlow",
  description: "Social media management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <CriticalCSS />
      </head>
      <body className={inter.className}>
        <Providers>
          <RealTimeNotificationProvider>
            {children}
            <PerformanceMonitor />
            <ServiceWorkerRegistration />
          </RealTimeNotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
