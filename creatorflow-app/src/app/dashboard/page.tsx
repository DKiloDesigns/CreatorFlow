'use client';
import { useEffect, useState } from 'react';
import Link from "next/link"
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAIReminder, setShowAIReminder] = useState(true);
  const { data: session, status } = useSession();
  const { hasAPIKey } = useAPIKey();

  // Mock data - in real app, this would come from API
  const [stats, setStats] = useState({
    totalPosts: 0,
    connectedAccounts: 0,
    totalEngagement: 0,
    scheduledPosts: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('cf_welcome_seen');
      if (!seen) setShowWelcome(true);
    }

    // Simulate loading
    setTimeout(() => {
      setStats({
        totalPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 2847,
        scheduledPosts: 5
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleClose = () => {
    setShowWelcome(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cf_welcome_seen', '1');
    }
  };

  const handleFeedbackSubmit = () => {
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedback('');
      setFeedbackSent(false);
    }, 2000);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your content today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBadge count={3} />
            <UserMenu />
          </div>
        </div>

        {/* AI Setup Reminder */}
        {!hasAPIKey && showAIReminder && (
          <AISetupReminder
            onSetup={() => window.location.href = '/dashboard/ai-tools'}
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
            onClick={() => window.location.href = '/dashboard/content'}
          />
          <StatsCard
            title="Connected Accounts"
            value={stats.connectedAccounts}
            description="Social platforms"
            icon={Users}
            variant="success"
            loading={isLoading}
            onClick={() => window.location.href = '/dashboard/accounts'}
          />
          <StatsCard
            title="Total Engagement"
            value={stats.totalEngagement.toLocaleString()}
            description="Likes, comments, shares"
            icon={Heart}
            trend={{ value: 8, isPositive: true, period: 'last week' }}
            loading={isLoading}
            onClick={() => window.location.href = '/dashboard/analytics'}
          />
          <StatsCard
            title="Scheduled Posts"
            value={stats.scheduledPosts}
            description="Ready to publish"
            icon={Calendar}
            variant="warning"
            loading={isLoading}
            onClick={() => window.location.href = '/dashboard/content'}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/content'}
                >
                  <FileText className="h-6 w-6" />
                  <span>Create Post</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/ai-tools'}
                >
                  <Brain className="h-6 w-6" />
                  <span>AI Tools</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/accounts'}
                >
                  <Users className="h-6 w-6" />
                  <span>Connect Account</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/analytics'}
                >
                  <BarChart2 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/collabs'}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Brand Collabs</span>
                </Button>
                <Button 
                  variant="outline"
                  className="h-16 flex flex-col items-center justify-center gap-2"
                  onClick={() => window.location.href = '/dashboard/billing'}
                >
                  <CreditCard className="h-6 w-6" />
                  <span>Billing</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.totalPosts > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Share2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Post published</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Account connected</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState
                  title="No activity yet"
                  description="Start creating content to see your activity here."
                  action={{
                    label: "Create First Post",
                    onClick: () => window.location.href = '/dashboard/content'
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
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Help us improve CreatorFlow</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We'd love to hear your feedback to make CreatorFlow even better.
                </p>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button 
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim() || feedbackSent}
                  >
                    {feedbackSent ? 'Sent!' : 'Send'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setShowGettingStarted(true)}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Getting Started Guide
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
} 