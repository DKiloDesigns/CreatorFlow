"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom,
  Skeleton,
  Divider,
  Stack,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Slider,
  Checkbox,
  FormGroup,
  FormLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Analytics,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  AutoAwesome,
  Psychology,
  Target,
  Speed,
  Timer,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  Refresh,
  Settings,
  ContentCopy,
  Schedule,
  CheckCircle,
  Warning,
  Error,
  Info,
  Lightbulb,
  Rocket,
  People,
  Group,
  Person,
  LocationOn,
  Work,
  School,
  Favorite,
  ThumbUp,
  Share,
  Message,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Security,
  AdminPanelSettings,
  SupervisorAccount,
  PersonAdd,
  Department,
  Business,
  Assessment,
  Insights,
  GroupAdd,
  ManageAccounts,
  VerifiedUser,
  Lock,
  Unlock,
  Search,
  Dashboard,
  DataUsage,
  MonetizationOn,
  TrendingUp as TrendingUpIcon,
  AccountBalance,
  AttachMoney,
  Euro,
  CurrencyExchange,
  ShowChart as ShowChartIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  TableChart,
  ViewModule,
  FilterList,
  Download,
  Print,
  Email,
  Share as ShareIcon,
  MoreVert,
  CalendarToday,
  AccessTime,
  LocationOn as LocationOnIcon,
  Language,
  Public,
  Flag,
  BusinessCenter,
  CorporateFare,
  Domain,
  Store,
  ShoppingCart,
  Inventory,
  LocalShipping,
  Payment,
  Receipt,
  AccountCircle,
  Notifications,
  Help,
  Info as InfoIcon
} from '@mui/icons-material';
import { designTokens } from '@/lib/design-system';

interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'marketing' | 'custom';
  isActive: boolean;
  lastUpdated: string;
  widgets: Widget[];
  permissions: string[];
  isDefault: boolean;
}

interface Widget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'gauge' | 'list';
  title: string;
  data: any;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

interface BusinessMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
  target: number;
  status: 'on-track' | 'at-risk' | 'exceeding';
  lastUpdated: string;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'performance' | 'opportunity' | 'risk' | 'trend';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'automated' | 'manual' | 'scheduled';
  schedule: string;
  recipients: string[];
  lastGenerated: string;
  nextGeneration: string;
  format: 'pdf' | 'excel' | 'csv' | 'dashboard';
  status: 'active' | 'paused' | 'error';
}

export default function EnhancedEnterpriseAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetric[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardConfig | null>(null);
  const [showDashboardDialog, setShowDashboardDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Mock dashboards
      setDashboards([
        {
          id: 'dashboard-1',
          name: 'Executive Overview',
          description: 'High-level business performance metrics for executives',
          type: 'financial',
          isActive: true,
          lastUpdated: '2024-01-15T10:30:00Z',
          widgets: [],
          permissions: ['executive', 'admin'],
          isDefault: true
        },
        {
          id: 'dashboard-2',
          name: 'Operational Excellence',
          description: 'Day-to-day operational metrics and KPIs',
          type: 'operational',
          isActive: true,
          lastUpdated: '2024-01-15T09:15:00Z',
          widgets: [],
          permissions: ['manager', 'admin'],
          isDefault: false
        },
        {
          id: 'dashboard-3',
          name: 'Marketing Performance',
          description: 'Marketing campaigns and ROI analysis',
          type: 'marketing',
          isActive: true,
          lastUpdated: '2024-01-15T11:45:00Z',
          widgets: [],
          permissions: ['marketing', 'admin'],
          isDefault: false
        },
        {
          id: 'dashboard-4',
          name: 'Custom Analytics',
          description: 'Custom dashboard for specific business needs',
          type: 'custom',
          isActive: false,
          lastUpdated: '2024-01-14T16:20:00Z',
          widgets: [],
          permissions: ['admin'],
          isDefault: false
        }
      ]);

      // Mock business metrics
      setBusinessMetrics([
        {
          id: 'metric-1',
          name: 'Revenue Growth',
          value: 1250000,
          previousValue: 1100000,
          change: 150000,
          changePercent: 13.6,
          trend: 'up',
          category: 'financial',
          target: 1200000,
          status: 'exceeding',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'metric-2',
          name: 'Customer Acquisition Cost',
          value: 45,
          previousValue: 52,
          change: -7,
          changePercent: -13.5,
          trend: 'down',
          category: 'marketing',
          target: 50,
          status: 'exceeding',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'metric-3',
          name: 'Employee Productivity',
          value: 87,
          previousValue: 84,
          change: 3,
          changePercent: 3.6,
          trend: 'up',
          category: 'operational',
          target: 85,
          status: 'on-track',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'metric-4',
          name: 'Market Share',
          value: 23.5,
          previousValue: 22.1,
          change: 1.4,
          changePercent: 6.3,
          trend: 'up',
          category: 'business',
          target: 25,
          status: 'on-track',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'metric-5',
          name: 'Customer Satisfaction',
          value: 4.6,
          previousValue: 4.5,
          change: 0.1,
          changePercent: 2.2,
          trend: 'up',
          category: 'operational',
          target: 4.5,
          status: 'exceeding',
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'metric-6',
          name: 'Inventory Turnover',
          value: 8.2,
          previousValue: 7.8,
          change: 0.4,
          changePercent: 5.1,
          trend: 'up',
          category: 'operational',
          target: 8.0,
          status: 'on-track',
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      ]);

      // Mock AI insights
      setAiInsights([
        {
          id: 'insight-1',
          title: 'Revenue Optimization Opportunity',
          description: 'AI analysis suggests 15% revenue increase potential through pricing optimization',
          category: 'opportunity',
          priority: 'high',
          confidence: 87,
          actionable: true,
          recommendations: [
            'Implement dynamic pricing for premium features',
            'Analyze customer segments for targeted pricing',
            'Optimize pricing tiers based on usage patterns'
          ],
          impact: 'high',
          timeframe: 'Q2 2024'
        },
        {
          id: 'insight-2',
          title: 'Customer Churn Risk Alert',
          description: 'Early warning signs detected for 12% of premium customers',
          category: 'risk',
          priority: 'high',
          confidence: 92,
          actionable: true,
          recommendations: [
            'Implement proactive customer success outreach',
            'Offer retention incentives for at-risk customers',
            'Analyze usage patterns to identify churn signals'
          ],
          impact: 'high',
          timeframe: 'Immediate'
        },
        {
          id: 'insight-3',
          title: 'Market Expansion Trend',
          description: 'Growing demand detected in emerging markets with 23% YoY growth',
          category: 'trend',
          priority: 'medium',
          confidence: 78,
          actionable: true,
          recommendations: [
            'Prioritize market entry into Southeast Asia',
            'Develop localized content and features',
            'Establish partnerships with local distributors'
          ],
          impact: 'medium',
          timeframe: 'Q3-Q4 2024'
        },
        {
          id: 'insight-4',
          title: 'Operational Efficiency Gains',
          description: 'AI workflow automation could reduce operational costs by 18%',
          category: 'performance',
          priority: 'medium',
          confidence: 85,
          actionable: true,
          recommendations: [
            'Implement AI-powered content automation',
            'Streamline approval workflows',
            'Automate routine reporting tasks'
          ],
          impact: 'medium',
          timeframe: 'Q2 2024'
        }
      ]);

      // Mock reports
      setReports([
        {
          id: 'report-1',
          name: 'Monthly Executive Summary',
          description: 'Comprehensive monthly business performance overview',
          type: 'automated',
          schedule: 'Monthly - 1st of month',
          recipients: ['executives@company.com', 'board@company.com'],
          lastGenerated: '2024-01-01T00:00:00Z',
          nextGeneration: '2024-02-01T00:00:00Z',
          format: 'pdf',
          status: 'active'
        },
        {
          id: 'report-2',
          name: 'Weekly Marketing Performance',
          description: 'Weekly marketing metrics and campaign performance',
          type: 'automated',
          schedule: 'Weekly - Monday 9 AM',
          recipients: ['marketing@company.com', 'sales@company.com'],
          lastGenerated: '2024-01-15T09:00:00Z',
          nextGeneration: '2024-01-22T09:00:00Z',
          format: 'dashboard',
          status: 'active'
        },
        {
          id: 'report-3',
          name: 'Quarterly Business Review',
          description: 'Quarterly business performance and strategic insights',
          type: 'scheduled',
          schedule: 'Quarterly - End of quarter',
          recipients: ['all-staff@company.com'],
          lastGenerated: '2023-12-31T00:00:00Z',
          nextGeneration: '2024-03-31T00:00:00Z',
          format: 'excel',
          status: 'active'
        },
        {
          id: 'report-4',
          name: 'Custom Market Analysis',
          description: 'Custom market research and competitive analysis',
          type: 'manual',
          schedule: 'On-demand',
          recipients: ['strategy@company.com'],
          lastGenerated: '2024-01-10T14:30:00Z',
          nextGeneration: 'N/A',
          format: 'pdf',
          status: 'active'
        }
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon sx={{ color: designTokens.colors.success[600] }} />;
      case 'down':
        return <TrendingDown sx={{ color: designTokens.colors.error[600] }} />;
      case 'stable':
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[600] }} />;
      default:
        return <TrendingFlat sx={{ color: designTokens.colors.neutral[600] }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return designTokens.colors.success[500];
      case 'at-risk':
        return designTokens.colors.warning[500];
      case 'exceeding':
        return designTokens.colors.primary[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return designTokens.colors.error[500];
      case 'medium':
        return designTokens.colors.warning[500];
      case 'low':
        return designTokens.colors.success[500];
      default:
        return designTokens.colors.neutral[500];
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'financial':
        return <MonetizationOn />;
      case 'operational':
        return <Speed />;
      case 'marketing':
        return <TrendingUp />;
      case 'business':
        return <Business />;
      default:
        return <Analytics />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const renderDashboardsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Custom Dashboards
        </Typography>
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
          <Grid item xs={12} md={6} lg={4} key={dashboard.id}>
            <Card 
              elevation={0} 
              sx={{ 
                border: `1px solid ${designTokens.colors.neutral[200]}`,
                borderRadius: designTokens.borderRadius.lg,
                cursor: 'pointer',
                transition: designTokens.animation.micro.cardHover,
                '&:hover': {
                  boxShadow: designTokens.shadows.lg,
                  borderColor: designTokens.colors.primary[300]
                }
              }}
              onClick={() => setSelectedDashboard(dashboard)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {dashboard.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {dashboard.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={dashboard.type}
                      size="small"
                      sx={{
                        background: designTokens.colors.primary[100],
                        color: designTokens.colors.primary[700],
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mb: 1
                      }}
                    />
                    {dashboard.isDefault && (
                      <Chip
                        label="Default"
                        size="small"
                        sx={{
                          background: designTokens.colors.success[100],
                          color: designTokens.colors.success[700],
                          fontWeight: 'medium'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Last updated: {new Date(dashboard.lastUpdated).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Widgets: {dashboard.widgets.length}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    Permissions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {dashboard.permissions.slice(0, 2).map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[700],
                          fontSize: '0.7rem'
                        }}
                      />
                    ))}
                    {dashboard.permissions.length > 2 && (
                      <Chip
                        label={`+${dashboard.permissions.length - 2} more`}
                        size="small"
                        sx={{
                          background: designTokens.colors.neutral[100],
                          color: designTokens.colors.neutral[600],
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Share />
                  </IconButton>
                  {!dashboard.isDefault && (
                    <IconButton size="small" sx={{ color: designTokens.colors.error[600] }}>
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderBusinessMetricsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Business Metrics & KPIs
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {businessMetrics.map((metric) => (
          <Grid item xs={12} md={6} lg={4} key={metric.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getCategoryIcon(metric.category)}
                    <Box>
                      <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                        {metric.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                        {metric.category}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {getTrendIcon(metric.trend)}
                    <Chip
                      label={metric.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(metric.status)}15`,
                        color: getStatusColor(metric.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mt: 1
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" sx={{ color: designTokens.colors.neutral[900], fontWeight: 'bold' }}>
                    {metric.category === 'financial' ? formatCurrency(metric.value) : metric.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: metric.change >= 0 ? designTokens.colors.success[600] : designTokens.colors.error[600],
                        fontWeight: 'medium'
                      }}
                    >
                      {formatPercentage(metric.changePercent)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      vs previous period
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Target: {metric.category === 'financial' ? formatCurrency(metric.target) : metric.target}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {((metric.value / metric.target) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((metric.value / metric.target) * 100, 100)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: designTokens.colors.neutral[200],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getStatusColor(metric.status),
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: designTokens.colors.neutral[500] }}>
                  Last updated: {new Date(metric.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderAIInsightsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, color: designTokens.colors.neutral[800] }}>
        AI-Powered Business Insights
      </Typography>

      <Grid container spacing={3}>
        {aiInsights.map((insight) => (
          <Grid item xs={12} md={6} key={insight.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {insight.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={insight.priority}
                      size="small"
                      sx={{
                        background: `${getPriorityColor(insight.priority)}15`,
                        color: getPriorityColor(insight.priority),
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mb: 1
                      }}
                    />
                    <Chip
                      label={`${insight.confidence}%`}
                      size="small"
                      sx={{
                        background: designTokens.colors.ai[100],
                        color: designTokens.colors.ai[700],
                        fontWeight: 'medium'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Chip
                      icon={<Psychology />}
                      label={insight.category}
                      size="small"
                      sx={{
                        background: designTokens.colors.primary[100],
                        color: designTokens.colors.primary[700],
                        textTransform: 'capitalize'
                      }}
                    />
                    <Chip
                      label={insight.impact}
                      size="small"
                      sx={{
                        background: designTokens.colors.warning[100],
                        color: designTokens.colors.warning[700],
                        textTransform: 'capitalize'
                      }}
                    />
                    <Chip
                      label={insight.timeframe}
                      size="small"
                      sx={{
                        background: designTokens.colors.neutral[100],
                        color: designTokens.colors.neutral[700]
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: designTokens.colors.neutral[700], mb: 1 }}>
                    AI Recommendations
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {insight.recommendations.map((recommendation, index) => (
                      <Typography key={index} variant="body2" sx={{ color: designTokens.colors.neutral[600], fontSize: '0.875rem', mb: 0.5 }}>
                        • {recommendation}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Lightbulb />}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Share />}
                  >
                    Share
                  </Button>
                  {insight.actionable && (
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Rocket />}
                    >
                      Take Action
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderReportsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
          Automated Reports & Analytics
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowReportDialog(true)}
        >
          Create Report
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report.id}>
            <Card elevation={0} sx={{ border: `1px solid ${designTokens.colors.neutral[200]}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: designTokens.colors.neutral[800] }}>
                      {report.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      {report.description}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip
                      label={report.type}
                      size="small"
                      sx={{
                        background: designTokens.colors.primary[100],
                        color: designTokens.colors.primary[700],
                        fontWeight: 'medium',
                        textTransform: 'capitalize',
                        mb: 1
                      }}
                    />
                    <Chip
                      label={report.status}
                      size="small"
                      sx={{
                        background: `${getStatusColor(report.status)}15`,
                        color: getStatusColor(report.status),
                        fontWeight: 'medium',
                        textTransform: 'capitalize'
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Schedule: {report.schedule}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Format: {report.format.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Recipients: {report.recipients.length}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                    Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                  </Typography>
                  {report.nextGeneration !== 'N/A' && (
                    <Typography variant="body2" sx={{ color: designTokens.colors.neutral[600] }}>
                      Next: {new Date(report.nextGeneration).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small" sx={{ color: designTokens.colors.primary[600] }}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Download />
                  </IconButton>
                  <IconButton size="small" sx={{ color: designTokens.colors.neutral[600] }}>
                    <Share />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} />
        <Skeleton variant="text" width="40%" height={24} />
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item}>
                <Skeleton variant="rectangular" height={300} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: designTokens.colors.primary[600]
            }}
          >
            <Analytics sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.neutral[900],
                mb: 1
              }}
            >
              Enhanced Enterprise Analytics
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: designTokens.colors.neutral[600],
                fontWeight: designTokens.typography.fontWeight.normal
              }}
            >
              Advanced business intelligence with AI-powered insights and custom dashboards
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* AI Status Alert */}
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4,
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
          border: `1px solid ${designTokens.colors.primary[200]}`,
          borderRadius: designTokens.borderRadius.lg
        }}
      >
        <AlertTitle sx={{ color: designTokens.colors.primary[700] }}>
          🧠 AI Business Intelligence Active
        </AlertTitle>
        <Typography variant="body2" sx={{ color: designTokens.colors.primary[700] }}>
          Your AI system has analyzed {businessMetrics.length} business metrics and generated {aiInsights.length} actionable insights. 
          Current AI confidence: 85.5%. AI is continuously monitoring business performance and identifying opportunities.
        </Typography>
      </Alert>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Custom Dashboards" />
          <Tab label="Business Metrics" />
          <Tab label="AI Insights" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && renderDashboardsTab()}
      {activeTab === 1 && renderBusinessMetricsTab()}
      {activeTab === 2 && renderAIInsightsTab()}
      {activeTab === 3 && renderReportsTab()}

      {/* Create Dashboard Dialog */}
      <Dialog open={showDashboardDialog} onClose={() => setShowDashboardDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Custom Dashboard</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Dashboard Name"
            placeholder="Enter dashboard name"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter dashboard description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Dashboard Type</InputLabel>
            <Select label="Dashboard Type">
              <MenuItem value="financial">Financial</MenuItem>
              <MenuItem value="operational">Operational</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Default Permissions</InputLabel>
            <Select label="Default Permissions" multiple>
              <MenuItem value="executive">Executive</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDashboardDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowDashboardDialog(false)}>
            Create Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Automated Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Report Name"
            placeholder="Enter report name"
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            placeholder="Enter report description"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Report Type</InputLabel>
            <Select label="Report Type">
              <MenuItem value="automated">Automated</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Format</InputLabel>
            <Select label="Format">
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="dashboard">Dashboard</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowReportDialog(false)}>
            Create Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
