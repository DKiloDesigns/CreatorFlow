import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { RealTimeNotificationProvider } from "@/components/notifications/real-time-provider";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { CriticalCSS } from "@/components/CriticalCSS";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import { 
  ARIALiveRegionProvider, 
  MotionReductionProvider, 
  ColorContrastProvider 
} from "@/components/accessibility";

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
        <ErrorBoundary>
          <ARIALiveRegionProvider>
            <MotionReductionProvider>
              <ColorContrastProvider>
                <Providers>
                  <RealTimeNotificationProvider>
                    {children}
                    <ServiceWorkerRegistration />
                  </RealTimeNotificationProvider>
                </Providers>
              </ColorContrastProvider>
            </MotionReductionProvider>
          </ARIALiveRegionProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
