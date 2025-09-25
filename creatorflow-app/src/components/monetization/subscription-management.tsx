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
  StepContent
} from '@mui/material';
import {
  CreditCard,
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
  History,
  Science,
  Discovery,
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
  Reuters,
  Bloomberg,
  MarketWatch,
  Wall,
  Street,
  Journal,
  Financial,
  Times,
  New,
  York,
  Times,
  Washington,
  Post,
  Los,
  Angeles,
  Times,
  Chicago,
  Tribune,
  USA,
  Today,
  Time,
  Newsweek,
  Payment,
  Receipt,
  AccountBalance,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Euro,
  CurrencyPound,
  CurrencyYen,
  CurrencyRupee,
  CurrencyBitcoin,
  CurrencyExchange,
  LocalAtm,
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
  ThumbDownTwoTone
} from '@mui/icons-material';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    users: number;
    content: number;
    storage: string;
    apiCalls: number;
  };
  popular: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
  price: number;
  currency: string;
  interval: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal' | 'apple_pay' | 'google_pay';
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'expired';
}

interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  dueDate: string;
  paidAt: string | null;
  createdAt: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Free',
    description: 'Perfect for getting started with CreatorFlow',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      '6 Free Tools',
      'Basic Analytics',
      'Community Support',
      '1 User Account',
      '5GB Storage'
    ],
    limits: {
      users: 1,
      content: 50,
      storage: '5GB',
      apiCalls: 1000
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Creator',
    description: 'For individual content creators and small businesses',
    price: 19,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Free Tools',
      '4 Creator Tools',
      'Advanced Analytics',
      'Email Support',
      '5 User Accounts',
      '50GB Storage',
      'Priority Updates'
    ],
    limits: {
      users: 5,
      content: 500,
      storage: '50GB',
      apiCalls: 10000
    },
    popular: true,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Pro',
    description: 'For professional content creators and growing teams',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Creator Tools',
      '10 Pro Tools',
      'Advanced Analytics',
      'Priority Support',
      '25 User Accounts',
      '250GB Storage',
      'API Access',
      'Custom Integrations'
    ],
    limits: {
      users: 25,
      content: 2500,
      storage: '250GB',
      apiCalls: 50000
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Enterprise',
    description: 'For large organizations and enterprise teams',
    price: 99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'All Pro Tools',
      '8 Enterprise Tools',
      'Enterprise Analytics',
      'Dedicated Support',
      'Unlimited Users',
      '1TB Storage',
      'Full API Access',
      'White-label Solutions',
      'Custom Integrations',
      'SLA Guarantee'
    ],
    limits: {
      users: -1, // unlimited
      content: -1, // unlimited
      storage: '1TB',
      apiCalls: -1 // unlimited
    },
    popular: false,
    status: 'active',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

const currentSubscription: Subscription = {
  id: 'sub_1234567890',
  userId: 'user_1234567890',
  planId: '2',
  status: 'active',
  currentPeriodStart: '2024-06-01T00:00:00Z',
  currentPeriodEnd: '2024-07-01T00:00:00Z',
  cancelAtPeriodEnd: false,
  trialEnd: null,
  price: 19,
  currency: 'USD',
  interval: 'monthly',
  createdAt: '2024-05-01T00:00:00Z',
  updatedAt: '2024-06-01T00:00:00Z'
};

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1234567890',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
    status: 'active'
  },
  {
    id: 'pm_0987654321',
    type: 'card',
    last4: '5555',
    brand: 'Mastercard',
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
    status: 'active'
  }
];

const invoices: Invoice[] = [
  {
    id: 'inv_1234567890',
    number: 'INV-2024-001',
    status: 'paid',
    amount: 19.00,
    currency: 'USD',
    dueDate: '2024-06-01T00:00:00Z',
    paidAt: '2024-06-01T10:30:00Z',
    createdAt: '2024-06-01T00:00:00Z',
    items: [
      {
        description: 'Creator Plan - Monthly',
        amount: 19.00,
        quantity: 1
      }
    ]
  },
  {
    id: 'inv_1234567891',
    number: 'INV-2024-002',
    status: 'open',
    amount: 19.00,
    currency: 'USD',
    dueDate: '2024-07-01T00:00:00Z',
    paidAt: null,
    createdAt: '2024-07-01T00:00:00Z',
    items: [
      {
        description: 'Creator Plan - Monthly',
        amount: 19.00,
        quantity: 1
      }
    ]
  }
];

export default function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [upgradeStep, setUpgradeStep] = useState(0);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPlanDialog(true);
    setUpgradeStep(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'past_due': return 'warning';
      case 'unpaid': return 'error';
      case 'trialing': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle color="success" />;
      case 'cancelled': return <Warning color="error" />;
      case 'past_due': return <Warning color="warning" />;
      case 'unpaid': return <Warning color="error" />;
      case 'trialing': return <Info color="info" />;
      default: return <Info color="disabled" />;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const getCurrentPlan = () => {
    return subscriptionPlans.find(plan => plan.id === currentSubscription.planId);
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
          Subscription Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage your CreatorFlow subscription and billing
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Upgrade, downgrade, or manage your subscription settings.
          </Typography>
        </Alert>
      </Box>

      {/* Current Subscription Status */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Subscription
        </Typography>
        
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h5">{getCurrentPlan()?.name} Plan</Typography>
              <Chip
                label={currentSubscription.status}
                color={getStatusColor(currentSubscription.status) as any}
                icon={getStatusIcon(currentSubscription.status)}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {getCurrentPlan()?.description}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2">
                <strong>Price:</strong> {formatPrice(currentSubscription.price, currentSubscription.currency)}/{currentSubscription.interval}
              </Typography>
              <Typography variant="body2">
                <strong>Next billing:</strong> {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {currentSubscription.cancelAtPeriodEnd ? 'Cancelling at period end' : 'Active'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button variant="outlined" startIcon={<Edit />}>
                Manage
              </Button>
              <Button variant="contained" startIcon={<TrendingUp />}>
                Upgrade
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Plans & Pricing" />
          <Tab label="Billing History" />
          <Tab label="Payment Methods" />
          <Tab label="Usage & Limits" />
          <Tab label="Settings" />
        </Tabs>

        {/* Plans & Pricing Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Plans
            </Typography>
            
            <Grid container spacing={3}>
              {subscriptionPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={3} key={plan.id}>
                  <Card
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 4 },
                      border: selectedPlan?.id === plan.id ? 2 : 0,
                      borderColor: 'primary.main'
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
                      
                      <Typography variant="h4" color="primary" gutterBottom>
                        {formatPrice(plan.price, plan.currency)}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /{plan.interval}
                        </Typography>
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {plan.description}
                      </Typography>
                      
                      <List dense>
                        {plan.features.map((feature, index) => (
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
                      
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant={plan.popular ? 'contained' : 'outlined'}
                          fullWidth
                          onClick={() => handleUpgrade(plan)}
                        >
                          {plan.id === currentSubscription.planId ? 'Current Plan' : 'Select Plan'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Billing History Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Billing History
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{invoice.number}</Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {formatPrice(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={invoice.status}
                          color={invoice.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button size="small" startIcon={<Download />}>
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Payment Methods Tab */}
        {activeTab === 2 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Payment Methods
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowPaymentDialog(true)}
              >
                Add Payment Method
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} md={6} key={method.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CreditCard color="primary" />
                          <Box>
                            <Typography variant="h6">
                              {method.brand} •••• {method.last4}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Expires {method.expMonth}/{method.expYear}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {method.isDefault && (
                            <Chip label="Default" color="primary" size="small" />
                          )}
                          <IconButton onClick={handleMenuClick}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {method.type === 'card' ? 'Credit Card' : method.type}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Usage & Limits Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Usage & Limits
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Current Usage
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Users</Typography>
                        <Typography variant="body2">3 / {getCurrentPlan()?.limits.users === -1 ? '∞' : getCurrentPlan()?.limits.users}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getCurrentPlan()?.limits.users === -1 ? 0 : (3 / (getCurrentPlan()?.limits.users || 1)) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Content</Typography>
                        <Typography variant="body2">125 / {getCurrentPlan()?.limits.content === -1 ? '∞' : getCurrentPlan()?.limits.content}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getCurrentPlan()?.limits.content === -1 ? 0 : (125 / (getCurrentPlan()?.limits.content || 1)) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Storage</Typography>
                        <Typography variant="body2">12.5GB / {getCurrentPlan()?.limits.storage}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={12.5 / 50 * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">API Calls</Typography>
                        <Typography variant="body2">2,500 / {getCurrentPlan()?.limits.apiCalls === -1 ? '∞' : getCurrentPlan()?.limits.apiCalls}</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getCurrentPlan()?.limits.apiCalls === -1 ? 0 : (2500 / (getCurrentPlan()?.limits.apiCalls || 1)) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Plan Limits
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Users"
                          secondary={getCurrentPlan()?.limits.users === -1 ? 'Unlimited' : getCurrentPlan()?.limits.users.toString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Content Items"
                          secondary={getCurrentPlan()?.limits.content === -1 ? 'Unlimited' : getCurrentPlan()?.limits.content.toString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Storage"
                          secondary={getCurrentPlan()?.limits.storage}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="API Calls"
                          secondary={getCurrentPlan()?.limits.apiCalls === -1 ? 'Unlimited' : getCurrentPlan()?.limits.apiCalls.toString()}
                        />
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
              Subscription Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Billing Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Auto-renewal"
                          secondary="Automatically renew subscription"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Email Notifications"
                          secondary="Get notified about billing events"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Invoice Delivery"
                          secondary="Receive invoices via email"
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
                      Account Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Cancel Subscription"
                          secondary="Cancel your subscription at the end of the current period"
                        />
                        <Button variant="outlined" color="error" size="small">
                          Cancel
                        </Button>
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Download Data"
                          secondary="Download all your data"
                        />
                        <Button variant="outlined" size="small">
                          Download
                        </Button>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Plan Selection Dialog */}
      <Dialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upgrade to {selectedPlan?.name} Plan</DialogTitle>
        <DialogContent>
          <Stepper activeStep={upgradeStep} orientation="vertical">
            <Step>
              <StepLabel>Select Plan</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  You are upgrading to the {selectedPlan?.name} plan for {formatPrice(selectedPlan?.price || 0, selectedPlan?.currency || 'USD')}/{selectedPlan?.interval}.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setUpgradeStep(1)}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Payment Method</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Select or add a payment method for your subscription.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setUpgradeStep(2)}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Confirm Upgrade</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Review your upgrade details and confirm your subscription.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowPlanDialog(false)}
                >
                  Complete Upgrade
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPlanDialog(false)}>Cancel</Button>
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
            <ListItemText>Remove</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </Container>
  );
}
