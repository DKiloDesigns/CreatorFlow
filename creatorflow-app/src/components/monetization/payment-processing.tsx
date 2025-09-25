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
  Payment,
  CreditCard,
  AccountBalance,
  Apple,
  Google,
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
  Payment as StripeIcon,
  AccountBalance as PayPalIcon,
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
  Receipt,
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
  AttachMoney,
  Euro,
  CurrencyPound,
  CurrencyYen,
  CurrencyRupee,
  CurrencyBitcoin,
  CurrencyExchange,
  LocalAtm,
  TrendingUp,
  TrendingDown,
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
  ReceiptTwoTone as ReceiptTwoToneIcon
} from '@mui/icons-material';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'paypal' | 'apple_pay' | 'google_pay' | 'stripe';
  name: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  description: string;
  paymentMethod: string;
  createdAt: string;
  processedAt: string | null;
  failureReason: string | null;
  metadata: {
    subscriptionId?: string;
    invoiceId?: string;
    customerId?: string;
  };
}

interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'cancelled';
  reason: string;
  createdAt: string;
  processedAt: string | null;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1234567890',
    type: 'card',
    name: 'Visa •••• 4242',
    last4: '4242',
    brand: 'Visa',
    expMonth: 12,
    expYear: 2025,
    isDefault: true,
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'pm_0987654321',
    type: 'card',
    name: 'Mastercard •••• 5555',
    last4: '5555',
    brand: 'Mastercard',
    expMonth: 8,
    expYear: 2026,
    isDefault: false,
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'pm_1122334455',
    type: 'paypal',
    name: 'PayPal Account',
    last4: '1234',
    brand: 'PayPal',
    expMonth: 0,
    expYear: 0,
    isDefault: false,
    status: 'active',
    createdAt: '2024-03-10T00:00:00Z'
  }
];

const payments: Payment[] = [
  {
    id: 'pay_1234567890',
    amount: 19.00,
    currency: 'USD',
    status: 'succeeded',
    description: 'Creator Plan - Monthly Subscription',
    paymentMethod: 'pm_1234567890',
    createdAt: '2024-06-01T10:30:00Z',
    processedAt: '2024-06-01T10:30:15Z',
    failureReason: null,
    metadata: {
      subscriptionId: 'sub_1234567890',
      invoiceId: 'inv_1234567890',
      customerId: 'cus_1234567890'
    }
  },
  {
    id: 'pay_0987654321',
    amount: 49.00,
    currency: 'USD',
    status: 'succeeded',
    description: 'Pro Plan - Monthly Subscription',
    paymentMethod: 'pm_0987654321',
    createdAt: '2024-05-01T09:15:00Z',
    processedAt: '2024-05-01T09:15:20Z',
    failureReason: null,
    metadata: {
      subscriptionId: 'sub_0987654321',
      invoiceId: 'inv_0987654321',
      customerId: 'cus_0987654321'
    }
  },
  {
    id: 'pay_1122334455',
    amount: 19.00,
    currency: 'USD',
    status: 'failed',
    description: 'Creator Plan - Monthly Subscription',
    paymentMethod: 'pm_1122334455',
    createdAt: '2024-04-01T08:45:00Z',
    processedAt: null,
    failureReason: 'Insufficient funds',
    metadata: {
      subscriptionId: 'sub_1122334455',
      invoiceId: 'inv_1122334455',
      customerId: 'cus_1122334455'
    }
  }
];

const refunds: Refund[] = [
  {
    id: 'ref_1234567890',
    paymentId: 'pay_1234567890',
    amount: 19.00,
    currency: 'USD',
    status: 'succeeded',
    reason: 'Customer requested refund',
    createdAt: '2024-06-15T14:20:00Z',
    processedAt: '2024-06-15T14:20:30Z'
  },
  {
    id: 'ref_0987654321',
    paymentId: 'pay_0987654321',
    amount: 49.00,
    currency: 'USD',
    status: 'pending',
    reason: 'Service not as described',
    createdAt: '2024-06-20T11:30:00Z',
    processedAt: null
  }
];

export default function PaymentProcessing() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [paymentStep, setPaymentStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const handlePaymentClick = (payment: Payment) => {
    setSelectedPayment(payment);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewPayment = () => {
    setShowPaymentDialog(true);
    setPaymentStep(0);
  };

  const handleRefund = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowRefundDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded': return <CheckCircle color="success" />;
      case 'pending': return <Warning color="warning" />;
      case 'failed': return <Warning color="error" />;
      case 'cancelled': return <Info color="disabled" />;
      case 'refunded': return <Info color="info" />;
      default: return <Info color="disabled" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard />;
      case 'paypal': return <AccountBalance />;
      case 'apple_pay': return <Apple />;
      case 'google_pay': return <Google />;
      case 'stripe': return <Payment />;
      default: return <Payment />;
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
          Payment Processing
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage payments, refunds, and payment methods
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Process payments, handle refunds, and manage payment methods securely.
          </Typography>
        </Alert>
      </Box>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
          <Tab label="Payment Methods" />
          <Tab label="Payments" />
          <Tab label="Refunds" />
          <Tab label="Settings" />
        </Tabs>

        {/* Payment Methods Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Payment Methods ({paymentMethods.length})
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
                <Grid item xs={12} sm={6} md={4} key={method.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {getPaymentMethodIcon(method.type)}
                          <Box>
                            <Typography variant="h6">{method.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {method.type === 'card' ? `Expires ${method.expMonth}/${method.expYear}` : 'Connected Account'}
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
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={method.status}
                          color={method.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Added {new Date(method.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Payments Tab */}
        {activeTab === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Payment History ({payments.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleNewPayment}
              >
                New Payment
              </Button>
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                          {payment.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          {formatAmount(payment.amount, payment.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{payment.description}</Typography>
                        {payment.failureReason && (
                          <Typography variant="caption" color="error">
                            {payment.failureReason}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(payment.status)}
                          <Typography variant="body2">{payment.status}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<Receipt />}
                            onClick={() => handlePaymentClick(payment)}
                          >
                            View
                          </Button>
                          {payment.status === 'succeeded' && (
                            <Button
                              size="small"
                              color="warning"
                              startIcon={<AttachMoney />}
                              onClick={() => handleRefund(payment)}
                            >
                              Refund
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Refunds Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Refund History ({refunds.length})
            </Typography>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Refund ID</TableCell>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {refunds.map((refund) => (
                    <TableRow key={refund.id}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                          {refund.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {refund.paymentId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          {formatAmount(refund.amount, refund.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{refund.reason}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={refund.status}
                          color={getStatusColor(refund.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(refund.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Settings Tab */}
        {activeTab === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Methods
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Credit Cards"
                          secondary="Accept Visa, Mastercard, American Express"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="PayPal"
                          secondary="Accept PayPal payments"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Apple Pay"
                          secondary="Accept Apple Pay on mobile devices"
                        />
                        <Switch />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Google Pay"
                          secondary="Accept Google Pay on mobile devices"
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
                      Security Settings
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="3D Secure"
                          secondary="Require 3D Secure authentication"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Fraud Detection"
                          secondary="Enable automatic fraud detection"
                        />
                        <Switch defaultChecked />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="PCI Compliance"
                          secondary="Maintain PCI DSS compliance"
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

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onClose={() => setShowPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Payment Method</DialogTitle>
        <DialogContent>
          <Stepper activeStep={paymentStep} orientation="vertical">
            <Step>
              <StepLabel>Select Payment Method</StepLabel>
              <StepContent>
                <MUIFormControl component="fieldset">
                  <FormLabel component="legend">Choose Payment Method</FormLabel>
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  >
                    <FormControlLabel value="card" control={<Radio />} label="Credit Card" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                    <FormControlLabel value="apple_pay" control={<Radio />} label="Apple Pay" />
                    <FormControlLabel value="google_pay" control={<Radio />} label="Google Pay" />
                  </RadioGroup>
                </MUIFormControl>
                <Button
                  variant="contained"
                  onClick={() => setPaymentStep(1)}
                  disabled={!selectedPaymentMethod}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Enter Payment Details</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Enter your payment method details.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setPaymentStep(2)}
                >
                  Continue
                </Button>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Confirm Payment Method</StepLabel>
              <StepContent>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Review and confirm your payment method.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setShowPaymentDialog(false)}
                >
                  Add Payment Method
                </Button>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onClose={() => setShowRefundDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Refund for payment {selectedPayment?.id} - {formatAmount(selectedPayment?.amount || 0, selectedPayment?.currency || 'USD')}
          </Typography>
          <TextField
            fullWidth
            label="Refund Amount"
            type="number"
            margin="normal"
            defaultValue={selectedPayment?.amount || 0}
          />
          <TextField
            fullWidth
            label="Reason for Refund"
            multiline
            rows={3}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRefundDialog(false)}>Cancel</Button>
          <Button variant="contained" color="warning">
            Process Refund
          </Button>
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
