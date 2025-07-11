import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { RealTimeNotificationProvider } from "@/components/notifications/real-time-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreatorFlow",
  description: "Streamline your content creation workflow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <RealTimeNotificationProvider>
            {children}
          </RealTimeNotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
