/**
 * Bulk Import/Export Component
 * Handle CSV, Excel, and JSON import/export operations
 */

'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Alert,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  TableChart as TableIcon,
  Description as DescriptionIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface ImportData {
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

interface ImportResult {
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

interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: any;
}

interface ImportWarning {
  row: number;
  field: string;
  message: string;
  suggestion?: string;
}

interface ExportOptions {
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

export default function BulkImportExport() {
  const [activeTab, setActiveTab] = useState(0);
  const [importData, setImportData] = useState<ImportData[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeMetadata: false,
    includeAnalytics: false
  });
  const [activeStep, setActiveStep] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileInput(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (file.name.endsWith('.csv')) {
          setCsvText(content);
        } else if (file.name.endsWith('.json')) {
          setJsonText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Import CSV
  const handleImportCSV = async () => {
    if (!csvText.trim()) {
      alert('Please enter CSV data or upload a file');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'importCSV',
          data: csvText
        })
      });

      const result = await response.json();
      if (result.success) {
        setImportResult(result.result);
        setImportData(result.result.data);
        setActiveStep(1);
      } else {
        alert(`Import failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Import JSON
  const handleImportJSON = async () => {
    if (!jsonText.trim()) {
      alert('Please enter JSON data or upload a file');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'importJSON',
          data: jsonText
        })
      });

      const result = await response.json();
      if (result.success) {
        setImportResult(result.result);
        setImportData(result.result.data);
        setActiveStep(1);
      } else {
        alert(`Import failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate CSV template
  const handleGenerateTemplate = async () => {
    try {
      const response = await fetch('/api/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateTemplate'
        })
      });

      const result = await response.json();
      if (result.success) {
        setCsvText(result.template);
        alert('CSV template generated successfully!');
      } else {
        alert(`Failed to generate template: ${result.message}`);
      }
    } catch (error) {
      alert(`Error generating template: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Export data
  const handleExport = async () => {
    if (importData.length === 0) {
      alert('No data to export');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/import-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'exportData',
          data: importData,
          options: exportOptions
        })
      });

      const result = await response.json();
      if (result.success) {
        // Download file
        const blob = new Blob([result.result.data], { type: result.result.mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.result.filename;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert(`Export failed: ${result.message}`);
      }
    } catch (error) {
      alert(`Export error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Get status icon
  const getStatusIcon = (type: 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon />;
    }
  };

  // Get platform color
  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'instagram': '#E4405F',
      'facebook': '#1877F2',
      'youtube': '#FF0000',
      'tiktok': '#000000',
      'twitter': '#1DA1F2',
      'linkedin': '#0077B5'
    };
    return colors[platform] || '#666';
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Bulk Import/Export
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Import content from CSV, Excel, or JSON files, or export your data for backup and analysis.
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Import" icon={<UploadIcon />} />
          <Tab label="Export" icon={<DownloadIcon />} />
        </Tabs>
      </Box>

      {/* Import Tab */}
      {activeTab === 0 && (
        <Box>
          {/* Import Steps */}
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Upload or Enter Data</StepLabel>
              <StepContent>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Choose Import Method
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Upload File
                          </Typography>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                          />
                          <Button
                            variant="outlined"
                            startIcon={<FileUploadIcon />}
                            onClick={() => fileInputRef.current?.click()}
                            fullWidth
                          >
                            Choose File
                          </Button>
                          {fileInput && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              Selected: {fileInput.name}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Generate Template
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<TableIcon />}
                            onClick={handleGenerateTemplate}
                            fullWidth
                          >
                            Generate CSV Template
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* CSV Input */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        CSV Data
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                        placeholder="Paste CSV data here or upload a file..."
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        startIcon={<TableIcon />}
                        onClick={handleImportCSV}
                        disabled={!csvText.trim() || loading}
                        sx={{ mt: 2 }}
                      >
                        Import CSV
                      </Button>
                    </Box>

                    {/* JSON Input */}
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        JSON Data
                      </Typography>
                      <TextField
                        multiline
                        rows={6}
                        fullWidth
                        value={jsonText}
                        onChange={(e) => setJsonText(e.target.value)}
                        placeholder="Paste JSON data here or upload a file..."
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        startIcon={<CodeIcon />}
                        onClick={handleImportJSON}
                        disabled={!jsonText.trim() || loading}
                        sx={{ mt: 2 }}
                      >
                        Import JSON
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Review Import Results</StepLabel>
              <StepContent>
                {importResult && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Import Results
                      </Typography>
                      
                      {/* Summary */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`${importResult.summary.successful} Successful`}
                          color="success"
                        />
                        <Chip
                          icon={<ErrorIcon />}
                          label={`${importResult.summary.failed} Failed`}
                          color="error"
                        />
                        <Chip
                          icon={<WarningIcon />}
                          label={`${importResult.summary.warnings} Warnings`}
                          color="warning"
                        />
                      </Box>

                      {/* Errors */}
                      {importResult.errors.length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Import Errors:
                          </Typography>
                          {importResult.errors.map((error, index) => (
                            <Typography key={index} variant="body2">
                              Row {error.row}: {error.field} - {error.message}
                            </Typography>
                          ))}
                        </Alert>
                      )}

                      {/* Warnings */}
                      {importResult.warnings.length > 0 && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Import Warnings:
                          </Typography>
                          {importResult.warnings.map((warning, index) => (
                            <Typography key={index} variant="body2">
                              Row {warning.row}: {warning.field} - {warning.message}
                            </Typography>
                          ))}
                        </Alert>
                      )}

                      {/* Data Preview */}
                      {importResult.data.length > 0 && (
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Imported Data Preview:
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Content</TableCell>
                                  <TableCell>Platform</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Scheduled</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {importResult.data.slice(0, 5).map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                        {item.content}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={item.platform}
                                        size="small"
                                        sx={{ backgroundColor: getPlatformColor(item.platform), color: 'white' }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Chip label={item.type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                      {item.scheduledTime ? new Date(item.scheduledTime).toLocaleDateString() : 'Not scheduled'}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton size="small">
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton size="small">
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          startIcon={<ScheduleIcon />}
                          onClick={() => setActiveStep(2)}
                          disabled={importResult.data.length === 0}
                        >
                          Schedule Posts
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Schedule Posts</StepLabel>
              <StepContent>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Schedule Imported Posts
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Review and schedule your imported posts. You can edit individual posts or schedule them all at once.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="contained" startIcon={<ScheduleIcon />}>
                        Schedule All Posts
                      </Button>
                      <Button variant="outlined" startIcon={<EditIcon />}>
                        Edit Posts
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          </Stepper>
        </Box>
      )}

      {/* Export Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Export Data
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Export Format</InputLabel>
                  <Select
                    value={exportOptions.format}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as any }))}
                    label="Export Format"
                  >
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.includeMetadata}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    />
                  }
                  label="Include Metadata"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.includeAnalytics}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                    />
                  }
                  label="Include Analytics"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Export Options
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Choose your export format and options. The export will include all your content data.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                  disabled={importData.length === 0 || loading}
                  fullWidth
                >
                  Export Data
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
}
