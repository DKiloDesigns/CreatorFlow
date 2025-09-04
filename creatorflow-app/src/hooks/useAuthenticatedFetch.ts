import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

export function useAuthenticatedFetch() {
  const { data: session, status } = useSession();

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    // If user is not authenticated, skip the fetch
    if (status === 'unauthenticated' || !session) {
      console.warn('User not authenticated, skipping fetch to:', url);
      return null;
    }

    // Add credentials to all requests
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include',
    };

    try {
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Authentication failed for:', url);
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error('Fetch error for:', url, error);
      return null;
    }
  }, [session, status]);

  return {
    authenticatedFetch,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}
