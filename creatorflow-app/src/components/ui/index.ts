// CreatorFlow UI Component Library - Main Export File
// Provides a clean, tree-shakeable API for all UI components

// Base Components
export { Button } from './base/Button';
export type { ButtonProps } from './base/Button';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './base/Card';
export type { CardProps } from './base/Card';

export { Input } from './base/Input';
export type { InputProps } from './base/Input';

export { Typography, H1, H2, H3, H4, H5, H6, P, Span } from './base/Typography';
export type { TypographyProps } from './base/Typography';

export { Icon, IconButton, IconText } from './base/Icon';
export type { IconProps } from './base/Icon';

// Layout Components
export { Container } from './layout/Container';
export type { ContainerProps } from './layout/Container';



export { Divider } from './layout/Divider';
export type { DividerProps } from './layout/Divider';

// Feedback Components
export { Alert } from './feedback/Alert';
export type { AlertProps } from './feedback/Alert';
export { AlertTitle, AlertDescription } from './feedback/mui-alert';

export { Badge } from './feedback/Badge';
export type { BadgeProps } from './feedback/Badge';

export { Progress } from './feedback/Progress';
export type { ProgressProps } from './feedback/Progress';

export { Skeleton, SkeletonText, SkeletonCircle, SkeletonRectangle, SkeletonRounded } from './feedback/Skeleton';
export type { SkeletonProps } from './feedback/Skeleton';

// Navigation Components
export { Breadcrumb } from './navigation/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './navigation/Breadcrumb';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './navigation/Tabs';
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from './navigation/Tabs';

export { Pagination } from './navigation/Pagination';
export type { PaginationProps } from './navigation/Pagination';

// Data Display Components
export { List, SimpleList, SelectableList, MultiSelectList, CheckboxList } from './data-display/mui-list';
export type { ListProps, ListItemProps } from './data-display/mui-list';

export { Timeline, ActivityTimeline, EventTimeline, SimpleTimeline } from './data-display/mui-timeline';
export type { TimelineProps, TimelineEvent } from './data-display/mui-timeline';

export { Stats, MetricCards, ProgressStats, TrendStats, CompactStats } from './data-display/mui-stats';
export type { StatsProps, StatItem } from './data-display/mui-stats';

// Overlay Components
export { Drawer, NavigationDrawer, SidebarDrawer, FilterDrawer, BottomDrawer, useDrawer } from './overlay/mui-drawer';
export type { DrawerProps, DrawerItem } from './overlay/mui-drawer';

export { Tooltip, InfoTooltip, WarningTooltip, ErrorTooltip, SuccessTooltip, QuickTooltip, SlowTooltip, InteractiveTooltip, ActionTooltip } from './overlay/mui-tooltip';
export type { TooltipProps, InteractiveTooltipProps, ActionTooltipProps } from './overlay/mui-tooltip';

export { Popover, MenuPopover, CardPopover, FormPopover, ContentPopover, usePopover } from './overlay/mui-popover';
export type { PopoverProps, PopoverItem } from './overlay/mui-popover';

// Additional Components
export { Label } from './label';
export { SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from './select';

// Form Components
export { Textarea } from './textarea';
export type { TextareaProps } from './textarea';

export { Select, Checkbox, CheckboxGroup, Radio, RadioGroup, Switch } from './form/mui-form-components';
export type { SelectProps, CheckboxProps, CheckboxGroupProps, RadioProps, RadioGroupProps, SwitchProps } from './form/mui-form-components';

// Theme Components
export { ThemeProvider, ColorSchemeToggle, HighContrastToggle, ThemeSettingsPanel, useThemeMode } from './theme/mui-theme-utilities';
export type { ThemeProviderProps } from './theme/mui-theme-utilities';



// Unified Dashboard Components (Phase 1)
export { default as ConnectedAccountsStory } from './connected-accounts-story';
// export { default as EnhancedBottomNavigation } from './enhanced-bottom-navigation';
export { default as UnifiedDashboardLayout } from './unified-dashboard-layout';
export type {
  DashboardSection,
  QuickStat,
  AIInsight,
  UnifiedDashboardLayoutProps
} from './unified-dashboard-layout';

// Phase 2 AI-Enhanced Content Creation Components
// export { default as AIContentCreation } from './ai-content-creation';
export { default as SmartScheduling } from './smart-scheduling';
// export { default as PerformanceTracking } from './performance-tracking';

// Phase 3 Advanced AI & Automation Components
export { default as AIWorkflowAutomation } from '../ai/ai-workflow-automation';
export { default as PredictiveContentIntelligence } from '../ai/predictive-content-intelligence';

// Phase 4 Analytics Enhancement Components
export { default as AdvancedPerformanceMetrics } from '../analytics/advanced-performance-metrics';
export { default as AdvancedAudienceIntelligence } from '../analytics/advanced-audience-intelligence';
export { default as CompetitiveIntelligence } from '../analytics/competitive-intelligence';

// Phase 5 Enterprise Features & Scaling Components
export { default as EnhancedTeamManagement } from '../enterprise/enhanced-team-management';
export { default as EnhancedEnterpriseAnalytics } from '../enterprise/enhanced-enterprise-analytics';
export { default as EnhancedAPIManagement } from '../enterprise/enhanced-api-management';
export { default as EnhancedAdvancedSecurity } from '../enterprise/enhanced-advanced-security';

// Phase 6 Advanced AI & Automation Components
export { default as AdvancedAIWorkflowAutomation } from '../ai/advanced-ai-workflow-automation';
export { default as IntelligentContentOptimization } from '../ai/intelligent-content-optimization';
export { default as PredictiveAnalyticsEngine } from '../ai/predictive-analytics-engine';
export { default as SmartWorkflowOrchestration } from '../ai/smart-workflow-orchestration';

// Phase 7 Advanced Integration & APIs Components
export { default as APIGatewayManagement } from '../integration/api-gateway-management';
export { default as ThirdPartyIntegrations } from '../integration/third-party-integrations';
export { default as WebhookManagement } from '../integration/webhook-management';
export { default as DataPipelineOrchestration } from '../integration/data-pipeline-orchestration';

// Phase 4 Analytics & Dashboard Enhancement Components
export { default as PerformanceAnalytics } from '../analytics/performance-analytics';
export { default as BusinessIntelligence } from '../analytics/business-intelligence';
