'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ConnectedAccountCard from './connected-account-card';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { toast } from "sonner";

// Define the shape of the account data expected from the API
interface ConnectedAccount {
  id: string;
  platform: string;
  username: string;
  status: string;
  createdAt: Date;
}

export default function ConnectedAccountList() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error("Error loading accounts", { description: errorMessage });
      console.error(err);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, [fetchAccounts]);

  const handleDisconnect = async (accountId: string) => {
    setDisconnectingId(accountId);
    setError(null);
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to disconnect account');
      }
      await fetchAccounts();
      toast.success("Account disconnected successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect';
      toast.error("Disconnect failed", { description: errorMessage });
      console.error(err);
    } finally {
      setDisconnectingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (error && accounts.length === 0) {
    return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Loading Accounts</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (accounts.length === 0) {
    return (
       <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Accounts Connected</AlertTitle>
        <AlertDescription>Connect your first social media account using the buttons above.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <ConnectedAccountCard 
          key={account.id} 
          account={account} 
          onDisconnect={handleDisconnect}
          isDisconnecting={disconnectingId === account.id}
        />
      ))}
    </div>
  );
} 