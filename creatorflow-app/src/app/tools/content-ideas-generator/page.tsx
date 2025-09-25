import React from 'react';
import { Metadata } from 'next';
import ContentIdeasGenerator from '@/components/tools/content-ideas-generator';

export const metadata: Metadata = {
  title: 'Content Ideas Generator - CreatorFlow',
  description: 'Get unlimited content ideas tailored to your audience and platform. Never run out of content ideas again with AI-powered suggestions.',
  keywords: 'content ideas, content generation, social media content, content planning, creative ideas',
};

export default function ContentIdeasGeneratorPage() {
  return <ContentIdeasGenerator />;
}
