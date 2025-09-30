'use client';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress } from '@mui/material';

export default function AppAuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
