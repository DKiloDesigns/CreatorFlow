import { useState } from 'react';

export function useUserSecurity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function changePassword(newPassword: string) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'changePassword', payload: { newPassword } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');
      setSuccess('Password updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }

  async function toggle2FA(enable: boolean) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle2FA', payload: { enable } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update 2FA');
      setSuccess(enable ? '2FA enabled!' : '2FA disabled!');
    } catch (err: any) {
      setError(err.message || 'Failed to update 2FA');
    } finally {
      setLoading(false);
    }
  }

  async function deleteAccount() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteAccount', payload: {} }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      setSuccess('Account deleted!');
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    changePassword,
    toggle2FA,
    deleteAccount,
    setSuccess,
    setError,
  };
} 