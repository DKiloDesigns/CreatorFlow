/**
 * CreatorFlow Academy Page
 * Main page for the Academy learning platform
 */

import React from 'react';
import { Metadata } from 'next';
import AcademyDashboard from '@/components/academy/academy-dashboard';

export const metadata: Metadata = {
  title: 'CreatorFlow Academy - Learn Social Media Mastery',
  description: 'Master social media with expert-led courses, community-driven learning, and professional certifications.',
  keywords: 'social media courses, online learning, content creation, social media strategy, digital marketing education',
};

export default function AcademyPage() {
  return <AcademyDashboard />;
}
