'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  useTheme
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  AccessTime as ClockIcon,
  Refresh as RefreshCwIcon,
  Download as DownloadIcon,
  BarChart as BarChart3Icon
} from '@mui/icons-material';
import { runHelpSystemTests, TestSuite, TestResult } from '@/lib/help-system-tests';

export default function TestDashboardPage() {
  const [testSuite, setTestSuite] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const theme = useTheme();

  const runTests = async () => {
    try {
      setIsRunning(true);
      setError(null);
      const results = await runHelpSystemTests();
      setTestSuite(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon sx={{ fontSize: 16 }} color={theme.palette.success.main} />;
      case 'fail':
        return <XCircleIcon sx={{ fontSize: 16 }} color={theme.palette.error.main} />;
      case 'skip':
        return <ClockIcon sx={{ fontSize: 16 }} color={theme.palette.warning.main} />;
      default:
        return <ClockIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'success';
      case 'fail':
        return 'error';
      case 'skip':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const exportResults = () => {
    if (!testSuite) return;
    
    const dataStr = JSON.stringify(testSuite, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `help-system-tests-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Help System Test Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
            Comprehensive testing suite for all help system components and functionality.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={isRunning ? <CircularProgress size={16} /> : <PlayIcon />}
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            
            {testSuite && (
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportResults}
              >
                Export Results
              </Button>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {testSuite && (
          <>
            {/* Test Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BarChart3Icon sx={{ fontSize: 20, mr: 1 }} />
                      <Typography variant="h6">Total Tests</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {testSuite.totalTests}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 20, mr: 1 }} color={theme.palette.success.main} />
                      <Typography variant="h6">Passed</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {testSuite.passedTests}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <XCircleIcon sx={{ fontSize: 20, mr: 1 }} color={theme.palette.error.main} />
                      <Typography variant="h6">Failed</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {testSuite.failedTests}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ClockIcon sx={{ fontSize: 20, mr: 1 }} color={theme.palette.warning.main} />
                      <Typography variant="h6">Skipped</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {testSuite.skippedTests}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Progress Bar */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Test Results</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {formatDuration(testSuite.duration)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(testSuite.passedTests / testSuite.totalTests) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {testSuite.passedTests} of {testSuite.totalTests} tests passed
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}% pass rate
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Test Results Table */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Detailed Test Results
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Status</TableCell>
                        <TableCell>Test Name</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {testSuite.tests.map((test, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {getStatusIcon(test.status)}
                              <Chip
                                label={test.status.toUpperCase()}
                                size="small"
                                color={getStatusColor(test.status) as any}
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {test.testName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {test.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {formatDuration(test.duration)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {test.details && (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {JSON.stringify(test.details, null, 2).substring(0, 100)}...
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </>
        )}

        {!testSuite && !isRunning && (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No test results available
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                Click "Run All Tests" to start testing the help system components.
              </Typography>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={runTests}
              >
                Run Tests
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
