'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  TrendingUp,
  Analytics,
  People,
  CheckCircle,
  Warning,
  Info,
  Receipt,
  AccountBalance,
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
  ReceiptLong,
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
  Help
} from '@mui/icons-material';

const monetizationTools = [
  {
    title: 'Subscription Management',
    description: 'Manage pricing plans, subscriptions, and billing cycles',
    icon: <Receipt sx={{ fontSize: 40 }} />,
    href: '/monetization/subscription-management',
    features: [
      'Pricing plan management',
      'Subscription lifecycle',
      'Billing cycle control',
      'Plan upgrades/downgrades',
      'Customer management'
    ],
    color: 'primary',
    status: 'active',
    revenue: '$15,750',
    growth: '+12.5%'
  },
  {
    title: 'Payment Processing',
    description: 'Handle payments, refunds, and payment methods',
    icon: <CreditCard sx={{ fontSize: 40 }} />,
    href: '/monetization/payment-processing',
    features: [
      'Multiple payment methods',
      'Payment processing',
      'Refund management',
      'Payment analytics',
      'Fraud detection'
    ],
    color: 'secondary',
    status: 'active',
    revenue: '$12,450',
    growth: '+8.3%'
  },
  {
    title: 'Pricing Plans',
    description: 'Create and manage pricing tiers and plans',
    icon: <AttachMoney sx={{ fontSize: 40 }} />,
    href: '/monetization/pricing-plans',
    features: [
      'Plan creation',
      'Pricing optimization',
      'A/B testing',
      'Plan comparison',
      'Pricing analytics'
    ],
    color: 'success',
    status: 'active',
    revenue: '$8,900',
    growth: '+15.2%'
  },
  {
    title: 'Billing Dashboard',
    description: 'Monitor revenue, subscriptions, and billing performance',
    icon: <AccountBalance sx={{ fontSize: 40 }} />,
    href: '/monetization/billing-dashboard',
    features: [
      'Revenue tracking',
      'Subscription metrics',
      'Billing analytics',
      'Performance monitoring',
      'Financial reporting'
    ],
    color: 'warning',
    status: 'active',
    revenue: '$22,100',
    growth: '+18.7%'
  },
  {
    title: 'Conversion Analytics',
    description: 'Track and optimize conversion rates and user journey',
    icon: <TrendingUp sx={{ fontSize: 40 }} />,
    href: '/monetization/conversion-analytics',
    features: [
      'Conversion tracking',
      'Funnel analysis',
      'A/B testing',
      'Optimization insights',
      'Performance metrics'
    ],
    color: 'info',
    status: 'active',
    revenue: '$5,600',
    growth: '+22.1%'
  },
  {
    title: 'Trial Management',
    description: 'Manage free trials and optimize conversion rates',
    icon: <PlayArrow sx={{ fontSize: 40 }} />,
    href: '/monetization/trial-management',
    features: [
      'Trial lifecycle',
      'Trial analytics',
      'Conversion optimization',
      'Trial extensions',
      'Engagement tracking'
    ],
    color: 'error',
    status: 'active',
    revenue: '$3,200',
    growth: '+9.8%'
  },
  {
    title: 'Revenue Analytics',
    description: 'Analyze revenue performance and growth trends',
    icon: <Analytics sx={{ fontSize: 40 }} />,
    href: '/monetization/revenue-analytics',
    features: [
      'Revenue analysis',
      'Growth tracking',
      'Forecasting',
      'Trend analysis',
      'Financial insights'
    ],
    color: 'primary',
    status: 'active',
    revenue: '$18,750',
    growth: '+14.3%'
  }
];

const keyMetrics = [
  {
    name: 'Total Revenue',
    value: '$125,000',
    change: '+12.5%',
    trend: 'up',
    icon: <AttachMoney color="success" />
  },
  {
    name: 'Monthly Recurring Revenue',
    value: '$15,750',
    change: '+8.3%',
    trend: 'up',
    icon: <TrendingUp color="success" />
  },
  {
    name: 'Active Subscriptions',
    value: '1,570',
    change: '+15.2%',
    trend: 'up',
    icon: <People color="info" />
  },
  {
    name: 'Conversion Rate',
    value: '18.5%',
    change: '+2.3%',
    trend: 'up',
    icon: <CheckCircle color="success" />
  }
];

export default function MonetizationPage() {
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
          Monetization Hub
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Complete suite of monetization tools for CreatorFlow
        </Typography>
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            All monetization tools are active and generating revenue. Monitor performance and optimize your monetization strategy.
          </Typography>
        </Alert>
      </Box>

      {/* Key Metrics */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Key Metrics
        </Typography>
        <Grid container spacing={3}>
          {keyMetrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {metric.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {metric.name}
                    </Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {metric.change} vs last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Monetization Tools */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Monetization Tools ({monetizationTools.length})
        </Typography>
        
        <Grid container spacing={3}>
          {monetizationTools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 4 },
                  transition: 'box-shadow 0.3s ease'
                }}
                onClick={() => window.location.href = tool.href}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ color: `${tool.color}.main`, mr: 2 }}>
                      {tool.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {tool.title}
                      </Typography>
                      <Chip
                        label={tool.status}
                        color={tool.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  
                  <List dense>
                    {tool.features.slice(0, 3).map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <CheckCircle color="success" sx={{ fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                    {tool.features.length > 3 && (
                      <ListItem>
                        <ListItemText
                          primary={`+${tool.features.length - 3} more features`}
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            color: 'text.secondary',
                            fontStyle: 'italic'
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Revenue
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {tool.revenue}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Growth
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {tool.growth}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = tool.href;
                    }}
                  >
                    Open Tool
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Download />}
              onClick={() => {/* Export data */}}
            >
              Export Data
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Settings />}
              onClick={() => {/* Open settings */}}
            >
              Settings
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Analytics />}
              onClick={() => {/* View analytics */}}
            >
              View Analytics
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Help />}
              onClick={() => {/* Get help */}}
            >
              Get Help
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
