/**
 * OAuth Testing Dashboard
 * Visual interface for testing OAuth flows
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface OAuthTestResult {
  platform: string;
  status: 'success' | 'error' | 'pending' | 'skipped';
  message: string;
  timestamp: string;
  details?: {
    redirectUri?: string;
    scope?: string;
    clientId?: string;
    errorCode?: string;
    errorDescription?: string;
  };
}

interface TestSummary {
  total: number;
  success: number;
  error: number;
  skipped: number;
  pending: number;
}

export default function OAuthTestingDashboard() {
  const [results, setResults] = useState<OAuthTestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary>({ total: 0, success: 0, error: 0, skipped: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<OAuthTestResult | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Run OAuth tests
  const runOAuthTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/testing/oauth-test');
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setSummary(data.summary);
        setSnackbarMessage(`OAuth testing completed! ${data.summary.success} successful, ${data.summary.error} errors`);
      } else {
        setSnackbarMessage(`OAuth testing failed: ${data.message}`);
      }
    } catch (error) {
      setSnackbarMessage(`Error running OAuth tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Test actual posting with access token
  const testActualPosting = async () => {
    if (!selectedPlatform || !accessToken) {
      setSnackbarMessage('Please select a platform and enter access token');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/testing/oauth-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          accessToken: accessToken
        })
      });

      const data = await response.json();

      if (data.success) {
        setSnackbarMessage(`Posting test completed: ${data.result.message}`);
        // Add result to existing results
        setResults(prev => [...prev, data.result]);
      } else {
        setSnackbarMessage(`Posting test failed: ${data.message}`);
      }
    } catch (error) {
      setSnackbarMessage(`Error testing posting: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Get status icon
  const getStatusIcon = (status: OAuthTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'pending':
        return <InfoIcon color="info" />;
      case 'skipped':
        return <InfoIcon color="disabled" />;
      default:
        return <InfoIcon />;
    }
  };

  // Get status color
  const getStatusColor = (status: OAuthTestResult['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'pending':
        return 'info';
      case 'skipped':
        return 'default';
      default:
        return 'default';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Export results
  const exportResults = () => {
    const dataStr = JSON.stringify({ results, summary, timestamp: new Date().toISOString() }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oauth-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          OAuth Testing Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Test OAuth flows for all 16 social media platforms and verify posting functionality
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<PlayIcon />}
            onClick={runOAuthTests}
            disabled={loading}
            sx={{ minWidth: 150 }}
          >
            {loading ? 'Testing...' : 'Run OAuth Tests'}
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={runOAuthTests}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportResults}
            disabled={results.length === 0}
          >
            Export Results
          </Button>
        </Box>

        {/* Progress */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Running OAuth tests...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Platforms
              </Typography>
              <Typography variant="h4">
                {summary.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="success.main" gutterBottom>
                Successful
              </Typography>
              <Typography variant="h4" color="success.main">
                {summary.success}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="error.main" gutterBottom>
                Errors
              </Typography>
              <Typography variant="h4" color="error.main">
                {summary.error}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Skipped
              </Typography>
              <Typography variant="h4">
                {summary.skipped}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actual Posting Test */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Actual Posting
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Test actual posting functionality with a real access token
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Platform</InputLabel>
                <Select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  label="Platform"
                >
                  {results.map((result) => (
                    <MenuItem key={result.platform} value={result.platform}>
                      {result.platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Enter access token"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={testActualPosting}
                disabled={!selectedPlatform || !accessToken || loading}
                fullWidth
              >
                Test Posting
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Results
          </Typography>
          
          {results.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No test results yet. Click "Run OAuth Tests" to start testing.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.platform}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {result.platform}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(result.status)}
                          <Chip
                            label={result.status}
                            color={getStatusColor(result.status) as any}
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {result.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimestamp(result.timestamp)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedResult(result);
                              setDetailsOpen(true);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Test Details - {selectedResult?.platform}
        </DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedResult.title || selectedResult.platform}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedResult.message}
              </Typography>
              
              {selectedResult.details && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '16px', 
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '14px'
                  }}>
                    {JSON.stringify(selectedResult.details, null, 2)}
                  </pre>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
