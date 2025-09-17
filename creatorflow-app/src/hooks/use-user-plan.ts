'use client';

import { useSession } from 'next-auth/react';
import { UserPlan } from '@/lib/plan-validation';
import { useMemo } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  plan?: UserPlan;
  image?: string;
}

export function useUserPlan() {
  const { data: session, status } = useSession();
  
  const userPlan: UserPlan = useMemo(() => {
    if (status === 'loading') return 'Free';
    if (!session?.user) return 'Free';
    
    // Extract plan from user data
    const user = session.user as User;
    return user.plan || 'Free';
  }, [session, status]);

  const isProUser = useMemo(() => {
    return userPlan === 'Pro' || userPlan === 'Enterprise';
  }, [userPlan]);

  const isCreatorUser = useMemo(() => {
    return userPlan === 'Creator' || userPlan === 'Pro' || userPlan === 'Enterprise';
  }, [userPlan]);

  const isFreeUser = useMemo(() => {
    return userPlan === 'Free';
  }, [userPlan]);

  return {
    userPlan,
    isProUser,
    isCreatorUser,
    isFreeUser,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };
}
