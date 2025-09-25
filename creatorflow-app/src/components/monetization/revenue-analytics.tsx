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
  Tooltip,
  Badge,
  Menu,
  MenuList
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  TrendingDown,
  People,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  Analytics,
  BarChart,
  PieChart,
  LineChart,
  TableChart,
  Assessment,
  Speed,
  BugReport,
  History,
  Download,
  Upload,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  Add,
  Settings,
  FilterList,
  DateRange,
  Compare,
  CompareArrows,
  Insights,
  MonetizationOn,
  Campaign,
  Notifications,
  Chat,
  VideoCall,
  Share,
  Lock,
  Public,
  PersonAdd,
  AdminPanelSettings,
  Assignment,
  Schedule,
  Comment,
  ThumbUp,
  Reply,
  Flag,
  Archive,
  Restore,
  Block,
  Unblock,
  Code,
  CopyAll,
  PlayArrow,
  Stop,
  Refresh,
  Key,
  Shield,
  Integration,
  Webhook,
  Zapier,
  Slack,
  Discord,
  GitHub,
  Google,
  Microsoft,
  Salesforce,
  HubSpot,
  Mailchimp,
  WordPress,
  Shopify,
  Stripe,
  PayPal,
  Zoom,
  Teams,
  Notion,
  Airtable,
  Trello,
  Asana,
  Jira,
  Confluence,
  Figma,
  Canva,
  Adobe,
  YouTube,
  TikTok,
  Instagram,
  Twitter,
  Facebook,
  LinkedIn,
  Pinterest,
  Snapchat,
  Twitch,
  Spotify,
  Apple,
  Amazon,
  Netflix,
  Disney,
  Hulu,
  Prime,
  HBO,
  Showtime,
  Paramount,
  Peacock,
  Discovery,
  National,
  Geographic,
  History as HistoryIcon,
  Science,
  Discovery as DiscoveryIcon,
  ID,
  TLC,
  HGTV,
  Food,
  Network,
  Travel,
  Channel,
  Animal,
  Planet,
  BBC,
  CNN,
  Fox,
  News,
  MSNBC,
  CNBC,
  Bloomberg,
  Reuters,
  Associated,
  Press,
  AP,
  Reuters as ReutersIcon,
  Bloomberg as BloombergIcon,
  MarketWatch,
  Wall,
  Street,
  Journal,
  Financial,
  Times,
  New,
  York,
  Times as TimesIcon,
  Washington,
  Post,
  Los,
  Angeles,
  Times as TimesIcon2,
  Chicago,
  Tribune,
  USA,
  Today,
  Time,
  Newsweek,
  Receipt,
  AccountBalanceWallet,
  Savings,
  CreditScore,
  Score,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  ThumbUpAlt,
  ThumbDownAlt,
  ThumbUpOffAlt,
  ThumbDownOffAlt,
  ThumbUpAltOutlined,
  ThumbDownAltOutlined,
  ThumbUpAltRounded,
  ThumbDownAltRounded,
  ThumbUpAltSharp,
  ThumbDownAltSharp,
  ThumbUpAltTwoTone,
  ThumbDownAltTwoTone,
  ThumbUpOutlined,
  ThumbDownOutlined,
  ThumbUpRounded,
  ThumbDownRounded,
  ThumbUpSharp,
  ThumbDownSharp,
  ThumbUpTwoTone,
  ThumbDownTwoTone,
  Euro,
  CurrencyPound,
  CurrencyYen,
  CurrencyRupee,
  CurrencyBitcoin,
  CurrencyExchange,
  LocalAtm,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ReceiptLong,
  ReceiptLongOutlined,
  ReceiptLongRounded,
  ReceiptLongSharp,
  ReceiptLongTwoTone,
  ReceiptOutlined,
  ReceiptRounded,
  ReceiptSharp,
  ReceiptTwoTone,
  ReceiptLongOutlined as ReceiptLongOutlinedIcon,
  ReceiptLongRounded as ReceiptLongRoundedIcon,
  ReceiptLongSharp as ReceiptLongSharpIcon,
  ReceiptLongTwoTone as ReceiptLongTwoToneIcon,
  ReceiptOutlined as ReceiptOutlinedIcon,
  ReceiptRounded as ReceiptRoundedIcon,
  ReceiptSharp as ReceiptSharpIcon,
  ReceiptTwoTone as ReceiptTwoToneIcon,
  Compare as CompareIcon,
  CompareArrows as CompareArrowsIcon,
  CompareOutlined,
  CompareRounded,
  CompareSharp,
  CompareTwoTone,
  CompareArrowsOutlined,
  CompareArrowsRounded,
  CompareArrowsSharp,
  CompareArrowsTwoTone,
  CompareArrowsOutlined as CompareArrowsOutlinedIcon,
  CompareArrowsRounded as CompareArrowsRoundedIcon,
  CompareArrowsSharp as CompareArrowsSharpIcon,
  CompareArrowsTwoTone as CompareArrowsTwoToneIcon,
  CompareOutlined as CompareOutlinedIcon,
  CompareRounded as CompareRoundedIcon,
  CompareSharp as CompareSharpIcon,
  CompareTwoTone as CompareTwoToneIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  MonetizationOn as MonetizationOnIcon,
  Campaign as CampaignIcon,
  Insights as InsightsIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  VideoCall as VideoCallIcon,
  Share as ShareIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  PersonAdd as PersonAddIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon2,
  Reply as ReplyIcon,
  Flag as FlagIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  Block as BlockIcon,
  Unblock as UnblockIcon,
  Code as CodeIcon,
  CopyAll as CopyAllIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Key as KeyIcon,
  Shield as ShieldIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  BugReport as BugReportIcon,
  History as HistoryIcon2,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Integration as IntegrationIcon,
  Webhook as WebhookIcon,
  Zapier as ZapierIcon,
  Slack as SlackIcon,
  Discord as DiscordIcon,
  GitHub as GitHubIcon,
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Salesforce as SalesforceIcon,
  HubSpot as HubSpotIcon,
  Mailchimp as MailchimpIcon,
  WordPress as WordPressIcon,
  Shopify as ShopifyIcon,
  Stripe as StripeIcon,
  PayPal as PayPalIcon,
  Zoom as ZoomIcon,
  Teams as TeamsIcon,
  Notion as NotionIcon,
  Airtable as AirtableIcon,
  Trello as TrelloIcon,
  Asana as AsanaIcon,
  Jira as JiraIcon,
  Confluence as ConfluenceIcon,
  Figma as FigmaIcon,
  Canva as CanvaIcon,
  Adobe as AdobeIcon,
  YouTube as YouTubeIcon,
  TikTok as TikTokIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Pinterest as PinterestIcon,
  Snapchat as SnapchatIcon,
  Twitch as TwitchIcon,
  Spotify as SpotifyIcon,
  Apple as AppleIcon,
  Amazon as AmazonIcon,
  Netflix as NetflixIcon,
  Disney as DisneyIcon,
  Hulu as HuluIcon,
  Prime as PrimeIcon,
  HBO as HBOIcon,
  Showtime as ShowtimeIcon,
  Paramount as ParamountIcon,
  Peacock as PeacockIcon,
  Discovery as DiscoveryIcon2,
  National as NationalIcon,
  Geographic as GeographicIcon,
  History as HistoryIcon3,
  Science as ScienceIcon,
  Discovery as DiscoveryIcon3,
  ID as IDIcon,
  TLC as TLCIcon,
  HGTV as HGTVIcon,
  Food as FoodIcon,
  Network as NetworkIcon,
  Travel as TravelIcon,
  Channel as ChannelIcon,
  Animal as AnimalIcon,
  Planet as PlanetIcon,
  BBC as BBCIcon,
  CNN as CNNIcon,
  Fox as FoxIcon,
  News as NewsIcon,
  MSNBC as MSNBCIcon,
  CNBC as CNBCIcon,
  Bloomberg as BloombergIcon2,
  Reuters as ReutersIcon2,
  Associated as AssociatedIcon,
  Press as PressIcon,
  AP as APIcon,
  Reuters as ReutersIcon3,
  Bloomberg as BloombergIcon3,
  MarketWatch as MarketWatchIcon,
  Wall as WallIcon,
  Street as StreetIcon,
  Journal as JournalIcon,
  Financial as FinancialIcon,
  Times as TimesIcon3,
  New as NewIcon,
  York as YorkIcon,
  Times as TimesIcon4,
  Washington as WashingtonIcon,
  Post as PostIcon,
  Los as LosIcon,
  Angeles as AngelesIcon,
  Times as TimesIcon5,
  Chicago as ChicagoIcon,
  Tribune as TribuneIcon,
  USA as USAIcon,
  Today as TodayIcon,
  Time as TimeIcon,
  Newsweek as NewsweekIcon,
  Public as USIcon,
} from '@mui/icons-material';

interface RevenueMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
  currency?: string;
}

interface RevenueSource {
  id: string;
  name: string;
  revenue: number;
  percentage: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  currency: string;
}

interface RevenueForecast {
  id: string;
  period: string;
  predicted: number;
  actual: number;
  confidence: number;
  currency: string;
}

const revenueMetrics: RevenueMetric[] = [
  {
    id: '1',
    name: 'Total Revenue',
    value: 125000,
    change: 12.5,
    trend: 'up',
    period: 'vs last month',
    target: 150000,
    status: 'good',
    currency: 'USD'
  },
  {
    id: '2',
    name: 'Monthly Recurring Revenue',
    value: 15750,
    change: 8.3,
    trend: 'up',
    period: 'vs last month',
    target: 20000,
    status: 'warning',
    currency: 'USD'
  },
  {
    id: '3',
    name: 'Average Revenue Per User',
    value: 79.6,
    change: 5.1,
    trend: 'up',
    period: 'vs last month',
    target: 100,
    status: 'warning',
    currency: 'USD'
  },
  {
    id: '4',
    name: 'Customer Lifetime Value',
    value: 2487,
    change: 18.7,
    trend: 'up',
    period: 'vs last month',
    target: 3000,
    status: 'good',
    currency: 'USD'
  },
  {
    id: '5',
    name: 'Churn Rate',
    value: 3.2,
    change: -0.8,
    trend: 'down',
    period: 'vs last month',
    target: 5,
    status: 'good'
  },
  {
    id: '6',
    name: 'Revenue Growth Rate',
    value: 15.8,
    change: 2.3,
    trend: 'up',
    period: 'vs last month',
    target: 20,
    status: 'warning'
  }
];

const revenueSources: RevenueSource[] = [
  {
    id: '1',
    name: 'Creator Plan',
    revenue: 4750,
    percentage: 30.2,
    change: 12.5,
    trend: 'up',
    currency: 'USD'
  },
  {
    id: '2',
    name: 'Pro Plan',
    revenue: 2450,
    percentage: 15.6,
    change: 8.3,
    trend: 'up',
    currency: 'USD'
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    revenue: 1980,
    percentage: 12.6,
    change: 15.2,
    trend: 'up',
    currency: 'USD'
  },
  {
    id: '4',
    name: 'One-time Purchases',
    revenue: 1200,
    percentage: 7.6,
    change: -2.1,
    trend: 'down',
    currency: 'USD'
  },
  {
    id: '5',
    name: 'Add-ons',
    revenue: 800,
    percentage: 5.1,
    change: 25.3,
    trend: 'up',
    currency: 'USD'
  }
];

const revenueForecasts: RevenueForecast[] = [
  {
    id: '1',
    period: 'Next Month',
    predicted: 18000,
    actual: 0,
    confidence: 85,
    currency: 'USD'
  },
  {
    id: '2',
    period: 'Next Quarter',
    predicted: 55000,
    actual: 0,
    confidence: 78,
    currency: 'USD'
  },
  {
    id: '3',
    period: 'Next Year',
    predicted: 220000,
    actual: 0,
    confidence: 65,
    currency: 'USD'
  }
];

export default function RevenueAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSource, setSelectedSource] = useState<RevenueSource | null>(null);
  const [showSourceDialog, setShowSourceDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState('30d');

  const handleSourceClick = (source: RevenueSource) => {
    setSelectedSource(source);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'critical': return <Warning color="error" />;
      default: return <Info color="disabled" />;
    }
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

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
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
          Revenue Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Analyze revenue performance and growth trends
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Track revenue metrics, analyze growth patterns, and forecast future performance.
          </Typography>
        </Alert>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Revenue Overview</Typography>
          <FormControl size="small">
            <InputLabel>Date Range</InputLabel>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="7d">Last 7 days</MenuItem>
              <MenuItem value="30d">Last 30 days</MenuItem>
              <MenuItem value="90d">Last 90 days</MenuItem>
              <MenuItem value="1y">Last year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Overview" />
          <Tab label="Revenue Sources" />
          <Tab label="Growth Analysis" />
          <Tab label="Forecasting" />
          <Tab label="Reports" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Revenue Metrics
            </Typography>
            
            <Grid container spacing={3}>
              {revenueMetrics.map((metric) => (
                <Grid item xs={12} sm={6} md={4} key={metric.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                          {metric.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {getStatusIcon(metric.status)}
                          {getTrendIcon(metric.trend)}
                        </Box>
                      </Box>
                      
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {metric.currency ? formatAmount(metric.value, metric.currency) : `${metric.value}%`}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: getTrendColor(metric.trend) }}
                        >
                          {metric.change > 0 ? '+' : ''}{metric.change}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {metric.period}
                        </Typography>
                      </Box>
                      
                      {metric.target && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Target: {metric.currency ? formatAmount(metric.target, metric.currency) : `${metric.target}%`}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(metric.value / metric.target) * 100}
                            sx={{ height: 4, borderRadius: 2, flex: 1 }}
                          />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Revenue Chart Placeholder */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trends
              </Typography>
              <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Revenue trends chart would be rendered here
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Revenue Sources Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revenue by Source
            </Typography>
            
            <Grid container spacing={3}>
              {revenueSources.map((source) => (
                <Grid item xs={12} sm={6} md={4} key={source.id}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleSourceClick(source)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">
                          {source.name}
                        </Typography>
                        {getTrendIcon(source.trend)}
                      </Box>
                      
                      <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                        {formatAmount(source.revenue, source.currency)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: getTrendColor(source.trend) }}
                        >
                          {source.change > 0 ? '+' : ''}{source.change}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          vs last month
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {source.percentage}% of total revenue
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={source.percentage}
                          sx={{ height: 4, borderRadius: 2, flex: 1 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Growth Analysis Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Growth Analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue Growth by Month
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="June 2024"
                          secondary="+15.8% growth"
                        />
                        <Typography variant="h6" color="success.main">
                          +15.8%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="May 2024"
                          secondary="+12.3% growth"
                        />
                        <Typography variant="h6" color="success.main">
                          +12.3%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="April 2024"
                          secondary="+8.7% growth"
                        />
                        <Typography variant="h6" color="success.main">
                          +8.7%
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Customer Growth
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="New Customers"
                          secondary="This month"
                        />
                        <Typography variant="h6" color="primary">
                          245
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Churned Customers"
                          secondary="This month"
                        />
                        <Typography variant="h6" color="error.main">
                          32
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Net Growth"
                          secondary="This month"
                        />
                        <Typography variant="h6" color="success.main">
                          +213
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Forecasting Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revenue Forecasting
            </Typography>
            
            <Grid container spacing={3}>
              {revenueForecasts.map((forecast) => (
                <Grid item xs={12} md={4} key={forecast.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {forecast.period}
                      </Typography>
                      
                      <Typography variant="h4" color="primary" sx={{ mb: 2 }}>
                        {formatAmount(forecast.predicted, forecast.currency)}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Confidence Level
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={forecast.confidence}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {forecast.confidence}% confidence
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        Based on historical data and growth trends
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Reports Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revenue Reports
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BarChart color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Monthly Revenue Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Comprehensive monthly revenue analysis with breakdowns by plan and source.
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Growth Analysis Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Detailed growth analysis with trends and forecasting insights.
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download Excel
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PieChart color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Revenue Source Breakdown</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Revenue breakdown by source, plan, and customer segment.
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download CSV
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Assessment color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Financial Summary</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      High-level financial summary with key metrics and KPIs.
                    </Typography>
                    <Button variant="outlined" startIcon={<Download />}>
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Source Dialog */}
      <Dialog open={showSourceDialog} onClose={() => setShowSourceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Revenue Source Details</DialogTitle>
        <DialogContent>
          {selectedSource && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedSource.name}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Revenue
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatAmount(selectedSource.revenue, selectedSource.currency)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Percentage
                  </Typography>
                  <Typography variant="h6">
                    {selectedSource.percentage}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Change
                  </Typography>
                  <Typography variant="body2" sx={{ color: getTrendColor(selectedSource.trend) }}>
                    {selectedSource.change > 0 ? '+' : ''}{selectedSource.change}%
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trend
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {selectedSource.trend}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSourceDialog(false)}>Close</Button>
          <Button variant="contained">View Details</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuList>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Download />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}
