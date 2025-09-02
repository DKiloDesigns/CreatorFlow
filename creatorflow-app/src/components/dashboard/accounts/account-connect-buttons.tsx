'use client'; // This component will need client-side logic for fetching user state and handling clicks

import React, { useState, useEffect } from 'react';
import { 
  Button,
  Card, 
  CardContent, 
  CardHeader, 
  Typography,
  Box
} from '@mui/material';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SiInstagram, SiTiktok, SiYoutube, SiX, SiLinkedin } from "react-icons/si"; // Platform icons
import { toast } from "sonner";

// Define user state structure
interface UserAccountState {
  plan: 'FREE' | 'PRO';
  connectedCount: number;
}

// --- Mock API call --- 
// In a real app, this might fetch session data or use a state management hook
async function fetchUserAccountState(): Promise<UserAccountState> {
  console.log("Fetching user account state (mocked)...");
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500)); 
  // Replace with actual API call
  return { plan: 'FREE', connectedCount: 1 }; // Example: User is FREE, has 1 account
}
// --- End Mock API --- 

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: SiInstagram }, 
  { id: 'tiktok', name: 'TikTok', icon: SiTiktok },
  { id: 'youtube', name: 'YouTube', icon: SiYoutube },
  { id: 'twitter', name: 'Twitter / X', icon: SiX },
  { id: 'linkedin', name: 'LinkedIn', icon: SiLinkedin },
];

const FREE_TIER_LIMIT = 2;

export default function AccountConnectButtons() {
  const [userState, setUserState] = useState<UserAccountState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState<string | null>(null); // Track which platform is connecting

  useEffect(() => {
    const loadState = async () => {
      setIsLoading(true);
      try {
        const state = await fetchUserAccountState();
        setUserState(state);
      } catch (error) {
        console.error("Failed to fetch user state:", error);
        toast.error("Could not load your account details.");
      } finally {
        setIsLoading(false);
      }
    };
    loadState();
  }, []);

  const plan = userState?.plan ?? 'FREE';
  const connectedCount = userState?.connectedCount ?? 0;
  const isFreeTier = plan === 'FREE';
  const limitReached = isFreeTier && connectedCount >= FREE_TIER_LIMIT;

  const handleConnect = async (platformId: string) => {
    console.log(`Initiating connect for ${platformId}...`);
    setIsConnecting(platformId);
    try {
      // Call the backend API route to initiate OAuth
      const response = await fetch(`/api/accounts/connect/${platformId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initiate connection');
      }

      const data = await response.json();
      // The backend should ideally return the redirect URL
      if (data.url) {
        // Redirect the user to the platform's OAuth page
        window.location.href = data.url; 
      } else {
         throw new Error('No redirect URL received from server.');
      }
      // Note: No need to setIsConnecting(null) here as the page will redirect

    } catch (error) {
      console.error(`Connection initiation failed for ${platformId}:`, error);
      toast.error(`Failed to connect ${platformId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnecting(null); // Stop loading indicator on error
    }
  };

  const handleUpgrade = () => {
      // Redirect to billing/upgrade page
      window.location.href = '/dashboard/billing';
  };

  if (isLoading) {
    return (
        <Card>
          <CardHeader><Typography variant="h6">Connect New Account</Typography></CardHeader>
          <CardContent>
             {/* Add Skeleton loaders for buttons */} 
             <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                {[...Array(4)].map((_, i) => <Box key={i} sx={{ height: 40, width: '100%', bgcolor: 'action.hover', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', borderRadius: 1 }} />)}
             </Box>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <Typography variant="h6">Connect New Account</Typography>
      </CardHeader>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {limitReached && (
          <Alert variant="error" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
                <AlertTitle>Free Tier Limit Reached!</AlertTitle>
                <AlertDescription>
                Upgrade to Pro to connect more than {FREE_TIER_LIMIT} accounts.
                </AlertDescription>
            </Box>
            <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
          </Alert>
        )}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
          {PLATFORMS.map((platform) => (
            <Button
              key={platform.id}
              variant="outlined"
              disabled={isLoading || limitReached || isConnecting === platform.id}
              onClick={() => handleConnect(platform.id)}
              sx={{ width: '100%', justifyContent: { xs: 'center', sm: 'flex-start' } }}
            >
              <platform.icon style={{ marginRight: 8, width: 20, height: 20 }} />
              Connect {platform.name}
              {isConnecting === platform.id && <Box component="span" sx={{ ml: 1, animation: 'spin 1s linear infinite' }}>...</Box>} 
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
} 