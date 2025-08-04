'use client';
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";
import { MuiThemeProvider } from "@/components/providers/mui-theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <MuiThemeProvider>
          {children}
        </MuiThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
} 