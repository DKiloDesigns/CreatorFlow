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
  Business,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  ShowChart,
  Timeline,
  Assessment,
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

// Brand partnership interfaces
interface Brand {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website: string;
  socialMedia: { platform: string; handle: string; followers: number }[];
  budget: { min: number; max: number; currency: string };
  targetAudience: string[];
  contentTypes: string[];
  platforms: string[];
  campaignTypes: string[];
  requirements: string[];
  timeline: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  companySize: string;
  verified: boolean;
  rating: number;
  responseTime: string;
  successRate: number;
  previousCampaigns: number;
  averageCampaignValue: number;
  tags: string[];
  createdAt: string;
  lastActive: string;
}

interface PartnershipOpportunity {
  id: string;
  title: string;
  description: string;
  brand: Brand;
  type: 'sponsorship' | 'affiliate' | 'collaboration' | 'ambassador' | 'event';
  budget: number;
  timeline: string;
  requirements: string[];
  deliverables: string[];
  platforms: string[];
  targetAudience: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  deadline: string;
  applications: number;
  maxApplications: number;
  skills: string[];
  experience: string;
  compensation: string;
  exclusivity: boolean;
  contractLength: string;
  renewal: boolean;
}

interface BrandPartnershipMatcherProps {
  onSave?: (data: any) => void;
  onExport?: (data: any) => void;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function BrandPartnershipMatcher({
  onSave,
  onExport,
  loading = false,
  error = null,
  className
}: BrandPartnershipMatcherProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [opportunities, setOpportunities] = useState<PartnershipOpportunity[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for industries
  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'technology', name: 'Technology' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'travel', name: 'Travel' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'beauty', name: 'Beauty' },
    { id: 'automotive', name: 'Automotive' },
    { id: 'finance', name: 'Finance' },
    { id: 'education', name: 'Education' }
  ];

  // Mock data for budget ranges
  const budgetRanges = [
    { id: 'all', name: 'All Budgets' },
    { id: '0-1000', name: '$0 - $1,000' },
    { id: '1000-5000', name: '$1,000 - $5,000' },
    { id: '5000-10000', name: '$5,000 - $10,000' },
    { id: '10000-50000', name: '$10,000 - $50,000' },
    { id: '50000+', name: '$50,000+' }
  ];

  // Mock data for partnership types
  const partnershipTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'sponsorship', name: 'Sponsorship' },
    { id: 'affiliate', name: 'Affiliate' },
    { id: 'collaboration', name: 'Collaboration' },
    { id: 'ambassador', name: 'Ambassador' },
    { id: 'event', name: 'Event' }
  ];

  // Mock data
  useEffect(() => {
    const mockBrands: Brand[] = [
      {
        id: '1',
        name: 'TechFlow Solutions',
        logo: 'https://via.placeholder.com/150',
        industry: 'technology',
        description: 'Leading provider of AI-powered business automation tools for creators and entrepreneurs.',
        website: 'https://techflow.com',
        socialMedia: [
          { platform: 'instagram', handle: '@techflow', followers: 250000 },
          { platform: 'twitter', handle: '@techflow', followers: 180000 },
          { platform: 'linkedin', handle: 'techflow-solutions', followers: 95000 }
        ],
        budget: { min: 5000, max: 25000, currency: 'USD' },
        targetAudience: ['creators', 'entrepreneurs', 'small business owners'],
        contentTypes: ['tutorials', 'reviews', 'case studies', 'lifestyle'],
        platforms: ['youtube', 'instagram', 'tiktok', 'linkedin'],
        campaignTypes: ['sponsorship', 'affiliate', 'collaboration'],
        requirements: ['10K+ followers', 'Tech content', 'Professional quality'],
        timeline: '2-4 weeks',
        contactPerson: 'Sarah Johnson',
        email: 'partnerships@techflow.com',
        phone: '+1-555-0123',
        location: 'San Francisco, CA',
        companySize: '50-200 employees',
        verified: true,
        rating: 4.8,
        responseTime: '24 hours',
        successRate: 92,
        previousCampaigns: 45,
        averageCampaignValue: 15000,
        tags: ['AI', 'automation', 'business', 'tech'],
        createdAt: '2025-01-15T10:00:00Z',
        lastActive: '2025-01-20T14:30:00Z'
      },
      {
        id: '2',
        name: 'EcoStyle Fashion',
        logo: 'https://via.placeholder.com/150',
        industry: 'fashion',
        description: 'Sustainable fashion brand committed to eco-friendly clothing and ethical production.',
        website: 'https://ecostyle.com',
        socialMedia: [
          { platform: 'instagram', handle: '@ecostyle', followers: 320000 },
          { platform: 'tiktok', handle: '@ecostyle', followers: 180000 },
          { platform: 'youtube', handle: 'EcoStyle Fashion', followers: 95000 }
        ],
        budget: { min: 2000, max: 15000, currency: 'USD' },
        targetAudience: ['fashion enthusiasts', 'eco-conscious consumers', 'young adults'],
        contentTypes: ['outfit posts', 'styling videos', 'sustainability content'],
        platforms: ['instagram', 'tiktok', 'youtube'],
        campaignTypes: ['sponsorship', 'collaboration', 'ambassador'],
        requirements: ['Fashion content', 'Sustainability focus', 'High engagement'],
        timeline: '1-3 weeks',
        contactPerson: 'Emma Rodriguez',
        email: 'partnerships@ecostyle.com',
        phone: '+1-555-0456',
        location: 'New York, NY',
        companySize: '20-50 employees',
        verified: true,
        rating: 4.6,
        responseTime: '48 hours',
        successRate: 88,
        previousCampaigns: 28,
        averageCampaignValue: 8500,
        tags: ['sustainable', 'fashion', 'eco-friendly', 'ethical'],
        createdAt: '2025-01-10T09:00:00Z',
        lastActive: '2025-01-19T16:45:00Z'
      }
    ];

    const mockOpportunities: PartnershipOpportunity[] = [
      {
        id: '1',
        title: 'AI Tools Tutorial Series',
        description: 'Create a series of tutorials showcasing our AI automation tools for content creators.',
        brand: mockBrands[0],
        type: 'sponsorship',
        budget: 15000,
        timeline: '4 weeks',
        requirements: ['Tech expertise', 'Video editing skills', '10K+ followers'],
        deliverables: ['3 tutorial videos', '5 Instagram posts', '1 blog post'],
        platforms: ['youtube', 'instagram'],
        targetAudience: ['creators', 'entrepreneurs'],
        status: 'open',
        createdAt: '2025-01-20T08:00:00Z',
        deadline: '2025-02-20T23:59:59Z',
        applications: 12,
        maxApplications: 20,
        skills: ['AI', 'tutorial', 'video editing'],
        experience: '2+ years',
        compensation: '$15,000 + product',
        exclusivity: true,
        contractLength: '6 months',
        renewal: true
      },
      {
        id: '2',
        title: 'Sustainable Fashion Campaign',
        description: 'Partner with us to promote our new sustainable fashion line through authentic content.',
        brand: mockBrands[1],
        type: 'collaboration',
        budget: 8000,
        timeline: '3 weeks',
        requirements: ['Fashion content', 'Sustainability focus', 'High engagement'],
        deliverables: ['5 outfit posts', '3 styling videos', '2 Instagram stories'],
        platforms: ['instagram', 'tiktok'],
        targetAudience: ['fashion enthusiasts', 'eco-conscious consumers'],
        status: 'open',
        createdAt: '2025-01-19T14:30:00Z',
        deadline: '2025-02-19T23:59:59Z',
        applications: 8,
        maxApplications: 15,
        skills: ['fashion', 'styling', 'sustainability'],
        experience: '1+ years',
        compensation: '$8,000 + clothing',
        exclusivity: false,
        contractLength: '3 months',
        renewal: false
      }
    ];

    setBrands(mockBrands);
    setOpportunities(mockOpportunities);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock search result
    const newBrand: Brand = {
      id: Date.now().toString(),
      name: 'Search Result Brand',
      logo: 'https://via.placeholder.com/150',
      industry: selectedIndustry,
      description: `Brand matching "${searchQuery}"`,
      website: 'https://example.com',
      socialMedia: [],
      budget: { min: 1000, max: 5000, currency: 'USD' },
      targetAudience: ['general'],
      contentTypes: ['content'],
      platforms: ['instagram'],
      campaignTypes: ['sponsorship'],
      requirements: ['content creation'],
      timeline: '2 weeks',
      contactPerson: 'Contact Person',
      email: 'contact@example.com',
      phone: '+1-555-0000',
      location: 'Location',
      companySize: 'Small',
      verified: false,
      rating: 4.0,
      responseTime: '48 hours',
      successRate: 80,
      previousCampaigns: 5,
      averageCampaignValue: 3000,
      tags: [searchQuery],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    setBrands([newBrand, ...brands]);
    setIsSearching(false);
  };

  const getIndustryColor = (industry: string) => {
    const colors: { [key: string]: string } = {
      technology: 'primary',
      fashion: 'secondary',
      food: 'success',
      travel: 'info',
      fitness: 'warning',
      beauty: 'error',
      automotive: 'default',
      finance: 'primary',
      education: 'secondary'
    };
    return colors[industry] || 'default';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sponsorship':
        return 'primary';
      case 'affiliate':
        return 'secondary';
      case 'collaboration':
        return 'success';
      case 'ambassador':
        return 'warning';
      case 'event':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredBrands = brands.filter(brand => {
    const matchesIndustry = selectedIndustry === 'all' || brand.industry === selectedIndustry;
    const matchesBudget = selectedBudget === 'all' || 
      (selectedBudget === '0-1000' && brand.budget.max <= 1000) ||
      (selectedBudget === '1000-5000' && brand.budget.min >= 1000 && brand.budget.max <= 5000) ||
      (selectedBudget === '5000-10000' && brand.budget.min >= 5000 && brand.budget.max <= 10000) ||
      (selectedBudget === '10000-50000' && brand.budget.min >= 10000 && brand.budget.max <= 50000) ||
      (selectedBudget === '50000+' && brand.budget.min >= 50000);
    return matchesIndustry && matchesBudget;
  });

  const filteredOpportunities = opportunities.filter(opportunity => {
    const matchesType = selectedType === 'all' || opportunity.type === selectedType;
    return matchesType;
  });

  return (
    <Box className={className} sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        🤝 Brand Partnership Matcher
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
        Connect with brands and find partnership opportunities. Discover sponsorships, 
        collaborations, and affiliate programs that match your content and audience.
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Discover Brands" icon={<Business />} />
        <Tab label="Partnership Opportunities" icon={<Flag />} />
        <Tab label="My Applications" icon={<Description />} />
        <Tab label="Brand Insights" icon={<Insights />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Search brands or keywords"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry.id} value={industry.id}>
                          {industry.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Budget</InputLabel>
                    <Select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                    >
                      {budgetRanges.map((range) => (
                        <MenuItem key={range.id} value={range.id}>
                          {range.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      {partnershipTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    startIcon={isSearching ? <CircularProgress size={20} /> : <Search />}
                    fullWidth
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Brands List */}
          <Grid container spacing={3}>
            {filteredBrands.map((brand) => (
              <Grid item xs={12} md={6} key={brand.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar src={brand.logo} sx={{ width: 60, height: 60 }} />
                        <Box>
                          <Typography variant="h6">
                            {brand.name}
                            {brand.verified && <Star sx={{ ml: 1, color: 'primary.main', fontSize: 20 }} />}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {brand.industry.charAt(0).toUpperCase() + brand.industry.slice(1)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={brand.industry} 
                          color={getIndustryColor(brand.industry) as any} 
                          size="small"
                        />
                        <Chip 
                          label={`${brand.budget.min.toLocaleString()}-${brand.budget.max.toLocaleString()}`} 
                          color="primary" 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {brand.description}
                    </Typography>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Budget Range
                        </Typography>
                        <Typography variant="h6">
                          ${brand.budget.min.toLocaleString()} - ${brand.budget.max.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={brand.rating} readOnly size="small" />
                          <Typography variant="body2">
                            {brand.rating}/5
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {brand.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" />
                      ))}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Platforms:</strong> {brand.platforms.join(', ')} • <strong>Location:</strong> {brand.location}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Response Time: {brand.responseTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate: {brand.successRate}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Send />}>Contact</Button>
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
            Partnership Opportunities
          </Typography>
          
          <Grid container spacing={3}>
            {filteredOpportunities.map((opportunity) => (
              <Grid item xs={12} md={6} key={opportunity.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{opportunity.title}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                          label={opportunity.type} 
                          color={getTypeColor(opportunity.type) as any} 
                          size="small"
                        />
                        <Chip 
                          label={opportunity.status} 
                          color={getStatusColor(opportunity.status) as any} 
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {opportunity.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={opportunity.brand.logo} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {opportunity.brand.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {opportunity.brand.industry} • {opportunity.brand.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.budget.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Timeline
                        </Typography>
                        <Typography variant="h6">
                          {opportunity.timeline}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Requirements:</strong> {opportunity.requirements.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Deliverables:</strong> {opportunity.deliverables.join(', ')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Compensation:</strong> {opportunity.compensation}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Applications: {opportunity.applications}/{opportunity.maxApplications}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Send />}>Apply</Button>
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
            My Applications
          </Typography>
          
          <Grid container spacing={3}>
            {filteredOpportunities.slice(0, 4).map((opportunity) => (
              <Grid item xs={12} md={6} key={opportunity.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {opportunity.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar src={opportunity.brand.logo} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {opportunity.brand.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Applied: {new Date(opportunity.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip 
                          label="Under Review" 
                          color="warning" 
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="h6">
                          ${opportunity.budget.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Timeline:</strong> {opportunity.timeline} • <strong>Type:</strong> {opportunity.type}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<Visibility />}>View Details</Button>
                      <Button size="small" startIcon={<Edit />}>Edit Application</Button>
                      <Button size="small" startIcon={<Cancel />}>Withdraw</Button>
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
            Brand Insights & Analytics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Partnership Performance
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Track your brand partnership success and ROI
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Partnerships
                      </Typography>
                      <Typography variant="h4">
                        12
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Success Rate
                      </Typography>
                      <Typography variant="h4">
                        85%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">
                        $45K
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Campaign Value
                      </Typography>
                      <Typography variant="h4">
                        $3.7K
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
                    Top Performing Brands
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Brands with highest engagement and ROI
                  </Typography>
                  
                  <List>
                    {brands.slice(0, 3).map((brand, index) => (
                      <ListItem key={brand.id}>
                        <ListItemIcon>
                          <Avatar src={brand.logo} sx={{ width: 32, height: 32 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={brand.name}
                          secondary={`${brand.rating}/5 • ${brand.successRate}% success`}
                        />
                        <ListItemSecondaryAction>
                          <Typography variant="body2" color="text.secondary">
                            #{index + 1}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
