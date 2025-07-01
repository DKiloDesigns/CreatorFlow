'use client';
import { useEffect, useState } from 'react';
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
            </h1>
            <p className="text-black dark:text-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            className="bg-black text-white border-green-500"
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
            className="bg-black text-white border-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Content */}
          <Card className="lg:col-span-2 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/content')}
                >
                  <FileText className="h-6 w-6" />
                  <span>Create Post</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/ai-tools')}
                >
                  <Brain className="h-6 w-6" />
                  <span>AI Tools</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/accounts')}
                >
                  <Users className="h-6 w-6" />
                  <span>Connect Account</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/analytics')}
                >
                  <BarChart2 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/collabs')}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Brand Collabs</span>
                </Button>
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-700"
                  onClick={() => router.push('/dashboard/billing')}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Billing</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 bg-gray-100 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalPosts > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg">
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Share2 className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black dark:text-white">Post published</p>
                      <p className="text-xs text-black dark:text-white">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg">
                    <div className="h-8 w-8 flex items-center justify-center">
                      <Users className="h-4 w-4 text-black dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black dark:text-white">Account connected</p>
                      <p className="text-xs text-black dark:text-white">1 day ago</p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No activity yet"
                  description="Start creating content to see your activity here."
                  action={{
                    label: "Create First Post",
                    onClick: () => router.push('/dashboard/content')
                  }}
                  variant="minimal"
                />
              )}
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

        {/* Feedback Section */}
        <Card className="bg-gray-800 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-black dark:text-white">How are we doing?</h3>
                <p className="text-sm text-black dark:text-white mb-4">
                  We'd love to hear your feedback about CreatorFlow. What can we improve?
                </p>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[80px] text-black dark:text-white"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={handleFeedbackSubmit}>
                      Send Feedback
                    </Button>
                    <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={() => setFeedback('')}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowGettingStarted(true)}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
          >
            <Calendar className="h-4 w-4" />
            Getting Started Guide
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 