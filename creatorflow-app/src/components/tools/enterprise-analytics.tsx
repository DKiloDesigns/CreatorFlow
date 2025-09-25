'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  People,
  Visibility,
  ThumbUp,
  Comment,
  Share,
  Download,
  Refresh,
  Settings,
  FilterList,
  DateRange,
  BarChart,
  PieChart,
  ShowChart,
  TableChart,
  Assessment,
  Speed,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Business,
  Group,
  Security,
  Timeline,
  MonetizationOn,
  Campaign,
  Insights
} from '@mui/icons-material';

interface AnalyticsData {
  id: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  performance: number;
  contentCount: number;
  engagement: number;
}

interface CampaignData {
  id: string;
  name: string;
  platform: string;
  status: 'Active' | 'Paused' | 'Completed';
  reach: number;
  engagement: number;
  conversions: number;
  roi: number;
  startDate: string;
  endDate: string;
}

const analyticsData: AnalyticsData[] = [
  {
    id: '1',
    metric: 'Total Reach',
    value: 1250000,
    change: 12.5,
    trend: 'up',
    period: 'vs last month',
    category: 'Reach'
  },
  {
    id: '2',
    metric: 'Engagement Rate',
    value: 8.7,
    change: -2.1,
    trend: 'down',
    period: 'vs last month',
    category: 'Engagement'
  },
  {
    id: '3',
    metric: 'Content Published',
    value: 156,
    change: 23.4,
    trend: 'up',
    period: 'vs last month',
    category: 'Content'
  },
  {
    id: '4',
    metric: 'Team Productivity',
    value: 94.2,
    change: 5.8,
    trend: 'up',
    period: 'vs last month',
    category: 'Team'
  },
  {
    id: '5',
    metric: 'Revenue Generated',
    value: 45000,
    change: 18.9,
    trend: 'up',
    period: 'vs last month',
    category: 'Revenue'
  },
  {
    id: '6',
    metric: 'Cost per Acquisition',
    value: 12.50,
    change: -8.3,
    trend: 'up',
    period: 'vs last month',
    category: 'Cost'
  }
];

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Content Manager',
    avatar: '/avatars/sarah.jpg',
    performance: 95,
    contentCount: 45,
    engagement: 8.9
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'Social Media Specialist',
    avatar: '/avatars/mike.jpg',
    performance: 88,
    contentCount: 38,
    engagement: 7.2
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Creative Director',
    avatar: '/avatars/emily.jpg',
    performance: 92,
    contentCount: 42,
    engagement: 9.1
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Analytics Specialist',
    avatar: '/avatars/david.jpg',
    performance: 90,
    contentCount: 31,
    engagement: 8.5
  }
];

const campaignData: CampaignData[] = [
  {
    id: '1',
    name: 'Summer Product Launch',
    platform: 'Instagram',
    status: 'Active',
    reach: 250000,
    engagement: 12.5,
    conversions: 1250,
    roi: 340,
    startDate: '2024-06-01',
    endDate: '2024-08-31'
  },
  {
    id: '2',
    name: 'Brand Awareness Campaign',
    platform: 'TikTok',
    status: 'Active',
    reach: 180000,
    engagement: 15.2,
    conversions: 890,
    roi: 280,
    startDate: '2024-05-15',
    endDate: '2024-07-15'
  },
  {
    id: '3',
    name: 'Holiday Promotion',
    platform: 'Facebook',
    status: 'Completed',
    reach: 320000,
    engagement: 9.8,
    conversions: 2100,
    roi: 420,
    startDate: '2024-11-01',
    endDate: '2024-12-31'
  }
];

export default function EnterpriseAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['Reach', 'Engagement', 'Content', 'Team']);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handleExport = () => {
    // Simulate export process
    setShowExportDialog(false);
    // Export logic would go here
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      default: return <TrendingUp color="disabled" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success.main';
      case 'down': return 'error.main';
      default: return 'text.secondary';
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric.includes('Rate') || metric.includes('Productivity')) {
      return `${value}%`;
    }
    if (metric.includes('Revenue') || metric.includes('Reach')) {
      return value.toLocaleString();
    }
    if (metric.includes('Cost')) {
      return `$${value}`;
    }
    return value.toString();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{
          background: 'linear-gradient(45deg, #0066CC, #00CC66)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          Enterprise Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Advanced analytics and reporting for enterprise teams
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Comprehensive insights across all platforms, team performance, and business metrics.
          </Typography>
        </Alert>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="1y">Last year</MenuItem>
                <MenuItem value="custom">Custom range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Select Metrics to Display
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['Reach', 'Engagement', 'Content', 'Team', 'Revenue', 'Cost'].map((metric) => (
                <Chip
                  key={metric}
                  label={metric}
                  clickable
                  color={selectedMetrics.includes(metric) ? 'primary' : 'default'}
                  onClick={() => handleMetricToggle(metric)}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={() => setShowExportDialog(true)}
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Team Performance" />
          <Tab label="Campaign Analytics" />
          <Tab label="Custom Reports" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Performance Indicators
            </Typography>
            
            <Grid container spacing={3}>
              {analyticsData
                .filter(data => selectedMetrics.includes(data.category))
                .map((data) => (
                <Grid item xs={12} sm={6} md={4} key={data.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                          {data.metric}
                        </Typography>
                        {getTrendIcon(data.trend)}
                      </Box>
                      
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {formatValue(data.value, data.metric)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: getTrendColor(data.trend) }}
                        >
                          {data.change > 0 ? '+' : ''}{data.change}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {data.period}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <ShowChart color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Engagement Over Time</Typography>
                      </Box>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Interactive chart would be rendered here
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PieChart color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6">Platform Distribution</Typography>
                      </Box>
                      <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Pie chart would be rendered here
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Team Performance Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Team Performance Metrics
            </Typography>
            
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Team Member</TableCell>
                    <TableCell align="right">Performance</TableCell>
                    <TableCell align="right">Content Count</TableCell>
                    <TableCell align="right">Avg. Engagement</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={member.avatar} />
                          <Box>
                            <Typography variant="subtitle2">{member.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {member.role}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Typography variant="body2">{member.performance}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={member.performance}
                            sx={{ width: 60, height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">{member.contentCount}</TableCell>
                      <TableCell align="right">{member.engagement}%</TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <Settings />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Campaign Analytics Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Campaign Performance
            </Typography>
            
            <Grid container spacing={3}>
              {campaignData.map((campaign) => (
                <Grid item xs={12} md={6} lg={4} key={campaign.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{campaign.name}</Typography>
                        <Chip
                          label={campaign.status}
                          color={campaign.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {campaign.platform} • {campaign.startDate} - {campaign.endDate}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Reach
                          </Typography>
                          <Typography variant="h6">
                            {campaign.reach.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Engagement
                          </Typography>
                          <Typography variant="h6">
                            {campaign.engagement}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Conversions
                          </Typography>
                          <Typography variant="h6">
                            {campaign.conversions.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            ROI
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {campaign.roi}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Custom Reports Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Custom Reports
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Assessment color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Monthly Performance Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Comprehensive monthly analysis of all metrics and KPIs
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Campaign color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Campaign ROI Analysis</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Detailed ROI analysis for all active campaigns
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Group color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Team Performance Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Individual and team performance metrics
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Insights color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Custom Analytics</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Create custom reports with your own metrics
                    </Typography>
                    <Button variant="outlined" startIcon={<Add />}>
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onClose={() => setShowExportDialog(false)}>
        <DialogTitle>Export Analytics</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Export Format</InputLabel>
            <Select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <MenuItem value="pdf">PDF Report</MenuItem>
              <MenuItem value="excel">Excel Spreadsheet</MenuItem>
              <MenuItem value="csv">CSV Data</MenuItem>
              <MenuItem value="json">JSON Data</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleExport}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
