/**
 * Advanced Analytics Dashboard
 * Comprehensive analytics with custom dashboards, AI insights, and reporting
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Alert,
  Tabs,
  Tab,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  Dashboard as DashboardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart as TableChartIcon,
  Gauge as GaugeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import DashboardBuilder from '@/components/analytics/dashboard-builder';
import AIInsights, { InsightSummary, QuickActions } from '@/components/analytics/ai-insights';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [analytics, setAnalytics] = useState<any>(null);
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDashboardBuilder, setShowDashboardBuilder] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load comprehensive analytics
      const analyticsResponse = await fetch('/api/analytics/comprehensive');
      const analyticsData = await analyticsResponse.json();
      
      if (analyticsData.success) {
        setAnalytics(analyticsData.analytics);
        setInsights(analyticsData.analytics.insights || []);
      }

      // Load dashboards
      const dashboardsResponse = await fetch('/api/analytics/dashboards');
      const dashboardsData = await dashboardsResponse.json();
      
      if (dashboardsData.success) {
        setDashboards(dashboardsData.dashboards);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    try {
      await loadData();
    } catch (error) {
      console.error('Failed to refresh insights:', error);
    }
  };

  const handleActionItemClick = (actionItem: string) => {
    console.log('Action item clicked:', actionItem);
    // Implement action item logic
  };

  const handleCreateDashboard = () => {
    setSelectedDashboard(null);
    setShowDashboardBuilder(true);
  };

  const handleEditDashboard = (dashboard: any) => {
    setSelectedDashboard(dashboard);
    setShowDashboardBuilder(true);
  };

  const handleDashboardSave = (dashboard: any) => {
    console.log('Dashboard saved:', dashboard);
    setShowDashboardBuilder(false);
    loadData(); // Refresh dashboards
  };

  const handleGenerateReport = () => {
    setShowReportDialog(true);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon color="success" />;
      case 'down':
        return <TrendingDownIcon color="error" />;
      case 'stable':
        return <TrendingFlatIcon color="info" />;
      default:
        return <TrendingFlatIcon />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      case 'stable':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading analytics dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: { xs: 8, sm: 4 } }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
        Advanced Analytics Dashboard
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Comprehensive analytics with AI-powered insights, custom dashboards, 
        and automated reporting for your content performance.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Overview" icon={<AnalyticsIcon />} />
          <Tab label="Custom Dashboards" icon={<DashboardIcon />} />
          <Tab label="AI Insights" icon={<AutoAwesomeIcon />} />
          <Tab label="Reports" icon={<AssessmentIcon />} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Performance Overview
        </Typography>
        
        {analytics ? (
          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="primary">
                    {analytics.overview.totalPosts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Posts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="success.main">
                    {analytics.overview.totalEngagement.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Engagement
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="info.main">
                    {analytics.overview.totalReach.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reach
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h4" color="warning.main">
                    {analytics.overview.averageEngagementRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Engagement Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Platform Performance */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Platform Performance
                  </Typography>
                  <Grid container spacing={2}>
                    {analytics.platformMetrics.map((platform: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                              {platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}
                            </Typography>
                            <Chip
                              label={`${platform.engagementRate.toFixed(1)}%`}
                              color={platform.engagementRate > 5 ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {platform.posts} posts • {platform.engagement.toLocaleString()} engagement
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Trends */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Performance Trends
                  </Typography>
                  <Grid container spacing={2}>
                    {analytics.trends.map((trend: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {getTrendIcon(trend.trend)}
                            <Typography variant="subtitle1" sx={{ ml: 1, color: 'text.primary', fontWeight: 'bold' }}>
                              {trend.metric.charAt(0).toUpperCase() + trend.metric.slice(1)}
                            </Typography>
                          </Box>
                          <Typography variant="h6" color={`${getTrendColor(trend.trend)}.main`}>
                            {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage.toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {trend.confidence > 0.8 ? 'High' : trend.confidence > 0.6 ? 'Medium' : 'Low'} confidence
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">
            No analytics data available yet. Start posting content to see your performance metrics.
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Custom Dashboards
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateDashboard}
          >
            Create Dashboard
          </Button>
        </Box>

        {dashboards.length === 0 ? (
          <Alert severity="info">
            No custom dashboards created yet. Create your first dashboard to get started.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {dashboards.map((dashboard) => (
              <Grid item xs={12} sm={6} md={4} key={dashboard.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        {dashboard.name}
          </Typography>
                      <Box>
                        <Tooltip title="Edit Dashboard">
                          <IconButton
                            size="small"
                            onClick={() => handleEditDashboard(dashboard)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Dashboard">
                          <IconButton
                            size="small"
                            onClick={() => console.log('Delete dashboard:', dashboard.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
          </Box>
        </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {dashboard.description || 'No description'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={`${dashboard.widgets.length} widgets`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {dashboard.isDefault && (
                        <Chip
                          label="Default"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
    </Box>

                    <Button
                      variant="outlined"
      fullWidth
                      onClick={() => console.log('View dashboard:', dashboard.id)}
                    >
                      View Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <AIInsights
          insights={insights}
          onRefresh={handleRefreshInsights}
          onActionItemClick={handleActionItemClick}
        />
        
        {insights.length > 0 && (
          <>
            <InsightSummary insights={insights} />
            <QuickActions
              insights={insights}
              onActionClick={handleActionItemClick}
            />
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          Automated Reports
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  Generate Report
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Create a comprehensive performance report for your content.
                </Typography>
                
                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                  onClick={handleGenerateReport}
      fullWidth
    >
                  Generate Report
        </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                  Schedule Reports
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Set up automated reports to be sent to your email.
                </Typography>
                
                <Button
                  variant="outlined"
                  startIcon={<ScheduleIcon />}
      fullWidth
    >
                  Schedule Reports
        </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dashboard Builder Dialog */}
    <Dialog
        open={showDashboardBuilder}
        onClose={() => setShowDashboardBuilder(false)}
        maxWidth="xl"
      fullWidth
    >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 'bold' }}>
          {selectedDashboard ? 'Edit Dashboard' : 'Create Dashboard'}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <DashboardBuilder
            dashboardId={selectedDashboard?.id}
            onSave={handleDashboardSave}
            onCancel={() => setShowDashboardBuilder(false)}
          />
      </DialogContent>
    </Dialog>

      {/* Report Generation Dialog */}
    <Dialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        maxWidth="sm"
      fullWidth
    >
        <DialogTitle sx={{ color: 'text.primary', fontWeight: 'bold' }}>Generate Report</DialogTitle>
      <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Report Name"
                defaultValue="Performance Report"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select defaultValue="performance">
                  <MenuItem value="performance">Performance Report</MenuItem>
                  <MenuItem value="engagement">Engagement Report</MenuItem>
                  <MenuItem value="growth">Growth Report</MenuItem>
                  <MenuItem value="custom">Custom Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select defaultValue="pdf">
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="excel">Excel</MenuItem>
                  <MenuItem value="csv">CSV</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Include AI Insights"
              />
            </Grid>
          </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>
            Cancel
        </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Generate Report
        </Button>
      </DialogActions>
    </Dialog>

    {/* Bottom Spacer to Clear Bottom Navigation */}
    <div className="h-32 sm:h-10 w-full"></div>
  </Container>
  );
} 