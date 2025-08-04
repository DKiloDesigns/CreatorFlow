'use client';
import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from "next-auth/react";
import { StatsCard } from '@/components/ui/stats-card';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedNavigation, UserMenu, Breadcrumbs } from '@/components/ui/enhanced-nav';
import { 
  FileText, 
  Users, 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  Brain,
  CreditCard
} from 'lucide-react';
import { AISetupReminder } from '@/components/ui/ai-setup-reminder';
import { useAPIKey } from '@/hooks/use-api-key';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { hasAPIKey } = useAPIKey();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showAIReminder, setShowAIReminder] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0,
  });

  useEffect(() => {
    // Add CSS to force white text in dark mode
    const style = document.createElement('style');
    style.textContent = `
      .dark h1, .dark p, .dark .text-gray-900 {
        color: white !important;
      }
      .dark .text-sm.font-medium {
        color: white !important;
      }
      .dark .text-base.font-semibold {
        color: white !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 15420,
        scheduledPosts: 5,
      });
      setIsLoading(false);
    }, 1000);

    // Show welcome modal for new users
    if (typeof window !== 'undefined') {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  };

  const handleFeedbackSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground break-words">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
            </h1>
            <p className="text-sm sm:text-base text-foreground break-words">
              Here's what's happening with your content today.
            </p>
          </div>
        </div>

        {/* AI Setup Reminder */}
        {!hasAPIKey && showAIReminder && (
          <AISetupReminder
            onSetup={() => router.push('/dashboard/ai-tools')}
            onDismiss={() => setShowAIReminder(false)}
          />
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts}
            description="Published this month"
            icon={FileText}
            trend={{ value: 12, isPositive: true, period: 'last month' }}
            loading={isLoading}
            onClick={() => router.push('/dashboard/content')}
          />
          <StatsCard
            title="Connected Accounts"
            value={stats.connectedAccounts}
            description="Social platforms"
            icon={Users}
            variant="success"
            loading={isLoading}
            onClick={() => router.push('/dashboard/accounts')}
            className="bg-gray-100 dark:bg-gray-800 border-green-500"
          />
          <StatsCard
            title="Total Engagement"
            value={stats.totalEngagement.toLocaleString()}
            description="Likes, comments, shares"
            icon={Heart}
            trend={{ value: 8, isPositive: true, period: 'last week' }}
            loading={isLoading}
            onClick={() => router.push('/dashboard/analytics')}
          />
          <StatsCard
            title="Scheduled Posts"
            value={stats.scheduledPosts}
            description="Ready to publish"
            icon={Calendar}
            variant="warning"
            loading={isLoading}
            onClick={() => router.push('/dashboard/content')}
            className="bg-gray-100 dark:bg-gray-800 border-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Create Content */}
          <Card className="lg:col-span-2 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground break-words">
                <Plus className="h-5 w-5 flex-shrink-0" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 min-w-[44px] min-h-[44px]"
                  onClick={() => router.push('/dashboard/content')}
                >
                  <FileText className="h-6 w-6 flex-shrink-0" />
                  <span className="text-sm break-words">Create Post</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 min-w-[44px] min-h-[44px]"
                  onClick={() => router.push('/dashboard/ai-tools')}
                >
                  <Brain className="h-6 w-6 flex-shrink-0" />
                  <span className="text-sm break-words">AI Tools</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 min-w-[44px] min-h-[44px]"
                  onClick={() => router.push('/dashboard/accounts')}
                >
                  <Users className="h-6 w-6 flex-shrink-0" />
                  <span className="text-sm break-words">Connect Account</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 min-w-[44px] min-h-[44px]"
                  onClick={() => router.push('/dashboard/scheduling')}
                >
                  <Calendar className="h-6 w-6 flex-shrink-0" />
                  <span className="text-sm break-words">Schedule</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Message */}
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Welcome back, Darrell Mayberry!</CardTitle>
              <CardDescription className="text-foreground">
                Here's what's happening with your content today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-foreground">Post published</span>
                </div>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-foreground">Account connected</span>
                </div>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Post published</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Account connected</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Modal */}
        {showWelcome && (
          <AlertDialog open={showWelcome} onOpenChange={setShowWelcome}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Welcome to CreatorFlow! 🎉</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Get started in minutes. Here's your onboarding checklist:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Connect a social account
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Schedule your first post
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Explore analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Upgrade to Pro for more power
                  </li>
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={handleClose}>
                  Get Started
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Getting Started Modal */}
        {showGettingStarted && (
          <AlertDialog open={showGettingStarted} onOpenChange={setShowGettingStarted}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Getting Started with CreatorFlow</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="space-y-4">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      1
                    </span>
                    <span>Connect your first social account from the Accounts tab.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      2
                    </span>
                    <span>Schedule your first post using the Content dashboard.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      3
                    </span>
                    <span>Check your analytics to see your reach and engagement.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                      4
                    </span>
                    <span>Upgrade to Pro or Business for more features and accounts.</span>
                  </li>
                </ol>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setShowGettingStarted(false)}>
                  Got it!
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowGettingStarted(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <Calendar className="h-4 w-4" />
            Getting Started Guide
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 