import useSWR from 'swr';
import { useState } from 'react';

export function useUserSettings() {
  const { data, error, isLoading, mutate } = useSWR('/api/settings', async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch user settings');
    return res.json();
  });

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function updateSettings(updates: any) {
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user settings');
      await mutate();
    } catch (err: any) {
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  }

  return {
    settings: data,
    isLoading,
    error,
    updating,
    updateError,
    updateSettings,
    mutate,
  };
} 