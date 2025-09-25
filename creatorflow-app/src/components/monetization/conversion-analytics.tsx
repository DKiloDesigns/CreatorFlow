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
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
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
  Refresh,
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

interface ConversionMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

interface ConversionFunnel {
  id: string;
  name: string;
  steps: {
    name: string;
    visitors: number;
    conversions: number;
    rate: number;
  }[];
  totalVisitors: number;
  totalConversions: number;
  overallRate: number;
}

interface ConversionEvent {
  id: string;
  type: 'signup' | 'trial_start' | 'trial_end' | 'subscription' | 'upgrade' | 'downgrade' | 'churn';
  description: string;
  userId: string;
  planId?: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  source: string;
  metadata: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
  };
}

const conversionMetrics: ConversionMetric[] = [
  {
    id: '1',
    name: 'Free to Paid Conversion',
    value: 18.5,
    change: 2.3,
    trend: 'up',
    period: 'vs last month',
    target: 20,
    status: 'good'
  },
  {
    id: '2',
    name: 'Trial to Paid Conversion',
    value: 35.2,
    change: -1.8,
    trend: 'down',
    period: 'vs last month',
    target: 40,
    status: 'warning'
  },
  {
    id: '3',
    name: 'Upgrade Rate',
    value: 12.7,
    change: 5.4,
    trend: 'up',
    period: 'vs last month',
    target: 15,
    status: 'good'
  },
  {
    id: '4',
    name: 'Churn Rate',
    value: 3.2,
    change: -0.8,
    trend: 'down',
    period: 'vs last month',
    target: 5,
    status: 'good'
  },
  {
    id: '5',
    name: 'Average Time to Convert',
    value: 14.5,
    change: -2.1,
    trend: 'down',
    period: 'vs last month',
    target: 10,
    status: 'warning'
  },
  {
    id: '6',
    name: 'Revenue per Visitor',
    value: 2.45,
    change: 8.9,
    trend: 'up',
    period: 'vs last month',
    target: 3,
    status: 'good'
  }
];

const conversionFunnels: ConversionFunnel[] = [
  {
    id: '1',
    name: 'Free to Paid Conversion',
    steps: [
      { name: 'Landing Page', visitors: 10000, conversions: 8500, rate: 85.0 },
      { name: 'Sign Up', visitors: 8500, conversions: 4200, rate: 49.4 },
      { name: 'Trial Start', visitors: 4200, conversions: 3800, rate: 90.5 },
      { name: 'Trial End', visitors: 3800, conversions: 1200, rate: 31.6 },
      { name: 'Subscription', visitors: 1200, conversions: 1100, rate: 91.7 }
    ],
    totalVisitors: 10000,
    totalConversions: 1100,
    overallRate: 11.0
  },
  {
    id: '2',
    name: 'Creator to Pro Upgrade',
    steps: [
      { name: 'Creator Plan', visitors: 5000, conversions: 4500, rate: 90.0 },
      { name: 'Feature Usage', visitors: 4500, conversions: 3200, rate: 71.1 },
      { name: 'Upgrade Prompt', visitors: 3200, conversions: 800, rate: 25.0 },
      { name: 'Pro Plan', visitors: 800, conversions: 650, rate: 81.3 }
    ],
    totalVisitors: 5000,
    totalConversions: 650,
    overallRate: 13.0
  }
];

const conversionEvents: ConversionEvent[] = [
  {
    id: '1',
    type: 'subscription',
    description: 'User subscribed to Creator Plan',
    userId: 'user_1234567890',
    planId: 'plan_creator',
    amount: 19.00,
    currency: 'USD',
    timestamp: '2024-06-20T10:30:00Z',
    source: 'organic',
    metadata: {
      utm_source: 'google',
      utm_medium: 'search',
      utm_campaign: 'branded',
      referrer: 'https://google.com'
    }
  },
  {
    id: '2',
    type: 'upgrade',
    description: 'User upgraded from Creator to Pro Plan',
    userId: 'user_0987654321',
    planId: 'plan_pro',
    amount: 49.00,
    currency: 'USD',
    timestamp: '2024-06-20T09:15:00Z',
    source: 'email',
    metadata: {
      utm_source: 'email',
      utm_medium: 'newsletter',
      utm_campaign: 'upgrade_prompt',
      referrer: 'https://creatorflow.com/email'
    }
  },
  {
    id: '3',
    type: 'trial_start',
    description: 'User started free trial',
    userId: 'user_1122334455',
    planId: 'plan_creator',
    timestamp: '2024-06-19T16:45:00Z',
    source: 'social',
    metadata: {
      utm_source: 'twitter',
      utm_medium: 'social',
      utm_campaign: 'content_creator',
      referrer: 'https://twitter.com'
    }
  },
  {
    id: '4',
    type: 'churn',
    description: 'User cancelled subscription',
    userId: 'user_5566778899',
    planId: 'plan_creator',
    timestamp: '2024-06-19T14:20:00Z',
    source: 'direct',
    metadata: {
      referrer: 'https://creatorflow.com'
    }
  }
];

export default function ConversionAnalytics() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<ConversionEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState('30d');

  const handleEventClick = (event: ConversionEvent) => {
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

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'signup': return <PersonAdd color="success" />;
      case 'trial_start': return <PlayArrow color="info" />;
      case 'trial_end': return <Stop color="warning" />;
      case 'subscription': return <CheckCircle color="success" />;
      case 'upgrade': return <TrendingUp color="success" />;
      case 'downgrade': return <TrendingDown color="warning" />;
      case 'churn': return <Cancel color="error" />;
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
          Conversion Analytics
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Track and optimize your conversion rates and user journey
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Monitor conversion funnels, identify bottlenecks, and optimize user experience.
          </Typography>
        </Alert>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Conversion Overview</Typography>
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
          <Tab label="Conversion Funnels" />
          <Tab label="Events" />
          <Tab label="A/B Tests" />
          <Tab label="Optimization" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Key Conversion Metrics
            </Typography>
            
            <Grid container spacing={3}>
              {conversionMetrics.map((metric) => (
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
                        {metric.value}%
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
                            Target: {metric.target}%
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

            {/* Conversion Chart Placeholder */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Conversion Trends
              </Typography>
              <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Conversion trends chart would be rendered here
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Conversion Funnels Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Conversion Funnels
            </Typography>
            
            <Grid container spacing={3}>
              {conversionFunnels.map((funnel) => (
                <Grid item xs={12} md={6} key={funnel.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {funnel.name}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Overall Conversion Rate: {funnel.overallRate}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={funnel.overallRate}
                          sx={{ height: 8, borderRadius: 4, mt: 1 }}
                        />
                      </Box>
                      
                      <List dense>
                        {funnel.steps.map((step, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={step.name}
                              secondary={`${step.conversions.toLocaleString()} / ${step.visitors.toLocaleString()} (${step.rate}%)`}
                            />
                            <Box sx={{ minWidth: 100 }}>
                              <LinearProgress
                                variant="determinate"
                                value={step.rate}
                                sx={{ height: 6, borderRadius: 3 }}
                              />
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Events Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Conversion Events ({conversionEvents.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conversionEvents.map((event) => (
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
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {event.userId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {event.amount ? (
                          <Typography variant="h6" color="primary">
                            {formatAmount(event.amount, event.currency || 'USD')}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            N/A
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={event.source} size="small" />
                      </TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleDateString()}
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

        {/* A/B Tests Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              A/B Tests
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Pricing Page Test
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Testing different pricing page layouts to improve conversion rates.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant A (Control)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion Rate: 18.5%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant B (Test)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion Rate: 22.3%
                      </Typography>
                    </Box>
                    
                    <Chip label="Active" color="success" size="small" />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      CTA Button Test
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Testing different call-to-action button colors and text.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant A (Control)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click Rate: 12.8%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant B (Test)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click Rate: 15.2%
                      </Typography>
                    </Box>
                    
                    <Chip label="Completed" color="info" size="small" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Optimization Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Optimization Recommendations
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">High Impact</Typography>
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Improve Trial Onboarding"
                          secondary="Add interactive tutorial to increase trial completion rate"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Optimize Pricing Page"
                          secondary="A/B test different pricing layouts to improve conversion"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Warning color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">Medium Impact</Typography>
                    </Box>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Reduce Form Fields"
                          secondary="Minimize signup form to decrease abandonment"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Add Social Proof"
                          secondary="Display customer testimonials and usage statistics"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onClose={() => setShowEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Conversion Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {selectedEvent.type.replace('_', ' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    User ID
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {selectedEvent.userId}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body2">
                    {selectedEvent.amount ? formatAmount(selectedEvent.amount, selectedEvent.currency || 'USD') : 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Source
                  </Typography>
                  <Typography variant="body2">{selectedEvent.source}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedEvent.timestamp).toLocaleString()}
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
