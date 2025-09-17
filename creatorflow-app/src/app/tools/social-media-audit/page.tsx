/**
 * Social Media Audit Tool Page
 * Free tool for comprehensive social media strategy analysis
 */

import React from 'react';
import { Metadata } from 'next';
import SocialMediaAuditTool from '@/components/tools/social-media-audit-tool';

export const metadata: Metadata = {
  title: 'Social Media Audit Tool - CreatorFlow',
  description: 'Get a comprehensive analysis of your social media strategy with personalized recommendations and action plans',
  keywords: 'social media audit, strategy analysis, social media assessment, content audit',
};

export default function SocialMediaAuditPage() {
  return <SocialMediaAuditTool />;
}
