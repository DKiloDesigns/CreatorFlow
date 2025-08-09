'use client';

import React, { useState } from 'react';
import { 
  Button,
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { CheckCircle, Activity, Trash2 } from 'lucide-react';
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-3">
          {PlatformIcon ? (
            <PlatformIcon className="h-6 w-6 text-muted-foreground" />
          ) : (
            <div className="w-6 h-6 bg-muted rounded-sm" /> // Fallback if no icon
          )}
          <Typography variant="h6" className="text-lg font-medium">{account.username}</Typography>
        </div>
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
          <AlertDialogTrigger asChild>
             <Button variant="contained" color="error" size="small" disabled={isDisconnecting}>
              <Trash2 className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </AlertDialogTrigger>
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