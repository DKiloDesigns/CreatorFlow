"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  TrendingUp,
  TrendingDown,
  Refresh,
  FilterList,
  Search,
  MoreVert,
  Download,
  Share,
  Settings,
  Dashboard,
  Assessment,
  Business,
  School,
  Work,
  CheckCircle,
  Warning,
  Error,
  Info,
  ExpandMore,
  Palette,
  Code,
  Cloud,
  Security,
  Speed,
  Storage,
  Timeline,
  Compare,
  AutoAwesome,
  DataUsage,
  Insights,
  Report,
  Schedule,
  Notifications,
  Lock,
  Public
} from '@/lib/mui-optimized-imports';

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'marketing' | 'content' | 'finance' | 'custom';
  isCustom: boolean;
  isPublic: boolean;
  widgets: Array<{
    id: string;
    type: 'chart' | 'metric' | 'table' | 'kpi';
    title: string;
    config: any;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  viewCount: number;
  isFavorite: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  lastGenerated: string;
  nextGeneration: string;
  isActive: boolean;
  isPublic: boolean;
  createdBy: string;
}

interface WhiteLabelConfig {
  id: string;
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS?: string;
  domain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'performance' | 'trend' | 'anomaly' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  impact: number;
  confidence: number;
  data: any;
  createdAt: string;
  isRead: boolean;
}

export default function EnterpriseAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboards, setDashboards] = useState<DashboardTemplate[]>([]);
  const [reports, setReports] = useState<ReportTemplate[]>([]);
  const [whiteLabels, setWhiteLabels] = useState<WhiteLabelConfig[]>([]);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showWhiteLabelDialog, setShowWhiteLabelDialog] = useState(false);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  
  // Form states
  const [dashboardForm, setDashboardForm] = useState({
    name: '',
    description: '',
    category: 'custom',
    isPublic: false
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDashboards: DashboardTemplate[] = [
        {
          id: '1',
          name: 'Executive Overview',
          description: 'High-level KPIs and strategic metrics for executive decision making',
          category: 'executive',
          isCustom: false,
          isPublic: true,
          widgets: [
            { id: '1', type: 'kpi', title: 'Revenue Growth', config: { metric: '15.2%', trend: 'up' } },
            { id: '2', type: 'chart', title: 'Monthly Performance', config: { type: 'line' } },
            { id: '3', type: 'metric', title: 'Team Productivity', config: { value: '87%' } }
          ],
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-08-12T00:00:00Z',
          createdBy: 'Darrell Mayberry',
          viewCount: 245,
          isFavorite: true
        },
        {
          id: '2',
          name: 'Marketing Performance',
          description: 'Comprehensive marketing metrics and campaign performance',
          category: 'marketing',
          isCustom: false,
          isPublic: true,
          widgets: [
            { id: '4', type: 'chart', title: 'Campaign ROI', config: { type: 'bar' } },
            { id: '5', type: 'metric', title: 'Conversion Rate', config: { value: '3.2%' } },
            { id: '6', type: 'table', title: 'Top Performing Content', config: { rows: 10 } }
          ],
          createdAt: '2024-03-20T00:00:00Z',
          updatedAt: '2024-08-10T00:00:00Z',
          createdBy: 'Sarah Chen',
          viewCount: 189,
          isFavorite: false
        },
        {
          id: '3',
          name: 'Content Analytics',
          description: 'Detailed content performance and engagement metrics',
          category: 'content',
          isCustom: true,
          isPublic: false,
          widgets: [
            { id: '7', type: 'chart', title: 'Engagement Trends', config: { type: 'area' } },
            { id: '8', type: 'metric', title: 'Avg. Engagement Rate', config: { value: '4.8%' } },
            { id: '9', type: 'kpi', title: 'Content Quality Score', config: { metric: '92/100', trend: 'up' } }
          ],
          createdAt: '2024-06-15T00:00:00Z',
          updatedAt: '2024-08-12T00:00:00Z',
          createdBy: 'Mike Rodriguez',
          viewCount: 67,
          isFavorite: true
        }
      ];

      const mockReports: ReportTemplate[] = [
        {
          id: '1',
          name: 'Weekly Performance Summary',
          description: 'Weekly overview of key performance indicators',
          type: 'weekly',
          schedule: 'weekly',
          recipients: ['darrell@creatorflow.com', 'sarah@creatorflow.com'],
          format: 'pdf',
          lastGenerated: new Date(Date.now() - 604800000).toISOString(),
          nextGeneration: new Date(Date.now() + 604800000).toISOString(),
          isActive: true,
          isPublic: true,
          createdBy: 'Darrell Mayberry'
        },
        {
          id: '2',
          name: 'Monthly Executive Report',
          description: 'Comprehensive monthly report for executive team',
          type: 'monthly',
          schedule: 'monthly',
          recipients: ['darrell@creatorflow.com', 'executive@creatorflow.com'],
          format: 'excel',
          lastGenerated: new Date(Date.now() - 2592000000).toISOString(),
          nextGeneration: new Date(Date.now() + 2592000000).toISOString(),
          isActive: true,
          isPublic: false,
          createdBy: 'Darrell Mayberry'
        },
        {
          id: '3',
          name: 'Quarterly Business Review',
          description: 'Quarterly business performance and strategic insights',
          type: 'quarterly',
          schedule: 'monthly',
          recipients: ['darrell@creatorflow.com', 'board@creatorflow.com'],
          format: 'pdf',
          lastGenerated: new Date(Date.now() - 7776000000).toISOString(),
          nextGeneration: new Date(Date.now() + 7776000000).toISOString(),
          isActive: true,
          isPublic: false,
          createdBy: 'Darrell Mayberry'
        }
      ];

      const mockWhiteLabels: WhiteLabelConfig[] = [
        {
          id: '1',
          name: 'CreatorFlow Pro',
          logo: '/api/logo/creatorflow-pro',
          primaryColor: '#1976d2',
          secondaryColor: '#dc004e',
          fontFamily: 'Roboto, sans-serif',
          customCSS: '',
          domain: 'pro.creatorflow.com',
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-08-12T00:00:00Z'
        },
        {
          id: '2',
          name: 'Enterprise Brand',
          logo: '/api/logo/enterprise',
          primaryColor: '#2e7d32',
          secondaryColor: '#f57c00',
          fontFamily: 'Inter, sans-serif',
          customCSS: '.custom-header { background: linear-gradient(45deg, #2e7d32, #4caf50); }',
          domain: 'enterprise.creatorflow.com',
          isActive: false,
          createdAt: '2024-05-10T00:00:00Z',
          updatedAt: '2024-08-10T00:00:00Z'
        }
      ];

      const mockInsights: AnalyticsInsight[] = [
        {
          id: '1',
          title: 'Content Performance Surge',
          description: 'Your video content is performing 3.2x better than image content this month',
          type: 'performance',
          priority: 'high',
          impact: 85,
          confidence: 92,
          data: { contentType: 'video', performance: 3.2, period: 'month' },
          createdAt: new Date().toISOString(),
          isRead: false
        },
        {
          id: '2',
          title: 'Engagement Rate Decline',
          description: 'LinkedIn engagement has decreased 15% over the last 2 weeks',
          type: 'trend',
          priority: 'medium',
          impact: 45,
          confidence: 78,
          data: { platform: 'linkedin', decline: 15, period: '2 weeks' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          isRead: true
        },
        {
          id: '3',
          title: 'Optimal Posting Time',
          description: 'Posts at 2-4 PM generate 2.8x more engagement than other times',
          type: 'recommendation',
          priority: 'medium',
          impact: 65,
          confidence: 89,
          data: { timeRange: '2-4 PM', multiplier: 2.8, metric: 'engagement' },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          isRead: false
        }
      ];

      setDashboards(mockDashboards);
      setReports(mockReports);
      setWhiteLabels(mockWhiteLabels);
      setInsights(mockInsights);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enterprise analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'executive': return 'error';
      case 'marketing': return 'primary';
      case 'content': return 'success';
      case 'finance': return 'warning';
      case 'custom': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp />;
      case 'trend': return <ShowChart />;
      case 'anomaly': return <Warning />;
      case 'recommendation': return <AutoAwesome />;
      default: return <Info />;
    }
  };

  const handleCreateDashboard = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDashboard: DashboardTemplate = {
        id: `dashboard_${Date.now()}`,
        name: dashboardForm.name,
        description: dashboardForm.description,
        category: dashboardForm.category as any,
        isCustom: true,
        isPublic: dashboardForm.isPublic,
        widgets: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Darrell Mayberry',
        viewCount: 0,
        isFavorite: false
      };
      
      setDashboards(prev => [newDashboard, ...prev]);
      setShowDashboardDialog(false);
      setDashboardForm({ name: '', description: '', category: 'custom', isPublic: false });
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Custom Dashboards</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowDashboardDialog(true)}
              >
                Create Dashboard
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {dashboards.map((dashboard) => (
                <Grid item xs={12} md={6} lg={4} key={dashboard.id} component="div">
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {dashboard.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {dashboard.description}
                          </Typography>
                        </Box>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={dashboard.category.charAt(0).toUpperCase() + dashboard.category.slice(1)}
                          size="small"
                          color={getCategoryColor(dashboard.category) as any}
                          variant="outlined"
                        />
                        {dashboard.isCustom && (
                          <Chip label="Custom" size="small" color="info" variant="outlined" />
                        )}
                        {dashboard.isPublic && (
                          <Chip label="Public" size="small" color="success" variant="outlined" />
                        )}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {dashboard.viewCount} view{dashboard.viewCount !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Visibility />}>
                          View
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Edit />}>
                          Edit
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Share />}>
                          Share
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Automated Reports</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowReportDialog(true)}
              >
                Create Report
              </Button>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Report Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Schedule</TableCell>
                    <TableCell>Recipients</TableCell>
                    <TableCell>Last Generated</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{report.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {report.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={report.type} size="small" color="primary" />
                      </TableCell>
                      <TableCell>
                        <Chip label={report.schedule} size="small" color="secondary" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(report.lastGenerated).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={report.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small">
                            <Edit />
                          </IconButton>
                          <IconButton size="small">
                            <Schedule />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">White-Label Solutions</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowWhiteLabelDialog(true)}
              >
                Create Brand
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {whiteLabels.map((brand) => (
                <Grid item xs={12} md={6} key={brand.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {brand.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {brand.domain}
                          </Typography>
                        </Box>
                        <Switch
                          checked={brand.isActive}
                          color="primary"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Primary Color
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 20,
                              backgroundColor: brand.primaryColor,
                              borderRadius: 1,
                              border: '1px solid #ddd'
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Secondary Color
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 20,
                              backgroundColor: brand.secondaryColor,
                              borderRadius: 1,
                              border: '1px solid #ddd'
                            }}
                          />
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Font: {brand.fontFamily}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Palette />}>
                          Customize
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Code />}>
                          CSS
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Settings />}>
                          Settings
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>AI-Powered Insights</Typography>
            
            <Grid container spacing={3}>
              {insights.map((insight) => (
                <Grid item xs={12} md={6} key={insight.id} component="div">
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {getInsightIcon(insight.type)}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {insight.title}
                            </Typography>
                            {!insight.isRead && (
                              <Chip label="New" size="small" color="error" />
                            )}
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {insight.description}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={`${insight.impact}% Impact`}
                            size="small"
                            color="success"
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Chip
                          label={insight.priority.toUpperCase()}
                          size="small"
                          color={getPriorityColor(insight.priority) as any}
                          variant="outlined"
                        />
                        <Chip
                          label={`${insight.confidence}% Confidence`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" size="small" startIcon={<Insights />}>
                          View Details
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<Notifications />}>
                          Set Alert
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading enterprise analytics...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
        <IconButton size="small" onClick={loadMockData} sx={{ ml: 1 }}>
          <Refresh />
        </IconButton>
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Enterprise Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Advanced reporting, custom dashboards, and white-label solutions
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Settings />}>
            Analytics Settings
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export All Data
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Dashboards
                  </Typography>
                  <Typography variant="h4">
                    {dashboards.length}
                  </Typography>
                </Box>
                <Dashboard color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Automated Reports
                  </Typography>
                  <Typography variant="h4">
                    {reports.filter(r => r.isActive).length}
                  </Typography>
                </Box>
                <Assessment color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    White-Label Brands
                  </Typography>
                  <Typography variant="h4">
                    {whiteLabels.length}
                  </Typography>
                </Box>
                <Palette color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} component="div">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    New Insights
                  </Typography>
                  <Typography variant="h4">
                    {insights.filter(i => !i.isRead).length}
                  </Typography>
                </Box>
                <Insights color="info" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Custom Dashboards" />
          <Tab label="Automated Reports" />
          <Tab label="White-Label Solutions" />
          <Tab label="AI Insights" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Create Dashboard Dialog */}
      <Dialog open={showDashboardDialog} onClose={() => setShowDashboardDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Custom Dashboard</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Dashboard Name"
              value={dashboardForm.name}
              onChange={(e) => setDashboardForm({ ...dashboardForm, name: e.target.value })}
              required
            />
            
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={dashboardForm.description}
              onChange={(e) => setDashboardForm({ ...dashboardForm, description: e.target.value })}
              required
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={dashboardForm.category}
                label="Category"
                onChange={(e) => setDashboardForm({ ...dashboardForm, category: e.target.value })}
              >
                <MenuItem value="executive">Executive</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="content">Content</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={dashboardForm.isPublic}
                  onChange={(e) => setDashboardForm({ ...dashboardForm, isPublic: e.target.checked })}
                />
              }
              label="Make this dashboard public to the team"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDashboardDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateDashboard} variant="contained">
            Create Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
