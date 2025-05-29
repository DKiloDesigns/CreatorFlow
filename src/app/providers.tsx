"use client"

import * as React from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      // TODO: Replace with your toast library
      // toast("Session expired. Please sign in again.");
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  return <>{children}</>;
} 