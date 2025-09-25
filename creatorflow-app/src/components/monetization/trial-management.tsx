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
  PlayArrow,
  Stop,
  Pause,
  Refresh,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  People,
  AttachMoney,
  TrendingUp,
  TrendingDown,
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

interface TrialUser {
  id: string;
  email: string;
  name: string;
  planId: string;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  usage: {
    toolsUsed: number;
    totalTools: number;
    apiCalls: number;
    storageUsed: string;
  };
  conversionProbability: number;
  lastActivity: string;
  source: string;
}

interface TrialMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  target?: number;
  status: 'good' | 'warning' | 'critical';
}

interface TrialEvent {
  id: string;
  type: 'started' | 'extended' | 'converted' | 'expired' | 'cancelled';
  description: string;
  userId: string;
  planId: string;
  timestamp: string;
  metadata: {
    reason?: string;
    daysExtended?: number;
    conversionValue?: number;
  };
}

const trialUsers: TrialUser[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    planId: 'creator',
    status: 'active',
    startDate: '2024-06-15T00:00:00Z',
    endDate: '2024-06-29T00:00:00Z',
    daysRemaining: 5,
    usage: {
      toolsUsed: 8,
      totalTools: 10,
      apiCalls: 1250,
      storageUsed: '2.5GB'
    },
    conversionProbability: 85,
    lastActivity: '2024-06-20T10:30:00Z',
    source: 'organic'
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    planId: 'pro',
    status: 'active',
    startDate: '2024-06-18T00:00:00Z',
    endDate: '2024-07-02T00:00:00Z',
    daysRemaining: 8,
    usage: {
      toolsUsed: 12,
      totalTools: 20,
      apiCalls: 3200,
      storageUsed: '8.1GB'
    },
    conversionProbability: 92,
    lastActivity: '2024-06-20T09:15:00Z',
    source: 'social'
  },
  {
    id: '3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    planId: 'creator',
    status: 'expired',
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-06-15T00:00:00Z',
    daysRemaining: 0,
    usage: {
      toolsUsed: 3,
      totalTools: 10,
      apiCalls: 450,
      storageUsed: '1.2GB'
    },
    conversionProbability: 25,
    lastActivity: '2024-06-14T16:20:00Z',
    source: 'email'
  },
  {
    id: '4',
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    planId: 'pro',
    status: 'converted',
    startDate: '2024-05-20T00:00:00Z',
    endDate: '2024-06-03T00:00:00Z',
    daysRemaining: 0,
    usage: {
      toolsUsed: 18,
      totalTools: 20,
      apiCalls: 8500,
      storageUsed: '45.2GB'
    },
    conversionProbability: 100,
    lastActivity: '2024-06-03T14:30:00Z',
    source: 'referral'
  }
];

const trialMetrics: TrialMetric[] = [
  {
    id: '1',
    name: 'Active Trials',
    value: 1250,
    change: 15.2,
    trend: 'up',
    period: 'vs last month',
    target: 1500,
    status: 'good'
  },
  {
    id: '2',
    name: 'Trial Conversion Rate',
    value: 35.2,
    change: -1.8,
    trend: 'down',
    period: 'vs last month',
    target: 40,
    status: 'warning'
  },
  {
    id: '3',
    name: 'Average Trial Duration',
    value: 12.5,
    change: 2.1,
    trend: 'up',
    period: 'vs last month',
    target: 10,
    status: 'warning'
  },
  {
    id: '4',
    name: 'Trial Engagement Rate',
    value: 78.5,
    change: 5.3,
    trend: 'up',
    period: 'vs last month',
    target: 80,
    status: 'good'
  },
  {
    id: '5',
    name: 'Trial Extension Rate',
    value: 12.8,
    change: 3.2,
    trend: 'up',
    period: 'vs last month',
    target: 15,
    status: 'good'
  },
  {
    id: '6',
    name: 'Trial Revenue',
    value: 8750,
    change: 18.7,
    trend: 'up',
    period: 'vs last month',
    target: 10000,
    status: 'good'
  }
];

const trialEvents: TrialEvent[] = [
  {
    id: '1',
    type: 'started',
    description: 'New trial started for Creator Plan',
    userId: 'user_1234567890',
    planId: 'creator',
    timestamp: '2024-06-20T10:30:00Z',
    metadata: {}
  },
  {
    id: '2',
    type: 'converted',
    description: 'Trial converted to Pro Plan subscription',
    userId: 'user_0987654321',
    planId: 'pro',
    timestamp: '2024-06-20T09:15:00Z',
    metadata: {
      conversionValue: 49.00
    }
  },
  {
    id: '3',
    type: 'extended',
    description: 'Trial extended by 7 days',
    userId: 'user_1122334455',
    planId: 'creator',
    timestamp: '2024-06-19T16:45:00Z',
    metadata: {
      reason: 'High engagement',
      daysExtended: 7
    }
  },
  {
    id: '4',
    type: 'expired',
    description: 'Trial expired without conversion',
    userId: 'user_5566778899',
    planId: 'creator',
    timestamp: '2024-06-19T14:20:00Z',
    metadata: {}
  }
];

export default function TrialManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TrialUser | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState('30d');

  const handleUserClick = (user: TrialUser) => {
    setSelectedUser(user);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'expired': return 'error';
      case 'converted': return 'info';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayArrow color="success" />;
      case 'expired': return <Stop color="error" />;
      case 'converted': return <CheckCircle color="info" />;
      case 'cancelled': return <Cancel color="disabled" />;
      default: return <Info color="disabled" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'started': return <PlayArrow color="success" />;
      case 'extended': return <Refresh color="warning" />;
      case 'converted': return <CheckCircle color="success" />;
      case 'expired': return <Stop color="error" />;
      case 'cancelled': return <Cancel color="error" />;
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

  const getConversionProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'success';
    if (probability >= 60) return 'warning';
    return 'error';
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
          Trial Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage free trials and optimize conversion rates
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Track trial users, monitor engagement, and optimize conversion strategies.
          </Typography>
        </Alert>
      </Box>

      {/* Date Range Selector */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Trial Overview</Typography>
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
          <Tab label="Active Trials" />
          <Tab label="Trial Events" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>

        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Trial Metrics
            </Typography>
            
            <Grid container spacing={3}>
              {trialMetrics.map((metric) => (
                <Grid item xs={12} sm={6} md={4} key={metric.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                          {metric.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {getTrendIcon(metric.trend)}
                        </Box>
                      </Box>
                      
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {metric.name.includes('Rate') ? `${metric.value}%` : metric.value.toLocaleString()}
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
                            Target: {metric.target}
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

            {/* Trial Chart Placeholder */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Trial Trends
              </Typography>
              <Paper sx={{ p: 3, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50' }}>
                <Typography variant="body2" color="text.secondary">
                  Trial trends chart would be rendered here
                </Typography>
              </Paper>
            </Box>
          </Box>
        )}

        {/* Active Trials Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Active Trials ({trialUsers.filter(u => u.status === 'active').length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Days Remaining</TableCell>
                    <TableCell>Usage</TableCell>
                    <TableCell>Conversion Probability</TableCell>
                    <TableCell>Last Activity</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trialUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={user.planId} size="small" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(user.status)}
                          <Typography variant="body2">{user.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.daysRemaining} days
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.usage.toolsUsed}/{user.usage.totalTools} tools
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.usage.apiCalls} API calls
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {user.conversionProbability}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={user.conversionProbability}
                            color={getConversionProbabilityColor(user.conversionProbability)}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastActivity).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleUserClick(user)}>
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

        {/* Trial Events Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Trial Events ({trialEvents.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trialEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getEventIcon(event.type)}
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {event.type}
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
                        <Chip label={event.planId} size="small" />
                      </TableCell>
                      <TableCell>
                        {new Date(event.timestamp).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small">
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

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Trial Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Trial Sources
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Organic Search"
                          secondary="45.2% of trials"
                        />
                        <Typography variant="h6" color="primary">
                          565
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Social Media"
                          secondary="28.7% of trials"
                        />
                        <Typography variant="h6" color="primary">
                          359
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email Marketing"
                          secondary="18.3% of trials"
                        />
                        <Typography variant="h6" color="primary">
                          229
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Referrals"
                          secondary="7.8% of trials"
                        />
                        <Typography variant="h6" color="primary">
                          97
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
                      Trial Performance by Plan
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Creator Plan"
                          secondary="Conversion Rate: 42.3%"
                        />
                        <Typography variant="h6" color="primary">
                          42.3%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Pro Plan"
                          secondary="Conversion Rate: 38.7%"
                        />
                        <Typography variant="h6" color="primary">
                          38.7%
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Enterprise Plan"
                          secondary="Conversion Rate: 28.9%"
                        />
                        <Typography variant="h6" color="primary">
                          28.9%
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Trial Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Trial Configuration
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Trial Duration"
                          secondary="14 days"
                        />
                        <Button size="small">Edit</Button>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Auto-conversion"
                          secondary="Automatically convert trials to paid subscriptions"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Trial Extensions"
                          secondary="Allow users to extend their trials"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notifications
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Trial Reminders"
                          secondary="Send reminders before trial expires"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Conversion Alerts"
                          secondary="Get notified when trials convert"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Expiration Alerts"
                          secondary="Get notified when trials expire"
                        />
                        <Switch />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* User Dialog */}
      <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Trial User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedUser.name} - {selectedUser.email}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Plan
                  </Typography>
                  <Typography variant="body2">{selectedUser.planId}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">{selectedUser.status}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Days Remaining
                  </Typography>
                  <Typography variant="body2">{selectedUser.daysRemaining}</Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Conversion Probability
                  </Typography>
                  <Typography variant="body2">{selectedUser.conversionProbability}%</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Usage
                  </Typography>
                  <Typography variant="body2">
                    {selectedUser.usage.toolsUsed}/{selectedUser.usage.totalTools} tools used, 
                    {selectedUser.usage.apiCalls} API calls, 
                    {selectedUser.usage.storageUsed} storage used
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUserDialog(false)}>Close</Button>
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
