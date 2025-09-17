/**
 * Import/Export API Endpoint
 * Handle bulk import and export operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { BulkImportExport } from '@/lib/import-export/bulk-import-export';

const bulkImportExport = new BulkImportExport();

export async function POST(request: NextRequest) {
  try {
    const { action, data, options } = await request.json();

    switch (action) {
      case 'importCSV':
        if (!data) {
          return NextResponse.json({
            success: false,
            message: 'CSV data is required'
          }, { status: 400 });
        }

        const csvResult = await bulkImportExport.importCSV(data);
        return NextResponse.json({
          success: csvResult.success,
          result: csvResult,
          message: csvResult.success ? 'CSV imported successfully' : 'CSV import failed'
        });

      case 'importExcel':
        if (!data) {
          return NextResponse.json({
            success: false,
            message: 'Excel data is required'
          }, { status: 400 });
        }

        const excelResult = await bulkImportExport.importExcel(data);
        return NextResponse.json({
          success: excelResult.success,
          result: excelResult,
          message: excelResult.success ? 'Excel imported successfully' : 'Excel import failed'
        });

      case 'importJSON':
        if (!data) {
          return NextResponse.json({
            success: false,
            message: 'JSON data is required'
          }, { status: 400 });
        }

        const jsonResult = await bulkImportExport.importJSON(data);
        return NextResponse.json({
          success: jsonResult.success,
          result: jsonResult,
          message: jsonResult.success ? 'JSON imported successfully' : 'JSON import failed'
        });

      case 'exportData':
        if (!data || !options) {
          return NextResponse.json({
            success: false,
            message: 'Data and options are required'
          }, { status: 400 });
        }

        const exportResult = await bulkImportExport.exportData(data, options);
        return NextResponse.json({
          success: exportResult.success,
          result: exportResult,
          message: exportResult.success ? 'Data exported successfully' : 'Export failed'
        });

      case 'generateTemplate':
        const template = bulkImportExport.generateCSVTemplate();
        return NextResponse.json({
          success: true,
          template,
          message: 'Template generated successfully'
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Import/Export operation error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Import/Export operation failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
