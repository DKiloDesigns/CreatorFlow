'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Error as ErrorIcon,
  BugReport,
  Build,
  Refresh,
  ExpandMore,
  Warning,
  CheckCircle,
  Info,
  Code,
  Timeline,
  Assessment,
  Clear,
} from '@mui/icons-material';
import { buildErrorRecovery, checkBuildHealth } from '@/lib/build-error-recovery';
import { ErrorCodes } from '@/lib/error-handler';

interface ErrorStats {
  totalErrors: number;
  errorTypes: Record<string, number>;
  topErrors: Array<{ error: string; count: number }>;
  recoveryAttempts: Record<string, number>;
}

const ErrorMonitoringDashboard: React.FC = () => {
  const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);
  const [buildHealth, setBuildHealth] = useState<{ healthy: boolean; issues: string[] }>({ healthy: true, issues: [] });
  const [loading, setLoading] = useState(true);
  const [recoverySuggestions, setRecoverySuggestions] = useState<string[]>([]);

  const fetchErrorStats = () => {
    setLoading(true);
    try {
      const stats = buildErrorRecovery.getErrorStats();
      const health = checkBuildHealth();
      const suggestions = buildErrorRecovery.getRecoverySuggestions();
      
      setErrorStats(stats);
      setBuildHealth(health);
      setRecoverySuggestions(suggestions);
    } catch (error) {
      console.error('Failed to fetch error stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearErrorCache = () => {
    buildErrorRecovery.clearCache();
    fetchErrorStats();
  };

  useEffect(() => {
    fetchErrorStats();
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchErrorStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const getErrorTypeColor = (type: string) => {
    switch (type) {
      case 'module_not_found': return 'error';
      case 'compilation_error': return 'warning';
      case 'import_error': return 'info';
      case 'type_error': return 'secondary';
      default: return 'default';
    }
  };

  const getErrorTypeIcon = (type: string) => {
    switch (type) {
      case 'module_not_found': return <Build />;
      case 'compilation_error': return <Code />;
      case 'import_error': return <BugReport />;
      case 'type_error': return <Warning />;
      default: return <ErrorIcon />;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Error Monitoring Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchErrorStats}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<Clear />}
            onClick={clearErrorCache}
          >
            Clear Cache
          </Button>
        </Box>
      </Box>

      {/* Build Health Status */}
      <Alert 
        severity={buildHealth.healthy ? 'success' : 'warning'} 
        sx={{ mb: 3 }}
        icon={buildHealth.healthy ? <CheckCircle /> : <Warning />}
      >
        <AlertTitle>
          Build Health: {buildHealth.healthy ? 'Healthy' : 'Issues Detected'}
        </AlertTitle>
        {buildHealth.issues.length > 0 && (
          <ul>
            {buildHealth.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        )}
      </Alert>

      <Grid container spacing={3}>
        {/* Error Statistics Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Error Statistics"
              action={
                <Chip 
                  label={`${errorStats?.totalErrors || 0} Total`} 
                  color={errorStats && errorStats.totalErrors > 0 ? 'error' : 'success'}
                />
              }
            />
            <CardContent>
              {errorStats && errorStats.totalErrors > 0 ? (
                <List dense>
                  {Object.entries(errorStats.errorTypes).map(([type, count]) => (
                    <ListItem key={type}>
                      <ListItemIcon>
                        {getErrorTypeIcon(type)}
                      </ListItemIcon>
                      <ListItemText 
                        primary={type.replace('_', ' ').toUpperCase()}
                        secondary={`${count} occurrences`}
                      />
                      <Chip 
                        label={count} 
                        color={getErrorTypeColor(type) as any}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No errors detected
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recovery Suggestions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Recovery Suggestions" />
            <CardContent>
              {recoverySuggestions.length > 0 ? (
                <List dense>
                  {recoverySuggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Info color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No recovery suggestions available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Errors */}
        {errorStats && errorStats.topErrors.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Most Frequent Errors" />
              <CardContent>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Error</TableCell>
                        <TableCell align="right">Count</TableCell>
                        <TableCell align="center">Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {errorStats.topErrors.map((error, index) => {
                        const [type, message] = error.error.split(':');
                        return (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {message || error.error}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Chip label={error.count} size="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={type} 
                                color={getErrorTypeColor(type) as any}
                                size="small"
                                icon={getErrorTypeIcon(type)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recovery Attempts */}
        {errorStats && Object.keys(errorStats.recoveryAttempts).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Recovery Attempts" />
              <CardContent>
                <List dense>
                  {Object.entries(errorStats.recoveryAttempts).map(([key, attempts]) => (
                    <ListItem key={key}>
                      <ListItemIcon>
                        <Timeline />
                      </ListItemIcon>
                      <ListItemText 
                        primary={key}
                        secondary={`${attempts} recovery attempts`}
                      />
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((attempts / 3) * 100, 100)} 
                        sx={{ width: 100 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Error Prevention Tips */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Error Prevention Tips" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">Module Not Found Errors</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Check import paths and ensure all dependencies are installed" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Verify module names and case sensitivity" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Clear node_modules and reinstall dependencies" />
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2">Compilation Errors</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        <ListItem>
                          <ListItemText primary="Clear .next directory and rebuild" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Check for syntax errors and TypeScript issues" />
                        </ListItem>
                        <ListItem>
                          <ListItemText primary="Verify all imports are correct" />
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ErrorMonitoringDashboard;
