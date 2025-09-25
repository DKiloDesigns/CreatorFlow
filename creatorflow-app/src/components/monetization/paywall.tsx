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
  FormLabel,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Lock,
  CheckCircle,
  Cancel,
  Warning,
  Info,
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
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

interface PaywallRule {
  id: string;
  name: string;
  description: string;
  type: 'usage_limit' | 'feature_gate' | 'time_limit' | 'trial_limit';
  condition: string;
  action: 'block' | 'upgrade_prompt' | 'trial_offer' | 'redirect';
  targetPlan: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface ConversionFlow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: {
    id: string;
    name: string;
    type: 'modal' | 'banner' | 'page' | 'email';
    content: string;
    action: string;
    order: number;
  }[];
  status: 'active' | 'inactive' | 'draft';
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

const paywallRules: PaywallRule[] = [
  {
    id: '1',
    name: 'Free Plan API Limit',
    description: 'Block API calls after 1000 requests for free users',
    type: 'usage_limit',
    condition: 'api_calls >= 1000 AND plan = "free"',
    action: 'upgrade_prompt',
    targetPlan: 'creator',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Creator Plan Storage Limit',
    description: 'Prompt upgrade when storage reaches 80% of limit',
    type: 'usage_limit',
    condition: 'storage_used >= 80% AND plan = "creator"',
    action: 'upgrade_prompt',
    targetPlan: 'pro',
    status: 'active',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Trial Expiration',
    description: 'Block access when trial expires',
    type: 'time_limit',
    condition: 'trial_end < now() AND plan = "trial"',
    action: 'block',
    targetPlan: 'creator',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Pro Tools Access',
    description: 'Block access to Pro tools for Creator plan users',
    type: 'feature_gate',
    condition: 'feature = "pro_tools" AND plan = "creator"',
    action: 'upgrade_prompt',
    targetPlan: 'pro',
    status: 'active',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  }
];

const conversionFlows: ConversionFlow[] = [
  {
    id: '1',
    name: 'Free to Creator Upgrade',
    description: 'Convert free users to Creator plan',
    trigger: 'api_limit_reached',
    steps: [
      {
        id: '1',
        name: 'Upgrade Modal',
        type: 'modal',
        content: 'You\'ve reached your API limit. Upgrade to Creator plan for more requests.',
        action: 'show_upgrade_modal',
        order: 1
      },
      {
        id: '2',
        name: 'Pricing Page',
        type: 'page',
        content: 'Redirect to pricing page with Creator plan highlighted',
        action: 'redirect_to_pricing',
        order: 2
      },
      {
        id: '3',
        name: 'Follow-up Email',
        type: 'email',
        content: 'Follow-up email with special offer for Creator plan',
        action: 'send_follow_up_email',
        order: 3
      }
    ],
    status: 'active',
    conversionRate: 18.5,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Creator to Pro Upgrade',
    description: 'Convert Creator users to Pro plan',
    trigger: 'feature_access_denied',
    steps: [
      {
        id: '1',
        name: 'Feature Banner',
        type: 'banner',
        content: 'This feature is available in Pro plan. Upgrade now!',
        action: 'show_feature_banner',
        order: 1
      },
      {
        id: '2',
        name: 'Upgrade Page',
        type: 'page',
        content: 'Show Pro plan benefits and pricing',
        action: 'show_upgrade_page',
        order: 2
      }
    ],
    status: 'active',
    conversionRate: 12.7,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Trial to Paid Conversion',
    description: 'Convert trial users to paid subscriptions',
    trigger: 'trial_expiring',
    steps: [
      {
        id: '1',
        name: 'Trial Warning',
        type: 'banner',
        content: 'Your trial expires in 3 days. Choose your plan now!',
        action: 'show_trial_warning',
        order: 1
      },
      {
        id: '2',
        name: 'Plan Selection',
        type: 'modal',
        content: 'Select your plan to continue using CreatorFlow',
        action: 'show_plan_selection',
        order: 2
      },
      {
        id: '3',
        name: 'Payment Form',
        type: 'page',
        content: 'Complete your subscription setup',
        action: 'show_payment_form',
        order: 3
      }
    ],
    status: 'active',
    conversionRate: 35.2,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  }
];

export default function Paywall() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRule, setSelectedRule] = useState<PaywallRule | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<ConversionFlow | null>(null);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showFlowDialog, setShowFlowDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleRuleClick = (rule: PaywallRule) => {
    setSelectedRule(rule);
  };

  const handleFlowClick = (flow: ConversionFlow) => {
    setSelectedFlow(flow);
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
      case 'inactive': return 'error';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'inactive': return <Cancel color="error" />;
      case 'draft': return <Warning color="warning" />;
      default: return <Info color="disabled" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'usage_limit': return <Speed color="warning" />;
      case 'feature_gate': return <Lock color="error" />;
      case 'time_limit': return <Schedule color="info" />;
      case 'trial_limit': return <PlayArrow color="success" />;
      default: return <Info color="disabled" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'error';
      case 'upgrade_prompt': return 'warning';
      case 'trial_offer': return 'info';
      case 'redirect': return 'primary';
      default: return 'default';
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
          Paywalls & Conversion Flows
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage paywalls and optimize conversion flows
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Configure paywall rules and conversion flows to maximize revenue and user experience.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Paywall Rules" />
          <Tab label="Conversion Flows" />
          <Tab label="A/B Tests" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>

        {/* Paywall Rules Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Paywall Rules ({paywallRules.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowRuleDialog(true)}
              >
                New Rule
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {paywallRules.map((rule) => (
                <Grid item xs={12} md={6} key={rule.id}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleRuleClick(rule)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getTypeIcon(rule.type)}
                          <Typography variant="h6">{rule.name}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={rule.status}
                            color={getStatusColor(rule.status) as any}
                            size="small"
                          />
                          <IconButton size="small" onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {rule.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Condition
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                          {rule.condition}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Action
                          </Typography>
                          <Chip
                            label={rule.action.replace('_', ' ')}
                            color={getActionColor(rule.action) as any}
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            Target Plan
                          </Typography>
                          <Typography variant="body2">{rule.targetPlan}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Conversion Flows Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Conversion Flows ({conversionFlows.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowFlowDialog(true)}
              >
                New Flow
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {conversionFlows.map((flow) => (
                <Grid item xs={12} md={6} key={flow.id}>
                  <Card
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                    onClick={() => handleFlowClick(flow)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6">{flow.name}</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={flow.status}
                            color={getStatusColor(flow.status) as any}
                            size="small"
                          />
                          <IconButton size="small" onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {flow.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Trigger
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                          {flow.trigger}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Steps ({flow.steps.length})
                        </Typography>
                        <List dense>
                          {flow.steps.map((step, index) => (
                            <ListItem key={step.id} sx={{ py: 0.5 }}>
                              <ListItemIcon>
                                <Typography variant="caption" color="text.secondary">
                                  {step.order}
                                </Typography>
                              </ListItemIcon>
                              <ListItemText
                                primary={step.name}
                                secondary={step.type}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ variant: 'caption' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Conversion Rate
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {flow.conversionRate}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* A/B Tests Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              A/B Tests
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Paywall Message Test
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Testing different paywall messages to improve conversion rates.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant A (Control)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        "Upgrade to continue using this feature"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion Rate: 12.5%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant B (Test)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        "Unlock unlimited access with Creator plan"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Conversion Rate: 18.3%
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
                      Upgrade Button Test
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Testing different upgrade button colors and text.
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant A (Control)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        "Upgrade Now" (Blue)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click Rate: 8.7%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Variant B (Test)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        "Get Started" (Green)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Click Rate: 14.2%
                      </Typography>
                    </Box>
                    
                    <Chip label="Completed" color="info" size="small" />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Paywall Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Lock color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Paywall Hits</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      2,450
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUp color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6">Conversion Rate</Typography>
                    </Box>
                    <Typography variant="h4" color="success.main">
                      18.5%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paywall to upgrade
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">Revenue</Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      $8,750
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From paywalls
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People color="info" sx={{ mr: 1 }} />
                      <Typography variant="h6">Users Affected</Typography>
                    </Box>
                    <Typography variant="h4" color="info.main">
                      1,890
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This month
                    </Typography>
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
              Paywall Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      General Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Enable Paywalls"
                          secondary="Show paywalls for restricted features"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Grace Period"
                          secondary="Allow 5 minutes after limit reached"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="A/B Testing"
                          secondary="Enable automatic A/B testing"
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
                      Conversion Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Auto-redirect"
                          secondary="Redirect to pricing page after paywall"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email Follow-up"
                          secondary="Send follow-up emails to users who hit paywalls"
                        />
                        <Switch />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Retry Logic"
                          secondary="Allow users to retry after hitting limits"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onClose={() => setShowRuleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Paywall Rule Details</DialogTitle>
        <DialogContent>
          {selectedRule && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedRule.name}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {selectedRule.type.replace('_', ' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body2">{selectedRule.status}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Condition
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                    {selectedRule.condition}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Action
                  </Typography>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {selectedRule.action.replace('_', ' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Target Plan
                  </Typography>
                  <Typography variant="body2">{selectedRule.targetPlan}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRuleDialog(false)}>Close</Button>
          <Button variant="contained">Edit Rule</Button>
        </DialogActions>
      </Dialog>

      {/* Flow Dialog */}
      <Dialog open={showFlowDialog} onClose={() => setShowFlowDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Conversion Flow Details</DialogTitle>
        <DialogContent>
          {selectedFlow && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedFlow.name}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trigger
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                    {selectedFlow.trigger}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {selectedFlow.conversionRate}%
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Steps
                  </Typography>
                  <List>
                    {selectedFlow.steps.map((step, index) => (
                      <ListItem key={step.id}>
                        <ListItemIcon>
                          <Typography variant="caption" color="text.secondary">
                            {step.order}
                          </Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={step.name}
                          secondary={`${step.type} - ${step.content}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFlowDialog(false)}>Close</Button>
          <Button variant="contained">Edit Flow</Button>
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
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}
