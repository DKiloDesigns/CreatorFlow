/**
 * Testing Dashboard Page
 * Main page for platform testing and validation
 */

import React from 'react';
import { Metadata } from 'next';
import TestingDashboard from '@/components/testing/testing-dashboard';

export const metadata: Metadata = {
  title: 'Platform Testing - CreatorFlow',
  description: 'Test and validate CreatorFlow platform integrations',
};

export default function TestingPage() {
  return <TestingDashboard />;
}
