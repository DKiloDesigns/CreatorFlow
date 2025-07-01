import { useState } from 'react';

export function useUserSupport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submitFeedback(message: string) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit feedback');
      setSuccess('Feedback submitted!');
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    success,
    submitFeedback,
    setSuccess,
    setError,
  };
} 