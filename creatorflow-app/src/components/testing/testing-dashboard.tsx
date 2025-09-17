/**
 * Testing Dashboard Component
 * Main interface for running and monitoring platform tests
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
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Badge,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface TestResult {
  id: string;
  platform: string;
  testType: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  details?: any;
  environment: 'localhost' | 'production';
}

interface PlatformStatus {
  platform: string;
  connected: boolean;
  lastTest?: TestResult;
  errorCount: number;
  successRate: number;
  lastError?: string;
}

interface TestSummary {
  total: number;
  successful: number;
  failed: number;
  running: number;
  successRate: number;
  averageDuration: number;
}

const PLATFORMS = [
  'instagram', 'facebook', 'youtube', 'tiktok', 'github', 'discord',
  'twitch', 'vimeo', 'dribbble', 'slack', 'reddit', 'snapchat',
  'linkedin', 'twitter', 'whatsapp', 'mastodon'
];

const TEST_TYPES = [
  { value: 'oauth', label: 'OAuth Flow', description: 'Test authentication flow' },
  { value: 'text_post', label: 'Text Post', description: 'Test text post publishing' },
  { value: 'image_post', label: 'Image Post', description: 'Test image post publishing' },
  { value: 'video_post', label: 'Video Post', description: 'Test video post publishing' },
  { value: 'scheduled_post', label: 'Scheduled Post', description: 'Test scheduled post functionality' },
  { value: 'cross_platform', label: 'Cross Platform', description: 'Test multi-platform publishing' },
];

export default function TestingDashboard() {
  const [environment, setEnvironment] = useState<'localhost' | 'production'>('localhost');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTestTypes, setSelectedTestTypes] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [platformStatuses, setPlatformStatuses] = useState<PlatformStatus[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch test data
  const fetchTestData = async () => {
    try {
      const response = await fetch('/api/testing/run-test');
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
        setPlatformStatuses(data.platformStatuses || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Failed to fetch test data:', error);
    }
  };

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchTestData, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Initial load
  useEffect(() => {
    fetchTestData();
  }, []);

  const runSingleTest = async (platform: string, testType: string) => {
    try {
      setIsRunning(true);
      const response = await fetch('/api/testing/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, testType, environment })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTestData();
      }
    } catch (error) {
      console.error('Failed to run test:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runBatchTests = async () => {
    if (selectedPlatforms.length === 0 || selectedTestTypes.length === 0) {
      return;
    }

    try {
      setIsRunning(true);
      const response = await fetch('/api/testing/batch-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platforms: selectedPlatforms, 
          testTypes: selectedTestTypes, 
          environment,
          parallel: true 
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTestData();
      }
    } catch (error) {
      console.error('Failed to run batch tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = async () => {
    try {
      const response = await fetch('/api/testing/clear', {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTestData();
      }
    } catch (error) {
      console.error('Failed to clear results:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      case 'running':
        return <CircularProgress size={20} />;
      case 'pending':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'running':
        return 'info';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Platform Testing Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Test and validate CreatorFlow's platform integrations in both localhost and production environments.
      </Typography>

      {/* Environment Toggle */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6">Environment</Typography>
              <Typography variant="body2" color="text.secondary">
                {environment === 'localhost' 
                  ? 'Mock testing with simulated responses' 
                  : 'Production testing with real API calls'
                }
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={environment === 'production'}
                  onChange={(e) => setEnvironment(e.target.checked ? 'production' : 'localhost')}
                />
              }
              label={environment === 'production' ? 'Production' : 'Localhost'}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Platforms</InputLabel>
                <Select
                  multiple
                  value={selectedPlatforms}
                  onChange={(e) => setSelectedPlatforms(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {PLATFORMS.map((platform) => (
                    <MenuItem key={platform} value={platform}>
                      {platform}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Test Types</InputLabel>
                <Select
                  multiple
                  value={selectedTestTypes}
                  onChange={(e) => setSelectedTestTypes(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {TEST_TYPES.map((testType) => (
                    <MenuItem key={testType.value} value={testType.value}>
                      {testType.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={runBatchTests}
              disabled={isRunning || selectedPlatforms.length === 0 || selectedTestTypes.length === 0}
            >
              Run Batch Tests
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={clearResults}
            >
              Clear Results
            </Button>
            
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                />
              }
              label="Auto Refresh"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Tests
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
                <Typography color="text.secondary" gutterBottom>
                  Successful
                </Typography>
                <Typography variant="h4" color="success.main">
                  {summary.successful}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Failed
                </Typography>
                <Typography variant="h4" color="error.main">
                  {summary.failed}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Success Rate
                </Typography>
                <Typography variant="h4">
                  {summary.successRate.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab label="Platform Status" icon={<AssessmentIcon />} />
          <Tab label="Test Results" icon={<TimelineIcon />} />
          <Tab label="Quick Tests" icon={<SpeedIcon />} />
        </Tabs>

        {/* Platform Status Tab */}
        {activeTab === 0 && (
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Success Rate</TableCell>
                    <TableCell>Error Count</TableCell>
                    <TableCell>Last Test</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {platformStatuses.map((platform) => (
                    <TableRow key={platform.platform}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {platform.platform}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={platform.connected ? 'Connected' : 'Disconnected'}
                          color={platform.connected ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={platform.successRate}
                            sx={{ width: 100, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="body2">
                            {platform.successRate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Badge badgeContent={platform.errorCount} color="error">
                          <ErrorIcon />
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {platform.lastTest ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getStatusIcon(platform.lastTest.status)}
                            <Typography variant="body2">
                              {platform.lastTest.testType}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No tests
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => runSingleTest(platform.platform, 'oauth')}
                          disabled={isRunning}
                        >
                          Test OAuth
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Test Results Tab */}
        {activeTab === 1 && (
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Platform</TableCell>
                    <TableCell>Test Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Environment</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.platform}</TableCell>
                      <TableCell>{result.testType}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(result.status)}
                          label={result.status}
                          color={getStatusColor(result.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {result.duration ? `${result.duration}ms` : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.environment}
                          color={result.environment === 'production' ? 'error' : 'info'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {result.error && (
                          <Tooltip title={result.error}>
                            <IconButton size="small">
                              <BugReportIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        )}

        {/* Quick Tests Tab */}
        {activeTab === 2 && (
          <CardContent>
            <Grid container spacing={2}>
              {PLATFORMS.map((platform) => (
                <Grid item xs={12} sm={6} md={4} key={platform}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {platform}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {TEST_TYPES.map((testType) => (
                          <Button
                            key={testType.value}
                            variant="outlined"
                            size="small"
                            onClick={() => runSingleTest(platform, testType.value)}
                            disabled={isRunning}
                            startIcon={getStatusIcon('pending')}
                          >
                            {testType.label}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}
      </Card>
    </Box>
  );
}
