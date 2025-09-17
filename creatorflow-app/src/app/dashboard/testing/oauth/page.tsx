/**
 * OAuth Testing Page
 * Test OAuth flows for all platforms
 */

import React from 'react';
import { Metadata } from 'next';
import OAuthTestingDashboard from '@/components/testing/oauth-testing-dashboard';

export const metadata: Metadata = {
  title: 'OAuth Testing - CreatorFlow',
  description: 'Test OAuth flows for all 16 social media platforms',
  robots: 'noindex, nofollow'
};

export default function OAuthTestingPage() {
  return <OAuthTestingDashboard />;
}
