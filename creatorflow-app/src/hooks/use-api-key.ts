import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useAPIKey() {
  const [hasAPIKey, setHasAPIKey] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    checkAPIKeyStatus();
  }, [session]);

  const checkAPIKeyStatus = async () => {
    if (!session) {
      setHasAPIKey(false);
      setIsChecking(false);
      return;
    }

    try {
      const response = await fetch('/api/ai/check-key');
      const data = await response.json();
      
      setHasAPIKey(data.hasKey);
    } catch (error) {
      console.error('Error checking API key status:', error);
      setHasAPIKey(false);
    } finally {
      setIsChecking(false);
    }
  };

  const setAPIKey = async (apiKey: string) => {
    try {
      const response = await fetch('/api/ai/save-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasAPIKey(true);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error setting API key:', error);
      return { success: false, error: 'Failed to save API key' };
    }
  };

  const removeAPIKey = async () => {
    try {
      const response = await fetch('/api/ai/remove-key', {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setHasAPIKey(false);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error removing API key:', error);
      return { success: false, error: 'Failed to remove API key' };
    }
  };

  return {
    hasAPIKey,
    isChecking,
    setAPIKey,
    removeAPIKey,
    checkAPIKeyStatus,
  };
} 