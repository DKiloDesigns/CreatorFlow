/**
 * Import/Export Dashboard Page
 * Main page for bulk import/export operations
 */

import React from 'react';
import { Metadata } from 'next';
import BulkImportExport from '@/components/import-export/bulk-import-export';

export const metadata: Metadata = {
  title: 'Import/Export - CreatorFlow',
  description: 'Import content from CSV, Excel, or JSON files, or export your data for backup and analysis.',
  keywords: 'import export, bulk upload, CSV, Excel, JSON, content management',
};

export default function ImportExportPage() {
  return <BulkImportExport />;
}
