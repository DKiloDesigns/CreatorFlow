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
  AttachMoney,
  Star,
  CheckCircle,
  Cancel,
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
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
  CreditCard,
  Payment,
  AccountBalance,
  Apple,
  Google as GoogleIcon,
  PayPal,
  Stripe as StripeIcon,
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
  CompareTwoTone as CompareTwoToneIcon
} from '@mui/icons-material';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  originalPrice?: number;
  discount?: number;
  features: {
    name: string;
    included: boolean;
    limit?: number;
    unlimited?: boolean;
  }[];
  limits: {
    users: number;
    content: number;
    storage: string;
    apiCalls: number;
    support: string;
  };
  popular: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  conversionRate: number;
  revenue: number;
  subscribers: number;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  plans: string[];
  targetAudience: string;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Free',
    description: 'Perfect for getting started with CreatorFlow',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      { name: '6 Free Tools', included: true },
      { name: 'Basic Analytics', included: true },
      { name: 'Community Support', included: true },
      { name: '1 User Account', included: true, limit: 1 },
      { name: '5GB Storage', included: true, limit: 5 },
      { name: '1,000 API Calls', included: true, limit: 1000 },
      { name: 'Creator Tools', included: false },
      { name: 'Pro Tools', included: false },
      { name: 'Enterprise Tools', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
      { name: 'White-label Solutions', included: false }
    ],
    limits: {
      users: 1,
      content: 50,
      storage: '5GB',
      apiCalls: 1000,
      support: 'Community'
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    conversionRate: 0.15,
    revenue: 0,
    subscribers: 1250
  },
  {
    id: '2',
    name: 'Creator',
    description: 'For individual content creators and small businesses',
    price: 19,
    currency: 'USD',
    interval: 'monthly',
    originalPrice: 29,
    discount: 34,
    features: [
      { name: 'All Free Tools', included: true },
      { name: '4 Creator Tools', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Email Support', included: true },
      { name: '5 User Accounts', included: true, limit: 5 },
      { name: '50GB Storage', included: true, limit: 50 },
      { name: '10,000 API Calls', included: true, limit: 10000 },
      { name: 'Pro Tools', included: false },
      { name: 'Enterprise Tools', included: false },
      { name: 'Priority Support', included: false },
      { name: 'Custom Integrations', included: false },
      { name: 'White-label Solutions', included: false }
    ],
    limits: {
      users: 5,
      content: 500,
      storage: '50GB',
      apiCalls: 10000,
      support: 'Email'
    },
    popular: true,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    conversionRate: 0.25,
    revenue: 4750,
    subscribers: 250
  },
  {
    id: '3',
    name: 'Pro',
    description: 'For professional content creators and growing teams',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    features: [
      { name: 'All Creator Tools', included: true },
      { name: '10 Pro Tools', included: true },
      { name: 'Advanced Analytics', included: true },
      { name: 'Priority Support', included: true },
      { name: '25 User Accounts', included: true, limit: 25 },
      { name: '250GB Storage', included: true, limit: 250 },
      { name: '50,000 API Calls', included: true, limit: 50000 },
      { name: 'API Access', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'Enterprise Tools', included: false },
      { name: 'White-label Solutions', included: false },
      { name: 'Dedicated Support', included: false }
    ],
    limits: {
      users: 25,
      content: 2500,
      storage: '250GB',
      apiCalls: 50000,
      support: 'Priority'
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    conversionRate: 0.18,
    revenue: 2450,
    subscribers: 50
  },
  {
    id: '4',
    name: 'Enterprise',
    description: 'For large organizations and enterprise teams',
    price: 99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      { name: 'All Pro Tools', included: true },
      { name: '8 Enterprise Tools', included: true },
      { name: 'Enterprise Analytics', included: true },
      { name: 'Dedicated Support', included: true },
      { name: 'Unlimited Users', included: true, unlimited: true },
      { name: '1TB Storage', included: true, limit: 1000 },
      { name: 'Unlimited API Calls', included: true, unlimited: true },
      { name: 'Full API Access', included: true },
      { name: 'White-label Solutions', included: true },
      { name: 'Custom Integrations', included: true },
      { name: 'SLA Guarantee', included: true },
      { name: 'Custom Onboarding', included: true }
    ],
    limits: {
      users: -1, // unlimited
      content: -1, // unlimited
      storage: '1TB',
      apiCalls: -1, // unlimited
      support: 'Dedicated'
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    conversionRate: 0.08,
    revenue: 1980,
    subscribers: 20
  }
];

const pricingTiers: PricingTier[] = [
  {
    id: '1',
    name: 'Individual',
    description: 'For solo creators and freelancers',
    plans: ['1', '2'],
    targetAudience: 'Individual creators, freelancers, small businesses',
    features: ['Basic tools', 'Personal analytics', 'Community support']
  },
  {
    id: '2',
    name: 'Professional',
    description: 'For growing teams and agencies',
    plans: ['2', '3'],
    targetAudience: 'Content teams, agencies, growing businesses',
    features: ['Advanced tools', 'Team collaboration', 'Priority support']
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'For large organizations',
    plans: ['3', '4'],
    targetAudience: 'Large companies, enterprises, organizations',
    features: ['Enterprise tools', 'Custom solutions', 'Dedicated support']
  }
];

export default function PricingPlans() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showTierDialog, setShowTierDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handlePlanClick = (plan: PricingPlan) => {
    setSelectedPlan(plan);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBillingIntervalChange = (event: React.MouseEvent<HTMLElement>, newInterval: 'monthly' | 'yearly') => {
    if (newInterval !== null) {
      setBillingInterval(newInterval);
    }
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const calculateYearlyPrice = (monthlyPrice: number) => {
    return monthlyPrice * 12 * 0.8; // 20% discount for yearly
  };

  const filteredPlans = pricingPlans.filter(plan => 
    plan.interval === billingInterval || plan.price === 0
  );

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
          Pricing Plans
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Choose the perfect plan for your content creation needs
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            All plans include a 14-day free trial. No credit card required.
          </Typography>
        </Alert>
      </Box>

      {/* Billing Interval Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={billingInterval}
          exclusive
          onChange={handleBillingIntervalChange}
          aria-label="billing interval"
        >
          <ToggleButton value="monthly" aria-label="monthly">
            Monthly
          </ToggleButton>
          <ToggleButton value="yearly" aria-label="yearly">
            Yearly (20% off)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Plans Overview" />
          <Tab label="Plan Comparison" />
          <Tab label="Pricing Tiers" />
          <Tab label="Analytics" />
          <Tab label="Settings" />
        </Tabs>

        {/* Plans Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Available Plans ({filteredPlans.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('grid')}
                  size="small"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'contained' : 'outlined'}
                  onClick={() => setViewMode('table')}
                  size="small"
                >
                  Table
                </Button>
              </Box>
            </Box>

            {viewMode === 'grid' ? (
              <Grid container spacing={3}>
                {filteredPlans.map((plan) => (
                  <Grid item xs={12} sm={6} md={3} key={plan.id}>
                    <Card
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 4 },
                        border: selectedPlan?.id === plan.id ? 2 : 0,
                        borderColor: 'primary.main',
                        height: '100%'
                      }}
                      onClick={() => handlePlanClick(plan)}
                    >
                      {plan.popular && (
                        <Chip
                          label="Most Popular"
                          color="primary"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            zIndex: 1
                          }}
                        />
                      )}
                      
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {plan.name}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h4" color="primary">
                            {formatPrice(plan.price, plan.currency)}
                            <Typography component="span" variant="body2" color="text.secondary">
                              /{plan.interval}
                            </Typography>
                          </Typography>
                          {plan.originalPrice && plan.discount && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                {formatPrice(plan.originalPrice, plan.currency)}
                              </Typography>
                              <Chip label={`${plan.discount}% off`} color="success" size="small" />
                            </Box>
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {plan.description}
                        </Typography>
                        
                        <List dense>
                          {plan.features.slice(0, 6).map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0.5 }}>
                              <ListItemIcon>
                                <CheckCircle 
                                  color={feature.included ? 'success' : 'disabled'} 
                                  sx={{ fontSize: 20 }} 
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature.name}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  color: feature.included ? 'text.primary' : 'text.disabled'
                                }}
                              />
                            </ListItem>
                          ))}
                          {plan.features.length > 6 && (
                            <ListItem>
                              <ListItemText
                                primary={`+${plan.features.length - 6} more features`}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  color: 'text.secondary',
                                  fontStyle: 'italic'
                                }}
                              />
                            </ListItem>
                          )}
                        </List>
                        
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant={plan.popular ? 'contained' : 'outlined'}
                            fullWidth
                            onClick={() => handlePlanClick(plan)}
                          >
                            {plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Plan</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Users</TableCell>
                      <TableCell>Storage</TableCell>
                      <TableCell>API Calls</TableCell>
                      <TableCell>Support</TableCell>
                      <TableCell>Subscribers</TableCell>
                      <TableCell>Revenue</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{plan.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {plan.description}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" color="primary">
                            {formatPrice(plan.price, plan.currency)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            /{plan.interval}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                        </TableCell>
                        <TableCell>{plan.limits.storage}</TableCell>
                        <TableCell>
                          {plan.limits.apiCalls === -1 ? 'Unlimited' : plan.limits.apiCalls.toLocaleString()}
                        </TableCell>
                        <TableCell>{plan.limits.support}</TableCell>
                        <TableCell>{plan.subscribers}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            {formatPrice(plan.revenue, plan.currency)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Plan Comparison Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Plan Comparison
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Feature</TableCell>
                    {filteredPlans.map((plan) => (
                      <TableCell key={plan.id} align="center">
                        <Typography variant="subtitle2">{plan.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(plan.price, plan.currency)}/{plan.interval}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pricingPlans[0].features.map((feature, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">{feature.name}</Typography>
                      </TableCell>
                      {filteredPlans.map((plan) => (
                        <TableCell key={plan.id} align="center">
                          {plan.features[index]?.included ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="disabled" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Pricing Tiers Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Pricing Tiers ({pricingTiers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowTierDialog(true)}
              >
                New Tier
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {pricingTiers.map((tier) => (
                <Grid item xs={12} md={4} key={tier.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {tier.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {tier.description}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Target Audience:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {tier.targetAudience}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Key Features:
                      </Typography>
                      <List dense>
                        {tier.features.map((feature, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon>
                              <CheckCircle color="success" sx={{ fontSize: 20 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
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

        {/* Analytics Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Pricing Analytics
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Revenue</Typography>
                    </Box>
                    <Typography variant="h4" color="primary">
                      {formatPrice(9180, 'USD')}
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
                      Free to paid
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <People color="info" sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Subscribers</Typography>
                    </Box>
                    <Typography variant="h4" color="info.main">
                      1,570
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active subscriptions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Analytics color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">ARPU</Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      $5.85
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average revenue per user
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
              Pricing Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Plan Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Free Trial"
                          secondary="Enable 14-day free trial for all plans"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Yearly Discount"
                          secondary="Offer 20% discount for yearly billing"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Auto-upgrade"
                          secondary="Automatically upgrade users when they hit limits"
                        />
                        <Switch />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Display Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Show Popular Badge"
                          secondary="Highlight the most popular plan"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Show Discounts"
                          secondary="Display original prices and discounts"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Show Features"
                          secondary="Display feature comparison table"
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

      {/* Plan Dialog */}
      <Dialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Plan: {selectedPlan?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Plan Name"
            margin="normal"
            defaultValue={selectedPlan?.name}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            defaultValue={selectedPlan?.description}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                margin="normal"
                defaultValue={selectedPlan?.price}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select defaultValue={selectedPlan?.currency}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlanDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Changes</Button>
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
              <Compare />
            </ListItemIcon>
            <ListItemText>Compare</ListItemText>
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
