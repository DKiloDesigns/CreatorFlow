'use client';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { AppThemeProvider } from "@/components/providers/mui-theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 