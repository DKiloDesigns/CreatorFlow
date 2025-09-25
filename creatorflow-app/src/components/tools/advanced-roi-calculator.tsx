"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
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
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Avatar,
  Rating
} from '@mui/material';
import {
  Assessment,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Insights,
  Speed,
  Flag,
  FlashOn,
  Star,
  StarBorder,
  ExpandMore,
  ExpandLess,
  PlayArrow,
  Pause,
  Stop,
  Save,
  Send,
  Image,
  VideoFile,
  Description,
  Tag,
  Event,
  Public,
  Lock,
  Group,
  Person,
  TrendingUp as TrendingUpIcon,
  AutoAwesome,
  Palette,
  Tune,
  Compare,
  Speed as SpeedIcon,
  EmojiEmotions,
  RecordVoiceOver,
  TextFields,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Transform,
  AutoFixHigh,
  ContentCut,
  ContentPaste,
  ContentPasteGo,
  ContentPasteOff,
  ContentPasteSearch,
  ContentPasteOutlined,
  ContentCopy as ContentCopyIcon,
  Download,
  Upload,
  CloudUpload,
  CloudDownload,
  CloudSync,
  CloudDone,
  CloudOff,
  CloudQueue,
  CloudCircle,
  Cloud,
  CloudDoneOutlined,
  CloudOffOutlined,
  CloudQueueOutlined,
  CloudCircleOutlined,
  CloudOutlined,
  FilterList,
  Sort,
  Refresh,
  GetApp,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DonutLarge,
  TrendingFlat as TrendingFlatIcon,
  DateRange,
  Today,
  Tomorrow,
  NextWeek,
  NextMonth,
  Schedule as ScheduleIcon,
  Notifications,
  NotificationsActive,
  NotificationsOff,
  NotificationsNone,
  NotificationsPaused,
  NotificationsImportant,
  NotificationsImportantOutlined,
  NotificationsImportantRounded,
  NotificationsImportantTwoTone,
  NotificationsOutlined,
  NotificationsRounded,
  NotificationsTwoTone,
  NotificationsNoneOutlined,
  NotificationsNoneRounded,
  NotificationsNoneTwoTone,
  NotificationsOffOutlined,
  NotificationsOffRounded,
  NotificationsOffTwoTone,
  NotificationsPausedOutlined,
  NotificationsPausedRounded,
  NotificationsPausedTwoTone,
  NotificationsActiveOutlined,
  NotificationsActiveRounded,
  NotificationsActiveTwoTone,
  Dashboard,
  DashboardCustomize,
  DashboardOutlined,
  DashboardRounded,
  DashboardTwoTone,
  ViewInAr,
  ViewInArOutlined,
  ViewInArRounded,
  ViewInArTwoTone,
  ViewModule,
  ViewModuleOutlined,
  ViewModuleRounded,
  ViewModuleTwoTone,
  ViewQuilt,
  ViewQuiltOutlined,
  ViewQuiltRounded,
  ViewQuiltTwoTone,
  ViewSidebar,
  ViewSidebarOutlined,
  ViewSidebarRounded,
  ViewSidebarTwoTone,
  ViewStream,
  ViewStreamOutlined,
  ViewStreamRounded,
  ViewStreamTwoTone,
  ViewWeek,
  ViewWeekOutlined,
  ViewWeekRounded,
  ViewWeekTwoTone,
  Visibility,
  VisibilityOff,
  VisibilityOutlined,
  VisibilityRounded,
  VisibilityTwoTone,
  VisibilityOffOutlined,
  VisibilityOffRounded,
  VisibilityOffTwoTone,
  VpnKey,
  VpnKeyOutlined,
  VpnKeyRounded,
  VpnKeyTwoTone,
  VpnLock,
  VpnLockOutlined,
  VpnLockRounded,
  VpnLockTwoTone,
  Warning,
  WarningAmber,
  WarningAmberOutlined,
  WarningAmberRounded,
  WarningAmberTwoTone,
  WarningOutlined,
  WarningRounded,
  WarningTwoTone,
  Watch,
  WatchLater,
  WatchLaterOutlined,
  WatchLaterRounded,
  WatchLaterTwoTone,
  WatchOutlined,
  WatchRounded,
  WatchTwoTone,
  Water,
  WaterDrop,
  WaterDropOutlined,
  WaterDropRounded,
  WaterDropTwoTone,
  WaterOutlined,
  WaterRounded,
  WaterTwoTone,
  WbSunny,
  WbSunnyOutlined,
  WbSunnyRounded,
  WbSunnyTwoTone,
  Wc,
  WcOutlined,
  WcRounded,
  WcTwoTone,
  Web,
  WebAsset,
  WebAssetOutlined,
  WebAssetRounded,
  WebAssetTwoTone,
  WebOutlined,
  WebRounded,
  WebTwoTone,
  Weekend,
  WeekendOutlined,
  WeekendRounded,
  WeekendTwoTone,
  West,
  WestOutlined,
  WestRounded,
  WestTwoTone,
  Whatshot,
  WhatshotOutlined,
  WhatshotRounded,
  WhatshotTwoTone,
  WheelchairPickup,
  WheelchairPickupOutlined,
  WheelchairPickupRounded,
  WheelchairPickupTwoTone,
  WhereToVote,
  WhereToVoteOutlined,
  WhereToVoteRounded,
  WhereToVoteTwoTone,
  Widgets,
  WidgetsOutlined,
  WidgetsRounded,
  WidgetsTwoTone,
  Wifi,
  WifiOff,
  WifiOffOutlined,
  WifiOffRounded,
  WifiOffTwoTone,
  WifiOutlined,
  WifiRounded,
  WifiTwoTone,
  Window,
  WindowOutlined,
  WindowRounded,
  WindowTwoTone,
  WineBar,
  WineBarOutlined,
  WineBarRounded,
  WineBarTwoTone,
  Woman,
  WomanOutlined,
  WomanRounded,
  WomanTwoTone,
  Work,
  WorkOff,
  WorkOffOutlined,
  WorkOffRounded,
  WorkOffTwoTone,
  WorkOutline,
  WorkOutlineOutlined,
  WorkOutlineRounded,
  WorkOutlineTwoTone,
  WorkOutlined,
  WorkRounded,
  WorkTwoTone,
  WorkspacePremium,
  WorkspacePremiumOutlined,
  WorkspacePremiumRounded,
  WorkspacePremiumTwoTone,
  Wysiwyg,
  WysiwygOutlined,
  WysiwygRounded,
  WysiwygTwoTone,
  Yard,
  YardOutlined,
  YardRounded,
  YardTwoTone,
  YoutubeSearchedFor,
  YoutubeSearchedForOutlined,
  YoutubeSearchedForRounded,
  YoutubeSearchedForTwoTone,
  ZoomIn,
  ZoomInMap,
  ZoomInMapOutlined,
  ZoomInMapRounded,
  ZoomInMapTwoTone,
  ZoomInOutlined,
  ZoomInRounded,
  ZoomInTwoTone,
  ZoomOut,
  ZoomOutMap,
  ZoomOutMapOutlined,
  ZoomOutMapRounded,
  ZoomOutMapTwoTone,
  ZoomOutOutlined,
  ZoomOutRounded,
  ZoomOutTwoTone,
  Search,
  FilterList,
  Sort,
  Refresh,
  GetApp,
  FileDownload,
  PictureAsPdf,
  TableChart,
  DonutLarge,
  TrendingFlat as TrendingFlatIcon,
  DateRange,
  Today,
  Tomorrow,
  NextWeek,
  NextMonth,
  Schedule as ScheduleIcon,
  Notifications,
  NotificationsActive,
  NotificationsOff,
  NotificationsNone,
  NotificationsPaused,
  NotificationsImportant,
  NotificationsImportantOutlined,
  NotificationsImportantRounded,
  NotificationsImportantTwoTone,
  NotificationsOutlined,
  NotificationsRounded,
  NotificationsTwoTone,
  NotificationsNoneOutlined,
  NotificationsNoneRounded,
  NotificationsNoneTwoTone,
  NotificationsOffOutlined,
  NotificationsOffRounded,
  NotificationsOffTwoTone,
  NotificationsPausedOutlined,
  NotificationsPausedRounded,
  NotificationsPausedTwoTone,
  NotificationsActiveOutlined,
  NotificationsActiveRounded,
  NotificationsActiveTwoTone,
  Dashboard,
  DashboardCustomize,
  DashboardOutlined,
  DashboardRounded,
  DashboardTwoTone,
  ViewInAr,
  ViewInArOutlined,
  ViewInArRounded,
  ViewInArTwoTone,
  ViewModule,
  ViewModuleOutlined,
  ViewModuleRounded,
  ViewModuleTwoTone,
  ViewQuilt,
  ViewQuiltOutlined,
  ViewQuiltRounded,
  ViewQuiltTwoTone,
  ViewSidebar,
  ViewSidebarOutlined,
  ViewSidebarRounded,
  ViewSidebarTwoTone,
  ViewStream,
  ViewStreamOutlined,
  ViewStreamRounded,
  ViewStreamTwoTone,
  ViewWeek,
  ViewWeekOutlined,
  ViewWeekRounded,
  ViewWeekTwoTone,
  Visibility,
  VisibilityOff,
  VisibilityOutlined,
  VisibilityRounded,
  VisibilityTwoTone,
  VisibilityOffOutlined,
  VisibilityOffRounded,
  VisibilityOffTwoTone,
  VpnKey,
  VpnKeyOutlined,
  VpnKeyRounded,
  VpnKeyTwoTone,
  VpnLock,
  VpnLockOutlined,
  VpnLockRounded,
  VpnLockTwoTone,
  Warning,
  WarningAmber,
  WarningAmberOutlined,
  WarningAmberRounded,
  WarningAmberTwoTone,
  WarningOutlined,
  WarningRounded,
  WarningTwoTone,
  Watch,
  WatchLater,
  WatchLaterOutlined,
  WatchLaterRounded,
  WatchLaterTwoTone,
  WatchOutlined,
  WatchRounded,
  WatchTwoTone,
  Water,
  WaterDrop,
  WaterDropOutlined,
  WaterDropRounded,
  WaterDropTwoTone,
  WaterOutlined,
  WaterRounded,
  WaterTwoTone,
  WbSunny,
  WbSunnyOutlined,
  WbSunnyRounded,
  WbSunnyTwoTone,
  Wc,
  WcOutlined,
  WcRounded,
  WcTwoTone,
  Web,
  WebAsset,
  WebAssetOutlined,
  WebAssetRounded,
  WebAssetTwoTone,
  WebOutlined,
  WebRounded,
  WebTwoTone,
  Weekend,
  WeekendOutlined,
  WeekendRounded,
  WeekendTwoTone,
  West,
  WestOutlined,
  WestRounded,
  WestTwoTone,
  Whatshot,
  WhatshotOutlined,
  WhatshotRounded,
  WhatshotTwoTone,
  WheelchairPickup,
  WheelchairPickupOutlined,
  WheelchairPickupRounded,
  WheelchairPickupTwoTone,
  WhereToVote,
  WhereToVoteOutlined,
  WhereToVoteRounded,
  WhereToVoteTwoTone,
  Widgets,
  WidgetsOutlined,
  WidgetsRounded,
  WidgetsTwoTone,
  Wifi,
  WifiOff,
  WifiOffOutlined,
  WifiOffRounded,
  WifiOffTwoTone,
  WifiOutlined,
  WifiRounded,
  WifiTwoTone,
  Window,
  WindowOutlined,
  WindowRounded,
  WindowTwoTone,
  WineBar,
  WineBarOutlined,
  WineBarRounded,
  WineBarTwoTone,
  Woman,
  WomanOutlined,
  WomanRounded,
  WomanTwoTone,
  Work,
  WorkOff,
  WorkOffOutlined,
  WorkOffRounded,
  WorkOffTwoTone,
  WorkOutline,
  WorkOutlineOutlined,
  WorkOutlineRounded,
  WorkOutlineTwoTone,
  WorkOutlined,
  WorkRounded,
  WorkTwoTone,
  WorkspacePremium,
  WorkspacePremiumOutlined,
  WorkspacePremiumRounded,
  WorkspacePremiumTwoTone,
  Wysiwyg,
  WysiwygOutlined,
  WysiwygRounded,
  WysiwygTwoTone,
  Yard,
  YardOutlined,
  YardRounded,
  YardTwoTone,
  YoutubeSearchedFor,
  YoutubeSearchedForOutlined,
  YoutubeSearchedForRounded,
  YoutubeSearchedForTwoTone,
  ZoomIn,
  ZoomInMap,
  ZoomInMapOutlined,
  ZoomInMapRounded,
  ZoomInMapTwoTone,
  ZoomInOutlined,
  ZoomInRounded,
  ZoomInTwoTone,
  ZoomOut,
  ZoomOutMap,
  ZoomOutMapOutlined,
  ZoomOutMapRounded,
  ZoomOutMapTwoTone,
  ZoomOutOutlined,
  ZoomOutRounded,
  ZoomOutTwoTone
} from '@/lib/mui-optimized-imports';
import { designTokens } from '@/lib/design-system';

// ROI calculation interfaces
interface ROICalculation {
  id: string;
  name: string;
  description: string;
  investment: number;
  revenue: number;
  profit: number;
  roi: number;
  paybackPeriod: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  breakEvenPoint: number;
  riskLevel: 'low' | 'medium' | 'high';
  category: string;
  timeline: string;
  createdAt: string;
  assumptions: string[];
  scenarios: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

interface FinancialProjection {
  id: string;
  name: string;
  period: string;
  revenue: number;
  costs: number;
  profit: number;
  cumulativeProfit: number;
  roi: number;
  growthRate: number;
  assumptions: string[];
}

interface InvestmentOpportunity {
  id: string;
  title: string;
  description: string;
  investment: number;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeline: string;
  category: string;
  roi: number;
  paybackPeriod: number;
  netPresentValue: number;
  internalRateOfReturn: number;
  breakEvenPoint: number;
  probability: number;
  recommendation: 'strong-buy' | 'buy' | 'hold' | 'sell' | 'strong-sell';
  createdAt: string;
}

interface AdvancedROICalculatorProps {
  onSave?: (calculation: ROICalculation) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function AdvancedROICalculator({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: AdvancedROICalculatorProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [calculations, setCalculations] = useState<ROICalculation[]>([]);
  const [projections, setProjections] = useState<FinancialProjection[]>([]);
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Mock data
  useEffect(() => {
    const mockCalculations: ROICalculation[] = [
      {
        id: '1',
        name: 'Content Creation Investment',
        description: 'Investment in professional equipment and software for content creation',
        investment: 5000,
        revenue: 15000,
        profit: 10000,
        roi: 200,
        paybackPeriod: 4,
        netPresentValue: 8500,
        internalRateOfReturn: 25,
        breakEvenPoint: 2.5,
        riskLevel: 'low',
        category: 'equipment',
        timeline: '12 months',
        createdAt: '2025-01-20T10:00:00Z',
        assumptions: ['Steady content production', 'Consistent audience growth', 'Stable monetization'],
        scenarios: {
          optimistic: 300,
          realistic: 200,
          pessimistic: 100
        }
      },
      {
        id: '2',
        name: 'Marketing Campaign',
        description: 'Paid advertising campaign to grow audience and increase engagement',
        investment: 3000,
        revenue: 8000,
        profit: 5000,
        roi: 167,
        paybackPeriod: 3,
        netPresentValue: 4200,
        internalRateOfReturn: 18,
        breakEvenPoint: 2,
        riskLevel: 'medium',
        category: 'marketing',
        timeline: '6 months',
        createdAt: '2025-01-19T14:30:00Z',
        assumptions: ['Effective targeting', 'Quality ad creative', 'Competitive market'],
        scenarios: {
          optimistic: 250,
          realistic: 167,
          pessimistic: 80
        }
      }
    ];

    const mockProjections: FinancialProjection[] = [
      {
        id: '1',
        name: 'Q1 2025 Projection',
        period: 'Q1 2025',
        revenue: 25000,
        costs: 15000,
        profit: 10000,
        cumulativeProfit: 10000,
        roi: 67,
        growthRate: 15,
        assumptions: ['Steady growth', 'New partnerships', 'Increased engagement']
      },
      {
        id: '2',
        name: 'Q2 2025 Projection',
        period: 'Q2 2025',
        revenue: 30000,
        costs: 18000,
        profit: 12000,
        cumulativeProfit: 22000,
        roi: 67,
        growthRate: 20,
        assumptions: ['Seasonal growth', 'New product launches', 'Expanded reach']
      }
    ];

    const mockOpportunities: InvestmentOpportunity[] = [
      {
        id: '1',
        title: 'Premium Content Subscription',
        description: 'Launch a premium subscription service for exclusive content',
        investment: 8000,
        expectedReturn: 25000,
        riskLevel: 'medium',
        timeline: '6 months',
        category: 'subscription',
        roi: 213,
        paybackPeriod: 3.5,
        netPresentValue: 18000,
        internalRateOfReturn: 22,
        breakEvenPoint: 2.8,
        probability: 75,
        recommendation: 'buy',
        createdAt: '2025-01-20T08:00:00Z'
      },
      {
        id: '2',
        title: 'Course Creation Platform',
        description: 'Develop and launch an online course platform',
        investment: 15000,
        expectedReturn: 45000,
        riskLevel: 'high',
        timeline: '12 months',
        category: 'education',
        roi: 200,
        paybackPeriod: 6,
        netPresentValue: 32000,
        internalRateOfReturn: 18,
        breakEvenPoint: 4.5,
        probability: 60,
        recommendation: 'hold',
        createdAt: '2025-01-19T16:45:00Z'
      }
    ];

    setCalculations(mockCalculations);
    setProjections(mockProjections);
    setOpportunities(mockOpportunities);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong-buy':
        return 'success';
      case 'buy':
        return 'success';
      case 'hold':
        return 'warning';
      case 'sell':
        return 'error';
      case 'strong-sell':
        return 'error';
      default:
        return 'default';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'success';
    if (roi >= 100) return 'warning';
    return 'error';
  };

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📊 Advanced ROI Calculator
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Detailed financial projections and business analysis. Calculate ROI, NPV, IRR, 
        and make data-driven investment decisions for your creator business.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="ROI Calculations" icon={<Assessment />} />
        <Tab label="Financial Projections" icon={<Timeline />} />
        <Tab label="Investment Opportunities" icon={<Flag />} />
        <Tab label="Scenario Analysis" icon={<Assessment />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            ROI Calculations & Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {calculations.map((calculation) => (
              <Grid item xs={12} md={6} key={calculation.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{calculation.name}</Typography>
                      <Chip 
                        label={calculation.riskLevel} 
                        color={getRiskColor(calculation.riskLevel) as any} 
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {calculation.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Investment
                        </Typography>
                        <Typography variant="h6">
                          ${calculation.investment.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h6">
                          ${calculation.revenue.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Profit
                        </Typography>
                        <Typography variant="h6">
                          ${calculation.profit.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ROI
                        </Typography>
                        <Typography variant="h6" color={getROIColor(calculation.roi)}>
                          {calculation.roi}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Payback Period
                        </Typography>
                        <Typography variant="h6">
                          {calculation.paybackPeriod} months
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          NPV
                        </Typography>
                        <Typography variant="h6">
                          ${calculation.netPresentValue.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          IRR
                        </Typography>
                        <Typography variant="h6">
                          {calculation.internalRateOfReturn}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Break Even
                        </Typography>
                        <Typography variant="h6">
                          {calculation.breakEvenPoint} months
                        </Typography>
                      </Grid>
                    </Grid>

                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="body2">Scenario Analysis</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Optimistic
                            </Typography>
                            <Typography variant="h6" color="success.main">
                              {calculation.scenarios.optimistic}%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Realistic
                            </Typography>
                            <Typography variant="h6" color="primary.main">
                              {calculation.scenarios.realistic}%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2" color="text.secondary">
                              Pessimistic
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {calculation.scenarios.pessimistic}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button size="small" startIcon={<Edit />}>Edit</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Financial Projections
          </Typography>
          
          <Grid container spacing={3}>
            {projections.map((projection) => (
              <Grid item xs={12} md={6} key={projection.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {projection.name}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Revenue
                        </Typography>
                        <Typography variant="h6">
                          ${projection.revenue.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Costs
                        </Typography>
                        <Typography variant="h6">
                          ${projection.costs.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Profit
                        </Typography>
                        <Typography variant="h6">
                          ${projection.profit.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ROI
                        </Typography>
                        <Typography variant="h6">
                          {projection.roi}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Growth Rate: {projection.growthRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cumulative: ${projection.cumulativeProfit.toLocaleString()}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Assumptions:</strong> {projection.assumptions.join(', ')}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Edit />}>Edit</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Investment Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {opportunities.map((opportunity) => (
              <Grid item xs={12} md={6} key={opportunity.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{opportunity.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={opportunity.riskLevel} 
                          color={getRiskColor(opportunity.riskLevel) as any} 
                          size="small"
                        />
                        <Chip 
                          label={opportunity.recommendation} 
                          color={getRecommendationColor(opportunity.recommendation) as any} 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {opportunity.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Investment
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.investment.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Expected Return
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.expectedReturn.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          ROI
                        </Typography>
                        <Typography variant="h6" color={getROIColor(opportunity.roi)}>
                          {opportunity.roi}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Probability
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.probability}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Payback: {opportunity.paybackPeriod} months
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Break Even: {opportunity.breakEvenPoint} months
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Timeline:</strong> {opportunity.timeline} • <strong>Category:</strong> {opportunity.category}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Add />}>Invest</Button>
                      <Button size="small" startIcon={<Save />}>Save</Button>
                      <Button size="small" startIcon={<Share />}>Share</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Scenario Analysis & Risk Assessment
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Risk Assessment Matrix
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Evaluate investment risks and potential returns
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Low Risk
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        3 investments
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Medium Risk
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        2 investments
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        High Risk
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        1 investment
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Portfolio
                      </Typography>
                      <Typography variant="h6">
                        6 investments
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Portfolio Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Overall portfolio performance and recommendations
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Investment
                      </Typography>
                      <Typography variant="h6">
                        $28K
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Expected Return
                      </Typography>
                      <Typography variant="h6">
                        $70K
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Average ROI
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        150%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Risk Score
                      </Typography>
                      <Typography variant="h6" color="warning.main">
                        6.5/10
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
