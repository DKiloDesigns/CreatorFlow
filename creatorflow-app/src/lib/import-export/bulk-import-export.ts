/**
 * Bulk Import/Export System
 * Handle CSV, Excel, and JSON import/export operations
 */

export interface ImportData {
  id?: string;
  content: string;
  platform: string;
  type: 'text' | 'image' | 'video' | 'carousel' | 'story';
  scheduledTime?: string;
  hashtags?: string[];
  mentions?: string[];
  callToAction?: string;
  imageUrl?: string;
  videoUrl?: string;
  metadata?: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  data: ImportData[];
  errors: ImportError[];
  warnings: ImportWarning[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    warnings: number;
  };
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

export interface ImportWarning {
  row: number;
  field: string;
  message: string;
  suggestion?: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  dateRange?: {
    start: string;
    end: string;
  };
  platforms?: string[];
  contentTypes?: string[];
  includeMetadata?: boolean;
  includeAnalytics?: boolean;
}

export interface ExportResult {
  success: boolean;
  data: string;
  filename: string;
  mimeType: string;
  size: number;
  recordCount: number;
}

export class BulkImportExport {
  private supportedFormats = ['csv', 'excel', 'json'];
  private requiredFields = ['content', 'platform', 'type'];
  private optionalFields = ['scheduledTime', 'hashtags', 'mentions', 'callToAction', 'imageUrl', 'videoUrl'];

  // Import CSV data
  async importCSV(csvData: string): Promise<ImportResult> {
    try {
      const lines = csvData.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        return {
          success: false,
          data: [],
          errors: [{ row: 0, field: 'file', message: 'CSV file must contain at least a header row and one data row' }],
          warnings: [],
          summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
        };
      }

      const headers = this.parseCSVLine(lines[0]);
      const data: ImportData[] = [];
      const errors: ImportError[] = [];
      const warnings: ImportWarning[] = [];

      // Validate headers
      const headerValidation = this.validateHeaders(headers);
      if (!headerValidation.valid) {
        return {
          success: false,
          data: [],
          errors: headerValidation.errors,
          warnings: [],
          summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
        };
      }

      // Process data rows
      for (let i = 1; i < lines.length; i++) {
        const row = this.parseCSVLine(lines[i]);
        const rowData: Partial<ImportData> = {};
        const rowErrors: ImportError[] = [];
        const rowWarnings: ImportWarning[] = [];

        // Map CSV columns to data fields
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          const field = this.mapHeaderToField(header);

          if (this.requiredFields.includes(field) && (!value || value === '')) {
            rowErrors.push({
              row: i + 1,
              field,
              message: `${field} is required`,
              value
            });
          }

          if (value) {
            switch (field) {
              case 'content':
                rowData.content = value;
                break;
              case 'platform':
                if (!this.isValidPlatform(value)) {
                  rowErrors.push({
                    row: i + 1,
                    field,
                    message: `Invalid platform: ${value}`,
                    value
                  });
                } else {
                  rowData.platform = value;
                }
                break;
              case 'type':
                if (!this.isValidContentType(value)) {
                  rowErrors.push({
                    row: i + 1,
                    field,
                    message: `Invalid content type: ${value}`,
                    value
                  });
                } else {
                  rowData.type = value as any;
                }
                break;
              case 'scheduledTime':
                if (!this.isValidDate(value)) {
                  rowErrors.push({
                    row: i + 1,
                    field,
                    message: `Invalid date format: ${value}`,
                    value
                  });
                } else {
                  rowData.scheduledTime = value;
                }
                break;
              case 'hashtags':
                rowData.hashtags = this.parseArray(value);
                break;
              case 'mentions':
                rowData.mentions = this.parseArray(value);
                break;
              case 'callToAction':
                rowData.callToAction = value;
                break;
              case 'imageUrl':
                if (!this.isValidUrl(value)) {
                  rowWarnings.push({
                    row: i + 1,
                    field,
                    message: `Invalid URL format: ${value}`,
                    suggestion: 'Please check the URL format'
                  });
                }
                rowData.imageUrl = value;
                break;
              case 'videoUrl':
                if (!this.isValidUrl(value)) {
                  rowWarnings.push({
                    row: i + 1,
                    field,
                    message: `Invalid URL format: ${value}`,
                    suggestion: 'Please check the URL format'
                  });
                }
                rowData.videoUrl = value;
                break;
            }
          }
        });

        if (rowErrors.length === 0) {
          data.push(rowData as ImportData);
        } else {
          errors.push(...rowErrors);
        }

        warnings.push(...rowWarnings);
      }

      return {
        success: errors.length === 0,
        data,
        errors,
        warnings,
        summary: {
          total: lines.length - 1,
          successful: data.length,
          failed: errors.length,
          warnings: warnings.length
        }
      };

    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, field: 'file', message: `CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        warnings: [],
        summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
      };
    }
  }

  // Import Excel data
  async importExcel(excelData: ArrayBuffer): Promise<ImportResult> {
    try {
      // This would typically use a library like xlsx
      // For now, we'll simulate Excel import by converting to CSV
      const csvData = await this.convertExcelToCSV(excelData);
      return await this.importCSV(csvData);
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, field: 'file', message: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        warnings: [],
        summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
      };
    }
  }

  // Import JSON data
  async importJSON(jsonData: string): Promise<ImportResult> {
    try {
      const data = JSON.parse(jsonData);
      const importData: ImportData[] = [];
      const errors: ImportError[] = [];
      const warnings: ImportWarning[] = [];

      if (!Array.isArray(data)) {
        return {
          success: false,
          data: [],
          errors: [{ row: 0, field: 'file', message: 'JSON data must be an array of objects' }],
          warnings: [],
          summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
        };
      }

      data.forEach((item, index) => {
        const rowErrors: ImportError[] = [];
        const rowWarnings: ImportWarning[] = [];

        // Validate required fields
        this.requiredFields.forEach(field => {
          if (!item[field]) {
            rowErrors.push({
              row: index + 1,
              field,
              message: `${field} is required`
            });
          }
        });

        // Validate platform
        if (item.platform && !this.isValidPlatform(item.platform)) {
          rowErrors.push({
            row: index + 1,
            field: 'platform',
            message: `Invalid platform: ${item.platform}`
          });
        }

        // Validate content type
        if (item.type && !this.isValidContentType(item.type)) {
          rowErrors.push({
            row: index + 1,
            field: 'type',
            message: `Invalid content type: ${item.type}`
          });
        }

        // Validate date
        if (item.scheduledTime && !this.isValidDate(item.scheduledTime)) {
          rowErrors.push({
            row: index + 1,
            field: 'scheduledTime',
            message: `Invalid date format: ${item.scheduledTime}`
          });
        }

        if (rowErrors.length === 0) {
          importData.push(item as ImportData);
        } else {
          errors.push(...rowErrors);
        }

        warnings.push(...rowWarnings);
      });

      return {
        success: errors.length === 0,
        data: importData,
        errors,
        warnings,
        summary: {
          total: data.length,
          successful: importData.length,
          failed: errors.length,
          warnings: warnings.length
        }
      };

    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [{ row: 0, field: 'file', message: `JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` }],
        warnings: [],
        summary: { total: 0, successful: 0, failed: 0, warnings: 0 }
      };
    }
  }

  // Export data
  async exportData(data: ImportData[], options: ExportOptions): Promise<ExportResult> {
    try {
      let exportData: string;
      let filename: string;
      let mimeType: string;

      switch (options.format) {
        case 'csv':
          exportData = this.exportToCSV(data, options);
          filename = `content-export-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        case 'excel':
          exportData = await this.exportToExcel(data, options);
          filename = `content-export-${new Date().toISOString().split('T')[0]}.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'json':
          exportData = this.exportToJSON(data, options);
          filename = `content-export-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      return {
        success: true,
        data: exportData,
        filename,
        mimeType,
        size: new Blob([exportData]).size,
        recordCount: data.length
      };

    } catch (error) {
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate CSV template
  generateCSVTemplate(): string {
    const headers = [
      'content',
      'platform',
      'type',
      'scheduledTime',
      'hashtags',
      'mentions',
      'callToAction',
      'imageUrl',
      'videoUrl'
    ];

    const sampleData = [
      'Check out our new product!',
      'instagram',
      'image',
      '2024-01-15T10:00:00Z',
      '#newproduct,#launch,#excited',
      '@company,@ceo',
      'Learn more',
      'https://example.com/image.jpg',
      ''
    ];

    return [headers.join(','), sampleData.join(',')].join('\n');
  }

  // Private helper methods
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  private validateHeaders(headers: string[]): { valid: boolean; errors: ImportError[] } {
    const errors: ImportError[] = [];
    const requiredHeaders = this.requiredFields.map(field => this.mapFieldToHeader(field));

    requiredHeaders.forEach(header => {
      if (!headers.includes(header)) {
        errors.push({
          row: 1,
          field: header,
          message: `Required column missing: ${header}`
        });
      }
    });

    return { valid: errors.length === 0, errors };
  }

  private mapHeaderToField(header: string): string {
    const mapping: Record<string, string> = {
      'content': 'content',
      'platform': 'platform',
      'type': 'type',
      'scheduled_time': 'scheduledTime',
      'scheduledTime': 'scheduledTime',
      'hashtags': 'hashtags',
      'mentions': 'mentions',
      'call_to_action': 'callToAction',
      'callToAction': 'callToAction',
      'image_url': 'imageUrl',
      'imageUrl': 'imageUrl',
      'video_url': 'videoUrl',
      'videoUrl': 'videoUrl'
    };

    return mapping[header.toLowerCase()] || header.toLowerCase();
  }

  private mapFieldToHeader(field: string): string {
    const mapping: Record<string, string> = {
      'content': 'content',
      'platform': 'platform',
      'type': 'type',
      'scheduledTime': 'scheduledTime',
      'hashtags': 'hashtags',
      'mentions': 'mentions',
      'callToAction': 'callToAction',
      'imageUrl': 'imageUrl',
      'videoUrl': 'videoUrl'
    };

    return mapping[field] || field;
  }

  private isValidPlatform(platform: string): boolean {
    const validPlatforms = [
      'instagram', 'facebook', 'youtube', 'tiktok', 'twitter', 'linkedin',
      'pinterest', 'snapchat', 'reddit', 'discord', 'twitch', 'vimeo',
      'dribbble', 'slack', 'whatsapp', 'mastodon'
    ];
    return validPlatforms.includes(platform.toLowerCase());
  }

  private isValidContentType(type: string): boolean {
    const validTypes = ['text', 'image', 'video', 'carousel', 'story'];
    return validTypes.includes(type.toLowerCase());
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private parseArray(value: string): string[] {
    return value.split(',').map(item => item.trim()).filter(item => item);
  }

  private async convertExcelToCSV(excelData: ArrayBuffer): Promise<string> {
    // This would typically use xlsx library
    // For now, return a placeholder
    return 'content,platform,type\nSample content,instagram,text';
  }

  private exportToCSV(data: ImportData[], options: ExportOptions): string {
    const headers = ['content', 'platform', 'type', 'scheduledTime', 'hashtags', 'mentions', 'callToAction'];
    
    if (options.includeMetadata) {
      headers.push('metadata');
    }

    const csvLines = [headers.join(',')];

    data.forEach(item => {
      const row = [
        this.escapeCSV(item.content),
        item.platform,
        item.type,
        item.scheduledTime || '',
        item.hashtags?.join(',') || '',
        item.mentions?.join(',') || '',
        item.callToAction || ''
      ];

      if (options.includeMetadata) {
        row.push(JSON.stringify(item.metadata || {}));
      }

      csvLines.push(row.join(','));
    });

    return csvLines.join('\n');
  }

  private async exportToExcel(data: ImportData[], options: ExportOptions): Promise<string> {
    // This would typically use xlsx library
    // For now, convert to CSV
    return this.exportToCSV(data, options);
  }

  private exportToJSON(data: ImportData[], options: ExportOptions): string {
    return JSON.stringify(data, null, 2);
  }

  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}
