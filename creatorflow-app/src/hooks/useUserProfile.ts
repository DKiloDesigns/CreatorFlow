import useSWR from 'swr';
import { useState } from 'react';

export function useUserProfile() {
  const { data, error, isLoading, mutate } = useSWR('/api/user', async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      // Don't throw error for 401 (unauthorized) - this is expected when not logged in
      if (res.status === 401) {
        return null;
      }
      throw new Error('Failed to fetch user profile');
    }
    return res.json();
  }, {
    // Don't retry on 401 errors
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return;
      }
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 5000);
    }
  });

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  async function updateUser(updates: { name?: string; image?: string; bio?: string }) {
    setUpdating(true);
    setUpdateError(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update user profile');
      await mutate();
    } catch (err: any) {
      setUpdateError(err.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  }

  return {
    user: data,
    isLoading,
    error,
    updating,
    updateError,
    updateUser,
    mutate,
  };
} 