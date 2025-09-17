/**
 * Hashtag Research Tool Page
 * Free tool for hashtag suggestions and trending analysis
 */

import React from 'react';
import { Metadata } from 'next';
import HashtagResearchTool from '@/components/tools/hashtag-research-tool';

export const metadata: Metadata = {
  title: 'Hashtag Research Tool - CreatorFlow',
  description: 'Discover trending hashtags and optimize your content reach with AI-powered hashtag suggestions',
  keywords: 'hashtag research, trending hashtags, hashtag suggestions, social media optimization',
};

export default function HashtagResearchPage() {
  return <HashtagResearchTool />;
}
