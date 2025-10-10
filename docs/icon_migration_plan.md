# 🗺️ Lucide-to-MUI Icon Migration Plan

## 📊 Migration Overview:
**Total Files:** 91 files with Lucide imports  
**Priority Order:** Navigation → Core UI → Content → AI/Analytics → Utilities

---

## 🎯 Phase 1: Navigation Components (Highest Priority)
**Files:** 5 files  
**Impact:** Core user navigation experience

### **1. Breadcrumbs & Navigation**
- `src/components/ui/navigation/mui-breadcrumb.tsx` - ChevronRight, Home
- `src/components/ui/navigation/Breadcrumb.tsx` - ChevronRight, Home  
- `src/components/ui/navigation/Pagination.tsx` - ChevronLeft, ChevronRight, MoreHorizontal
- `src/components/ui/navigation/Menu.tsx` - ChevronDown, Check, Circle
- `src/components/ui/page-header.tsx` - ChevronRight, Home

**MUI Equivalents:** 
- `ChevronRight` → `ChevronRightIcon` 
- `Home` → `HomeIcon`
- `ChevronLeft` → `ChevronLeftIcon`
- `ChevronDown` → `ExpandMoreIcon` 
- `Check` → `CheckIcon`
- `Circle` → `CircleIcon` (or use MUI's RadioButtonUnchecked)
- `MoreHorizontal` → `MoreHorizIcon`

---

## 🎯 Phase 2: Notification System
**Files:** 4 files  
**Impact:** User notifications and alerts

### **2. Notification Components**
- `src/components/notifications/FloatingNotificationIcon.tsx` - Bell, Sparkles, Zap, Settings, X, MailCheck, RefreshCw
- `src/components/notifications/MobileNotificationIcon.tsx` - Bell, Sparkles, Zap, X, CheckCircle, MoreVert
- `src/components/notifications/ModernNotificationSystem.tsx` - Bell, Sparkles, Zap, Star, Heart
- `src/components/ui/notification-badge.tsx` - Bell, X, CheckCircle, AlertCircle, Info

**MUI Equivalents:**
- `Bell` → `NotificationsIcon`
- `Sparkles` → `AutoAwesomeIcon` 
- `Zap` → `BoltIcon` or `FlashOnIcon`
- `Settings` → `SettingsIcon`
- `X` → `CloseIcon`
- `MailCheck` → `MarkEmailReadIcon`
- `RefreshCw` → `RefreshIcon`
- `CheckCircle` → `CheckCircleIcon`
- `MoreVert` → `MoreVertIcon`
- `Star` → `StarIcon`
- `Heart` → `FavoriteIcon`
- `AlertCircle` → `ErrorIcon` or `WarningIcon`
- `Info` → `InfoIcon`

---

## 🎯 Phase 3: Dashboard & Core Navigation
**Files:** 4 files  
**Impact:** Main dashboard experience

### **3. Dashboard Layout & Navigation**
- `src/app/dashboard/layout.tsx` - 30+ icons (BarChart2, Users, FileText, Handshake, CreditCard, Menu, Bell, etc.)
- `src/app/dashboard/billing/page.tsx` - Check, X, CreditCard, Calendar, Users, Zap, Shield, Star
- `src/app/dashboard/security/*` - Shield, Lock, ShieldCheck, History
- `src/app/dashboard/teams/*` - Users, Activity, Settings, Edit, ArrowLeft, Users2, etc.

**Key MUI Equivalents:**
- `BarChart2` → `AssessmentIcon` or `BarChartIcon`
- `Users` → `PeopleIcon` or `GroupIcon`
- `FileText` → `DescriptionIcon` or `ArticleIcon`
- `Handshake` → `HandshakeIcon` (custom or use People)
- `CreditCard` → `CreditCardIcon`
- `Menu` → `MenuIcon`
- `Shield` → `SecurityIcon` or `ShieldIcon`
- `Lock` → `LockIcon`
- `History` → `HistoryIcon`
- `Edit` → `EditIcon`
- `ArrowLeft` → `ArrowBackIcon`

---

## 🎯 Phase 4: Authentication & Settings
**Files:** 5 files  
**Impact:** User account management

### **4. Auth & Settings Pages**
- `src/app/settings/page.tsx` (Completed)
- `src/app/security/page.tsx` (Completed)
- `src/app/contact/page.tsx` (Completed)
- `src/app/forgot-password/page.tsx` (Completed)
- `src/app/reset-password/page.tsx` (Completed)

**MUI Equivalents:**
- `Activity` → `TrendingUpIcon` or `TimelineIcon`
- `RefreshCw` → `RefreshIcon`
- `AlertTriangle` → `WarningIcon`
- `Eye` → `VisibilityIcon`
- `EyeOff` → `VisibilityOffIcon`
- `Download` → `DownloadIcon`
- `Mail` → `EmailIcon`
- `Phone` → `PhoneIcon`
- `MapPin` → `LocationOnIcon`
- `Clock` → `AccessTimeIcon`
- `MessageCircle` → `ChatIcon` or `MessageIcon`
- `Send` → `SendIcon`
- `KeyRound` → `VpnKeyIcon`
- `Loader2` → `CircularProgress` component

---

## 🎯 Phase 5: Content Management
**Files:** 8 files (all completed)  
**Impact:** Content creation and management

### **5. Content Components**
- `src/app/dashboard/content/_components/content-table.tsx` (Completed)
- `src/app/dashboard/content/_components/bulk-schedule-modal.tsx` (Completed)
- `src/app/dashboard/content/_components/content-calendar.tsx` (Completed)
- `src/app/dashboard/content/_components/create-video-modal.tsx` (Completed)
- `src/app/dashboard/content/_components/edit-post-form.tsx` (Completed)
- `src/app/dashboard/content/_components/media-library.tsx` (Completed)
- `src/app/dashboard/content/_components/post-composer.tsx` (Completed)
- `src/app/dashboard/content/page.tsx` (Completed)
- Icons: Edit, Trash2, Upload, Calendar, Plus, FileText, Image, Video, etc.

**MUI Equivalents:**
- `Edit` → `EditIcon`
- `Trash2` → `DeleteIcon`
- `Upload` → `CloudUploadIcon`
- `Calendar` → `CalendarTodayIcon`
- `Plus` → `AddIcon`
- `FileText` → `DescriptionIcon`
- `Image` → `ImageIcon`
- `Video` → `VideoLibraryIcon`

---

## 🎯 Phase 6: AI & Analytics
**Files:** 37 files (all completed)  
**Impact:** AI features and analytics dashboards

### **6. AI & Analytics Components**
- `src/components/analytics/TopPostsList.tsx` (Completed)
- `src/app/dashboard/content/smart-workflow/page.tsx` (Completed)
- `src/app/scheduling/page.tsx` (Completed)
- `src/app/dashboard/notifications/enhanced/page.tsx` (Completed)
- `src/app/dashboard/phase2-hub/page.tsx` (Completed)
- `src/app/testing/page.tsx` (Completed)
- `src/components/ui/ai-provider-selector.tsx` (Completed)
- `src/app/dashboard/content/_components/template-manager.tsx` (Completed)
- `src/app/dashboard/content/_components/use-template-modal.tsx` (Completed)
- `src/components/ui/advanced-hashtag-recommender.tsx` (Completed)
- `src/components/ui/content-performance-predictor.tsx` (Completed)
- `src/app/dashboard/content-management/page.tsx` (Completed)
- `src/components/ui/api-key-setup.tsx` (Completed)
- `src/app/testing/summary/page.tsx` (Completed)
- `src/app/dashboard/content/_components/usage-modal.tsx` (Completed)
- `src/components/TrialStatus.tsx` (Completed)
- `src/components/dashboard/ai-caption-generator.tsx` (Completed)
- `src/app/dashboard/content/_components/upload-media-modal.tsx` (Completed)
- `src/app/dashboard/content/_components/snippet-manager.tsx` (Completed)
- `src/app/dashboard/billing/BillingClientComponent.tsx` (Completed)
- `src/app/analytics/page.tsx` (Completed)
- `src/app/advanced-integrations/page.tsx` (Completed)
- `src/app/auth-debug/page.tsx` (Completed)
- `src/app/admin/performance/page.tsx` (Completed)
- `src/components/dashboard/ai-content-voice.tsx` (Completed)
- `src/components/dashboard/ai-content-translator.tsx` (Completed)
- `src/components/ui/ai-onboarding.tsx` (Completed)
- `src/components/MobileOptimizer.tsx` (Completed)
- `src/components/dashboard/ai-hashtag-generator.tsx` (Completed)
- `src/components/analytics/InsightsPanel.tsx` (Completed)
- `src/components/analytics/AnalyticsOverview.tsx` (Completed)
- `src/app/dashboard/teams/page.tsx` (Completed)
- `src/app/dashboard/support/page.tsx` (Completed)
- `src/components/dashboard/ai-content-analyzer.tsx` (Completed)
- `src/components/dashboard/ai-content-audience.tsx` (Completed)
- `src/components/dashboard/ai-content-brand.tsx` (Completed)
- `src/components/dashboard/ai-content-engagement.tsx` (Completed)
- `src/components/dashboard/ai-content-expander.tsx` (Completed)
- `src/components/dashboard/ai-content-optimizer.tsx` (Completed)

**MUI Equivalents:**
- `Brain` → `PsychologyIcon` or `AutoAwesomeIcon`
- `Globe` → `PublicIcon`
- `TrendingUp` → `TrendingUpIcon`
- `Heart` → `FavoriteIcon`
- `MessageSquare` → `ChatIcon`
- `Share2` → `ShareIcon`
- `Activity` → `TrendingUpIcon` or `TimelineIcon`
- `Sparkles` → `AutoAwesomeIcon`
- `CheckCircle` → `CheckCircleIcon`
- `Calendar` → `CalendarMonthIcon`
- `Edit` → `EditIcon`
- `Trash2` → `DeleteIcon`
- `Play` → `PlayArrowIcon`
- `Users` → `GroupIcon` or `PeopleIcon`
- `UserPlus` → `PersonAddIcon`
- `Settings` → `SettingsIcon`
- `Search` → `SearchIcon`
- `RefreshCw` → `RefreshIcon`
- `AlertTriangle` → `WarningIcon`
- `Eye` → `VisibilityIcon`
- `FileText` → `DescriptionIcon`
- `Image` → `ImageIcon`
- `Video` → `VideocamIcon`
- `Upload` → `CloudUploadIcon`
- `Clock` → `AccessTimeIcon`
- `Lightbulb` → `LightbulbOutlinedIcon`
- `Target` → `AdjustIcon`
- `Lock` → `LockIcon`
- `Plus` → `AddIcon`
- `Copy` → `ContentCopyIcon`
- `Download` → `DownloadIcon`
- `Hash` → `TagIcon`

---

## 🎯 Phase 7: General UI & Remaining Pages
**Files:** 47 files  
**Impact:** Various core UI and page-specific elements

### **7. General UI & Remaining Pages Components**
- `src/app/support/page.tsx` (Completed)
- `src/components/mobile/unified-mobile-controls.tsx` (Completed)
- `src/components/collaboration/MinimalCollaborationPanel.tsx` (Completed)
- `src/components/mobile/touch-interactions.tsx` (Completed)
- `src/components/mobile/mobile-ux-enhancements.tsx` (Completed)
- `src/app/dashboard/mobile-test/page.tsx` (Completed)
- `src/components/testing/mobile-test-suite.tsx` (Completed)
- `src/components/mobile/mobile-performance.tsx` (Completed)
- `src/components/security/audit-log-viewer.tsx` (Completed)
- `src/components/security/security-dashboard.tsx` (Completed)
- `src/components/mobile/pwa-enhancements.tsx` (Completed)
- `src/app/dashboard/messaging/page.tsx` (Completed)
- `src/app/dashboard/page.tsx` (Completed)
- `src/components/navigation/bottom-nav.tsx` (Completed)
- `src/components/messaging/FloatingMessengerIcon.tsx` (Completed)
- `src/components/notifications/RichNotificationCard.tsx` (Completed)
- `src/components/notifications/EnhancedNotificationCenter.tsx` (Completed)
- `src/components/notifications/NotificationGroup.tsx` (Completed)
- `src/app/support/article/[id]/page.tsx` (Completed)
- `src/app/auth/page.tsx` (Completed)
- `src/components/dashboard/enhanced-composer.tsx` (Completed)
- `src/app/enterprise/doc/[id]/page.tsx` (Completed)
- `src/components/ui/interactive-tutorial.tsx` (Completed)
- `src/components/ui/visual-tutorial-step.tsx` (Completed)
- `src/app/tutorials/page.tsx` (Completed)
- `src/components/ui/video-library.tsx` (Completed)
- `src/components/ui/page-help-button.tsx` (Completed)
- `src/components/onboarding/enhanced-onboarding-modal.tsx` (Completed)
- `src/components/ui/contextual-tips.tsx` (Completed)
- `src/app/admin/tests/page.tsx` (Completed)
- `src/app/enterprise/page.tsx` (Completed)
- `src/components/InteractiveMobileDemo.tsx` (Completed)
- `src/components/MobileAnimations.tsx` (Completed)
- `src/components/PWAFeatures.tsx` (Completed)
- `src/components/MobileFeatureShowcase.tsx` (Completed)
- `src/components/MobileProcessFlow.tsx` (Completed)
- `src/components/SubscriptionStatus.tsx` (Completed)
- `src/app/dashboard/content/_components/smart-content-workflow.tsx` (Completed)
- `src/components/ui/pro-feature-gate.tsx` (Completed)
- `src/app/dashboard/accounts/page.tsx` (Completed)
- `src/components/ui/mui-enhanced-nav.tsx` (Completed)
- `src/app/dashboard/profile/page.tsx` (Completed)
- `src/app/dashboard/_components/mini-calendar.tsx` (Completed)
- `src/components/ui/optimal-posting-time-predictor.tsx` (Completed)
- `src/components/ui/ai-provider-setup-modal.tsx` (Completed)
- `src/components/ui/smart-caption-generator.tsx` (Completed)
- `src/components/error/ErrorBoundary.tsx` (Completed)
- `src/app/dashboard/notifications/page.tsx` (Completed)
- `src/components/notifications/NotificationPreferences.tsx` (Completed)
- `src/components/ui/base/Icon/index.tsx` (Completed)
- `src/components/dashboard/social-account-status.tsx`
- `src/components/dashboard/ai-posting-times.tsx`
- `src/components/dashboard/ai-content-ideas.tsx`
- `src/components/dashboard/accounts/connected-account-list.tsx`
- `src/components/dashboard/accounts/connected-account-card.tsx`
- `src/components/analytics/AnalyticsDashboard.tsx`
- `src/app/admin/feedback/page.tsx`
- `src/app/admin/campaign/page.tsx`
- `src/app/admin/sessions/page.tsx`
- `src/app/smart-notifications-demo/page.tsx`
- `src/components/notifications/SmartNotificationCenter.tsx`
- `src/app/content-builder-demo/page.tsx`
- `src/components/content-builder/DragDropContentBuilder.tsx`
- `src/components/collaboration/CollaborationPanel.tsx`
- `src/components/dashboard/ai-content-tone.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/ai-setup-reminder.tsx`
- `src/components/PromoCodeInput.tsx`
- `src/components/ui/feedback/Alert.tsx`
- `src/components/ui/mui-stats-card.tsx`
- `src/components/FeedbackWidget.tsx`
- `src/components/ui/feedback/Badge.tsx`
- `src/app/blog/page.tsx`
- `src/app/mui-demo/navigation/page.tsx`
- `src/app/integrations/page.tsx`
- `src/app/dashboard/collabs/page.tsx`
- `src/app/dashboard/settings/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/admin/audit-log/page.tsx`

**MUI Equivalents (common icons - specific files will have more detailed mappings):**
- `Bell` → `NotificationsIcon`
- `Activity` → `TrendingUpIcon` or `TimelineIcon`
- `RefreshCw` → `RefreshIcon`
- `AlertTriangle` → `WarningIcon`
- `Eye` → `VisibilityIcon`
- `EyeOff` → `VisibilityOffIcon`
- `Download` → `DownloadIcon`
- `Mail` → `EmailIcon`
- `Phone` → `PhoneIcon`
- `MapPin` → `LocationOnIcon`
- `Clock` → `AccessTimeIcon`
- `MessageCircle` → `ChatIcon` or `MessageIcon`
- `Send` → `SendIcon`
- `KeyRound` → `VpnKeyIcon`
- `Loader2` → `CircularProgress` component
- `ArrowLeft` → `ArrowBackIcon`
- `User` → `PersonIcon`
- `Lock` → `LockIcon`
- `Menu` → `MenuIcon`
- `X` → `CloseIcon`
- `Hand` → `TouchAppIcon`
- `Swipe` → `SwipeIcon`
- `Pinch` → `ZoomOutMapIcon`
- `RotateCcw` → `RefreshIcon`
- `Smartphone` → `SmartphoneIcon`
- `Tablet` → `TabletIcon`
- `Monitor` → `DesktopWindowsIcon`
- `Wifi` → `WifiIcon`
- `WifiOff` → `WifiOffIcon`
- `Battery` → `BatteryFullIcon`
- `BatteryLow` → `BatteryAlertIcon`
- `Volume2` → `VolumeUpIcon`
- `VolumeX` → `VolumeOffIcon`
- `Sun` → `WbSunnyIcon`
- `Moon` → `DarkModeIcon`
- `Zap` → `BoltIcon`
- `Play` → `PlayArrowIcon`
- `CheckCircle` → `CheckCircleIcon`
- `XCircle` → `CancelIcon`
- `Share2` → `ShareIcon`
- `Bookmark`