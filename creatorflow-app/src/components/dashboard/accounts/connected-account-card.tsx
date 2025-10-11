'use client';

import React from 'react';
import { 
  Button,
  Typography,
  Box
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { SiInstagram, SiTiktok, SiYoutube, SiX } from "react-icons/si";
import { Card, CardContent, CardHeader, CardFooter, CardDescription } from '@/components/ui/mui-components';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

// Define the shape of the account data we expect
interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  status: string;
  createdAt: Date;
}

interface ConnectedAccountCardProps {
  account: ConnectedAccount;
  onDisconnect: (accountId: string) => Promise<void>; // Function to call when disconnect is confirmed
  isDisconnecting: boolean;
}

// Map platform IDs to icons
const platformIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  twitter: SiX,
};

export default function ConnectedAccountCard({ account, onDisconnect, isDisconnecting }: ConnectedAccountCardProps) {

  const handleDisconnectConfirm = async () => {
    console.log(`Disconnecting account ${account.id}...`);
    try {
      await onDisconnect(account.id);
      // Optional: Show success toast here (parent component might handle refetching)
    } catch (error) {
      console.error("Failed to disconnect account:", error);
      // Optional: Show error toast here
    }
  };

  const PlatformIcon = platformIcons[account.platform.toLowerCase()] || null;

  return (
    <Card>
      <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {PlatformIcon ? (
            <PlatformIcon className="w-6 h-6 text-gray-500" />
          ) : (
            <Box sx={{ width: 24, height: 24, bgcolor: 'action.hover', borderRadius: 0.5 }} /> // Fallback if no icon
          )}
          <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 500 }}>{account.username}</Typography>
        </Box>
        {/* Maybe add a status indicator here based on account.status */}
      </CardHeader>
      <CardContent>
        <CardDescription>
          Platform: {account.platform} <br />
          Connected: {new Date(account.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardContent>
      <CardFooter>
         <AlertDialog>
          <Button variant="contained" color="error" size="small" disabled={isDisconnecting} onClick={() => {/* Handle disconnect */}}>
            <DeleteIcon sx={{ marginRight: 8, width: 16, height: 16 }} />
            Disconnect
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Disconnecting this account will remove its access tokens. You will need to reconnect it later to resume scheduling posts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDisconnecting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDisconnectConfirm} disabled={isDisconnecting}>
                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
} 