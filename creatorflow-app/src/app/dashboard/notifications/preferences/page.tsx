/**
 * Notification Preferences Page
 * Advanced notification settings and preferences
 */

import React from 'react';
import { Metadata } from 'next';
import NotificationPreferences from '@/components/notifications/notification-preferences';

export const metadata: Metadata = {
  title: 'Notification Preferences - CreatorFlow',
  description: 'Customize how and when you receive notifications from CreatorFlow.',
  keywords: 'notifications, preferences, settings, alerts, email, push, SMS',
};

export default function NotificationPreferencesPage() {
  return <NotificationPreferences />;
}
