import useSWR from 'swr';
import { useState } from 'react';

export function useUserNotifications() {
  const { data, error, isLoading, mutate } = useSWR('/api/notifications', async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  });

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function updatePrefs(prefs: any) {
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefs }),
      });
      if (!res.ok) throw new Error('Failed to update notification preferences');
      await mutate();
    } catch (err: any) {
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  }

  async function markAllRead() {
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (!res.ok) throw new Error('Failed to mark notifications as read');
      await mutate();
    } catch (err: any) {
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  }

  return {
    notifications: data,
    isLoading,
    error,
    updating,
    updateError,
    updatePrefs,
    markAllRead,
    mutate,
  };
} 