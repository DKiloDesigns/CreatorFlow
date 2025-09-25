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
  MenuList,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormControl as MUIFormControl,
  FormLabel
} from '@mui/material';
import {
  Receipt,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  People,
  CreditCard,
  Payment,
  AccountBalance,
  Apple,
  Google,
  PayPal,
  Stripe,
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
  Info,
  ExpandMore,
  Business,
  Security,
  Timeline,
  MonetizationOn,
  Campaign,
  Insights,
  Notifications,
  Chat,
  VideoCall,
  Share,
  Lock,
  Public,
  PersonAdd,
  Settings,
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
  Speed,
  Analytics,
  BugReport,
  History,
  Download,
  Upload,
  Integration,
  Webhook,
  Zapier,
  Slack,
  Discord,
  GitHub,
  Google as GoogleIcon,
  Microsoft,
  Salesforce,
  HubSpot,
  Mailchimp,
  WordPress,
  Shopify,
  Stripe as StripeIcon,
  PayPal as PayPalIcon,
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
  Apple as AppleIcon,
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
  AccountBalanceWallet,
  Savings,
  CreditScore,
  Score,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
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
  Compare,
  CompareArrows,
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
  Cancel,
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
  ThumbUp as ThumbUpIcon,
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
  Google as GoogleIcon2,
  Microsoft as MicrosoftIcon,
  Salesforce as SalesforceIcon,
  HubSpot as HubSpotIcon,
  Mailchimp as MailchimpIcon,
  WordPress as WordPressIcon,
  Shopify as ShopifyIcon,
  Stripe as StripeIcon2,
  PayPal as PayPalIcon2,
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
  Apple as AppleIcon2,
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

interface BillingMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  currency?: string;
}

interface BillingEvent {
  id: string;
  type: 'payment' | 'refund' | 'subscription' | 'invoice' | 'failed_payment';
  description: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed' | 'cancelled';
  timestamp: string;
  customerId: string;
  subscriptionId?: string;
}

interface BillingSummary {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  conversionRate: number;
  refundRate: number;
}

const billingMetrics: BillingMetric[] = [
  {
    id: '1',
    name: 'Total Revenue',
    value: 125000,
    change: 12.5,
    trend: 'up',
    period: 'vs last month',
    currency: 'USD'
  },
  {
    id: '2',
    name: 'Monthly Recurring Revenue',
    value: 15750,
    change: 8.3,
    trend: 'up',
    period: 'vs last month',
    currency: 'USD'
  },
  {
    id: '3',
    name: 'Active Subscriptions',
    value: 1570,
    change: 15.2,
    trend: 'up',
    period: 'vs last month'
  },
  {
    id: '4',
    name: 'Churn Rate',
    value: 3.2,
    change: -0.8,
    trend: 'down',
    period: 'vs last month'
  },
  {
    id: '5',
    name: 'Average Revenue Per User',
    value: 79.6,
    change: 5.1,
    trend: 'up',
    period: 'vs last month',
    currency: 'USD'
  },
  {
    id: '6',
    name: 'Customer Lifetime Value',
    value: 2487,
    change: 18.7,
    trend: 'up',
    period: 'vs last month',
    currency: 'USD'
  }
];

const billingEvents: BillingEvent[] = [
  {
    id: '1',
    type: 'payment',
    description: 'Creator Plan - Monthly Subscription',
    amount: 19.00,
    currency: 'USD',
    status: 'success',
    timestamp: '2024-06-20T10:30:00Z',
    customerId: 'cus_1234567890',
    subscriptionId: 'sub_1234567890'
  },
  {
    id: '2',
    type: 'subscription',
    description: 'Pro Plan - New Subscription',
    amount: 49.00,
    currency: 'USD',
    status: 'success',
    timestamp: '2024-06-20T09:15:00Z',
    customerId: 'cus_0987654321',
    subscriptionId: 'sub_0987654321'
  },
  {
    id: '3',
    type: 'refund',
    description: 'Creator Plan - Refund Request',
    amount: -19.00,
    currency: 'USD',
    status: 'pending',
    timestamp: '2024-06-19T16:45:00Z',
    customerId: 'cus_1122334455',
    subscriptionId: 'sub_1122334455'
  },
  {
    id: '4',
    type: 'failed_payment',
    description: 'Enterprise Plan - Payment Failed',
    amount: 99.00,
    currency: 'USD',
    status: 'failed',
    timestamp: '2024-06-19T14:20:00Z',
    customerId: 'cus_5566778899',
    subscriptionId: 'sub_5566778899'
  },
  {
    id: '5',
    type: 'invoice',
    description: 'Pro Plan - Invoice Generated',
    amount: 49.00,
    currency: 'USD',
    status: 'success',
    timestamp: '2024-06-19T08:30:00Z',
    customerId: 'cus_9988776655',
    subscriptionId: 'sub_9988776655'
  }
];

const billingSummary: BillingSummary = {
  totalRevenue: 125000,
  monthlyRecurringRevenue: 15750,
  activeSubscriptions: 1570,
  churnRate: 3.2,
  averageRevenuePerUser: 79.6,
  lifetimeValue: 2487,
  conversionRate: 18.5,
  refundRate: 2.1
};

export default function BillingDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<BillingEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState('30d');

  const handleEventClick = (event: BillingEvent) => {
    setSelectedEvent(event);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'pending': return <Warning color="warning" />;
      case 'failed': return <Warning color="error" />;
      case 'cancelled': return <Info color="disabled" />;
      default: return <Info color="disabled" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'payment': return <Payment color="success" />;
      case 'refund': return <AttachMoney color="warning" />;
      case 'subscription': return <Receipt color="info" />;
      case 'invoice': return <ReceiptLong color="primary" />;
      case 'failed_payment': return <Warning color="error" />;
      default: return <Info color="disabled" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
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
          Billing Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Monitor revenue, subscriptions, and billing performance
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Track your billing metrics and manage revenue streams effectively.
          </Typography>
        </Alert>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Billing Overview</Typography>
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
          <Tab label="Revenue Analytics" />
          <Tab label="Billing Events" />
          <Tab label="Subscriptions" />
          <Tab label="Reports" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Metrics
            </Typography>
            
            <Grid container spacing={3}>
              {billingMetrics.map((metric) => (
                <Grid item xs={12} sm={6} md={4} key={metric.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                          {metric.name}
                        </Typography>
                        {getTrendIcon(metric.trend)}
                      </Box>
                      
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {metric.currency ? formatAmount(metric.value, metric.currency) : metric.value.toLocaleString()}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Revenue Chart Placeholder */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Revenue chart would be rendered here
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Revenue Analytics Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Revenue Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Revenue by Plan
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Creator Plan"
                          secondary="$4,750 (30.2%)"
                        />
                        <Typography variant="h6" color="primary">
                          $4,750
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Pro Plan"
                          secondary="$2,450 (15.6%)"
                        />
                        <Typography variant="h6" color="primary">
                          $2,450
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Enterprise Plan"
                          secondary="$1,980 (12.6%)"
                        />
                        <Typography variant="h6" color="primary">
                          $1,980
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
                      Revenue by Payment Method
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Credit Card"
                          secondary="85.2% of payments"
                        />
                        <Typography variant="h6" color="primary">
                          $10,650
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="PayPal"
                          secondary="12.8% of payments"
                        />
                        <Typography variant="h6" color="primary">
                          $1,600
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Other"
                          secondary="2.0% of payments"
                        />
                        <Typography variant="h6" color="primary">
                          $250
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Billing Events Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Recent Billing Events ({billingEvents.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getEventIcon(event.type)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {event.type.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{event.description}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="h6" 
                          color={event.amount < 0 ? 'error' : 'primary'}
                        >
                          {formatAmount(event.amount, event.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(event.status)}
                          <Typography variant="body2">{event.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {event.customerId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleEventClick(event)}>
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Subscription Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Active Subscriptions</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {billingSummary.activeSubscriptions.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +15.2% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingDown color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">Churn Rate</Typography>
                    </Box>
                    <Typography variant="h4" color="success.main">
                      {billingSummary.churnRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      -0.8% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">ARPU</Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      {formatAmount(billingSummary.averageRevenuePerUser, 'USD')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      +5.1% from last month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Reports Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Billing Reports
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Receipt color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Monthly Revenue Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Comprehensive monthly revenue analysis with breakdowns by plan and payment method.
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
                      <Analytics color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Subscription Analytics</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Detailed subscription metrics including churn, growth, and retention analysis.
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
                      <Payment color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Payment Processing Report</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Payment processing statistics and failure analysis.
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
                      <TrendingUp color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Growth Analysis</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Revenue growth trends and forecasting analysis.
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

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Billing Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="h6" color={selectedEvent.amount < 0 ? 'error' : 'primary'}>
                    {formatAmount(selectedEvent.amount, selectedEvent.currency)}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getStatusIcon(selectedEvent.status)}
                    <Typography variant="body2">{selectedEvent.status}</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Customer ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedEvent.customerId}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEventDialog(false)}>Close</Button>
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
