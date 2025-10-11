import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { RealTimeNotificationProvider } from "@/components/notifications/real-time-provider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { CriticalCSS } from "@/components/CriticalCSS";
import { GlobalErrorBoundary } from '@/components/error/GlobalErrorBoundary';
import { LoadingProvider } from "@/contexts/LoadingContext";
import { AccessibilityEnhancements, AriaLiveRegion } from "@/components/ui/accessibility-enhancements";
import ClientOnlySkipToContentLoader from '@/components/ui/ClientOnlySkipToContentLoader';
import { MobileUXEnhancements } from "@/components/mobile/mobile-ux-enhancements";
import { TouchInteractionsWrapper } from "@/components/mobile/touch-interactions-wrapper";
import { UnifiedMobileControls } from "@/components/mobile/unified-mobile-controls";
import { PWAEnhancements } from "@/components/mobile/pwa-enhancements";
import AppAuthGate from './AppAuthGate';

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
      <body className="MuiTypography-root">
        <ClientOnlySkipToContentLoader />
        <GlobalErrorBoundary enableBuildErrorHandling={true} enableRecovery={true}>
          <LoadingProvider>
            <Providers>
              <AppAuthGate>
                <RealTimeNotificationProvider>
                  <MobileUXEnhancements>
                    <UnifiedMobileControls />
                    <TouchInteractionsWrapper>
                      <PWAEnhancements>
                        <main id="main-content" tabIndex={-1} style={{ paddingBottom: '100px' }}>
                          {children}
                        </main>
                      </PWAEnhancements>
                    </TouchInteractionsWrapper>
                  </MobileUXEnhancements>
                  <ServiceWorkerRegistration />
                  <AccessibilityEnhancements />
                  <AriaLiveRegion />
                </RealTimeNotificationProvider>
              </AppAuthGate>
            </Providers>
          </LoadingProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
