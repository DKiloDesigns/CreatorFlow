'use client'; // This component will need client-side logic for fetching user state and handling clicks

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SiInstagram, SiTiktok, SiYoutube, SiX } from "react-icons/si"; // Platform icons
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
      console.log("Upgrade button clicked");
      // TODO: Redirect to billing/upgrade page
      toast.info("Redirecting to upgrade page... (Not Implemented)");
  };

  if (isLoading) {
    return (
        <Card>
          <CardHeader><CardTitle>Connect New Account</CardTitle></CardHeader>
          <CardContent>
             {/* Add Skeleton loaders for buttons */} 
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-10 w-full bg-muted animate-pulse rounded-md" />)}
             </div>
          </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect New Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {limitReached && (
          <Alert variant="destructive" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <AlertTitle>Free Tier Limit Reached!</AlertTitle>
                <AlertDescription>
                Upgrade to Pro to connect more than {FREE_TIER_LIMIT} accounts.
                </AlertDescription>
            </div>
            <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
          </Alert>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map((platform) => (
            <Button
              key={platform.id}
              variant="outline"
              disabled={isLoading || limitReached || isConnecting === platform.id}
              onClick={() => handleConnect(platform.id)}
              className="w-full justify-center sm:justify-start"
            >
              <platform.icon className="mr-2 h-5 w-5" />
              Connect {platform.name}
              {isConnecting === platform.id && <span className="ml-2 animate-spin">...</span>} 
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 