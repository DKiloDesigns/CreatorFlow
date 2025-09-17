/**
 * Content Calendar Templates Page
 * Free tool for downloading professional content calendar templates
 */

import React from 'react';
import { Metadata } from 'next';
import ContentCalendarTemplates from '@/components/tools/content-calendar-templates';

export const metadata: Metadata = {
  title: 'Content Calendar Templates - CreatorFlow',
  description: 'Download professional content calendar templates for your industry and customize them for your brand',
  keywords: 'content calendar templates, social media calendar, content planning, calendar downloads',
};

export default function CalendarTemplatesPage() {
  return <ContentCalendarTemplates />;
}
