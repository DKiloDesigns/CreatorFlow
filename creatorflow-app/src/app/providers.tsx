'use client';
import { SessionProvider } from "next-auth/react";
import { MinimalThemeProvider } from "@/contexts/MinimalThemeContext";
import { MinimalCollaborationProvider } from "@/contexts/MinimalCollaborationContext";
import { SmartNotificationProvider } from "@/contexts/SmartNotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MinimalThemeProvider>
        <MinimalCollaborationProvider>
          <SmartNotificationProvider>
            {children}
          </SmartNotificationProvider>
        </MinimalCollaborationProvider>
      </MinimalThemeProvider>
    </SessionProvider>
  );
} 