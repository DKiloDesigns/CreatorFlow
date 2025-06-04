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

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('cf_welcome_seen');
      if (!seen) setShowWelcome(true);
    }
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
      <div className="space-y-6 lg:flex lg:space-y-0 lg:space-x-8">
        <div className="flex-1">
          {showWelcome && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <Card className="max-w-md w-full shadow-lg">
                <CardHeader>
                  <CardTitle>Welcome to CreatorFlow!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-700">Get started in minutes. Here's your onboarding checklist:</p>
                  <ul className="mb-6 list-disc pl-5 space-y-2 text-gray-800">
                    <li>Connect a social account</li>
                    <li>Schedule your first post</li>
                    <li>Explore analytics</li>
                    <li>Upgrade to Pro or Business for more power</li>
                  </ul>
                  <Button className="w-full" onClick={handleClose}>Get Started</Button>
                </CardContent>
              </Card>
            </div>
          )}
          {showGettingStarted && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <Card className="max-w-md w-full shadow-lg">
                <CardHeader>
                  <CardTitle>Getting Started with CreatorFlow</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="mb-6 list-decimal pl-5 space-y-2 text-gray-800">
                    <li>Connect your first social account from the Accounts tab.</li>
                    <li>Schedule your first post using the Content dashboard.</li>
                    <li>Check your analytics to see your reach and engagement.</li>
                    <li>Upgrade to Pro or Business for more features and accounts.</li>
                  </ol>
                  <Button className="w-full" onClick={() => setShowGettingStarted(false)}>Close</Button>
                </CardContent>
              </Card>
            </div>
          )}
          {/* Welcome Section */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Manage your content and social accounts from one place.</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Content Stats */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    <div className="mt-4">
                      <Link
                        href="/dashboard/content"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        View all posts →
                      </Link>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>Tracks the total number of posts you've created and scheduled.</TooltipContent>
            </Tooltip>

            {/* Account Stats */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Connected Accounts</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    <div className="mt-4">
                      <Link
                        href="/dashboard/accounts"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Manage accounts →
                      </Link>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>Shows how many social media accounts you have connected to CreatorFlow.</TooltipContent>
            </Tooltip>

            {/* Premium Features */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Premium Features</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                    <div className="mt-4">
                      <Link
                        href="/dashboard/billing"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Upgrade plan →
                      </Link>
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>Upgrade to Pro or Business for more accounts, advanced analytics, and premium support.</TooltipContent>
            </Tooltip>
          </div>

          {/* Premium Features CTA */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-indigo-800">Upgrade to Premium</h3>
                <div className="mt-2 text-sm text-indigo-700">
                  <p>
                    Get access to advanced analytics, AI-powered content suggestions, and priority support.
                    <Link href="/dashboard/billing" className="font-medium underline text-indigo-700 hover:text-indigo-600">
                      Upgrade now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button className="mt-4" variant="outline" onClick={() => setShowGettingStarted(true)}>
            Getting Started
          </Button>
        </div>
        {/* Sidebar Card for Pro/Business Benefits (desktop) */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <Card className="shadow-lg border-indigo-200">
            <CardHeader>
              <CardTitle>Unlock More with Pro & Business</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="mb-4 list-disc pl-5 space-y-1 text-gray-800 text-sm">
                <li>Connect up to 10 (Pro) or 20+ (Business) social accounts</li>
                <li>Advanced analytics & reporting</li>
                <li>AI-powered content suggestions</li>
                <li>Team collaboration tools (Business)</li>
                <li>Priority support</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/dashboard/billing">See Plans</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Feedback Button (fixed, lower right) */}
        <div className="fixed bottom-6 right-6 z-50">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Feedback</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send Feedback</AlertDialogTitle>
              </AlertDialogHeader>
              {feedbackSent ? (
                <div className="py-8 text-center text-green-600 font-semibold">Thank you for your feedback!</div>
              ) : (
                <>
                  <Textarea
                    placeholder="Let us know what you think or report an issue..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="mb-4"
                    rows={4}
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={!feedback.trim()}
                      onClick={handleFeedbackSubmit}
                    >
                      Submit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {/* Mobile Banner for Pro/Business Benefits */}
      <div className="block lg:hidden mt-6">
        <Card className="shadow border-indigo-200">
          <CardHeader>
            <CardTitle>Unlock More with Pro & Business</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="mb-4 list-disc pl-5 space-y-1 text-gray-800 text-sm">
              <li>Connect up to 10 (Pro) or 20+ (Business) social accounts</li>
              <li>Advanced analytics & reporting</li>
              <li>AI-powered content suggestions</li>
              <li>Team collaboration tools (Business)</li>
              <li>Priority support</li>
            </ul>
            <Button className="w-full" asChild>
              <Link href="/dashboard/billing">See Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
} 