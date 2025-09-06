'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { Bell, Activity, Settings, AlertTriangle, CheckCircle, Zap, Info, Send } from 'lucide-react';
import { NotificationToast } from '@/components/ui/notification-badge';
import { CardDescription } from '@/components/ui/base/Card';
import { Badge } from '@/components/ui/badge';

export default function NotificationTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ title: string; message?: string; variant: 'success' | 'error' | 'info' } | null>(null);

  const testNotifications = [
    {
      type: 'system_alert',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM UTC.',
      severity: 'medium',
      category: 'maintenance',
      icon: <Bell className="h-5 w-5" />,
      color: 'text-blue-600',
    },
    {
      type: 'security_alert',
      title: 'New Login Detected',
      message: 'A new login was detected from an unknown device.',
      severity: 'high',
      category: 'security',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: 'text-red-600',
    },
    {
      type: 'content_alert',
      title: 'Post Scheduled Successfully',
      message: 'Your post "My Amazing Content" has been scheduled for Instagram.',
      severity: 'info',
      category: 'content',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-green-600',
    },
    {
      type: 'analytics_insight',
      title: 'Engagement Milestone Reached!',
      message: 'Congratulations! You\'ve reached 10,000 followers on Instagram.',
      severity: 'info',
      category: 'analytics',
      icon: <Zap className="h-5 w-5" />,
      color: 'text-purple-600',
    },
    {
      type: 'billing_alert',
      title: 'Subscription Expiring Soon',
      message: 'Your premium subscription expires in 7 days. Renew to continue enjoying all features.',
      severity: 'high',
      category: 'billing',
      icon: <Info className="h-5 w-5" />,
      color: 'text-orange-600',
    },
  ];

  const sendTestNotification = async (notification: typeof testNotifications[0]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: notification.type,
          severity: notification.severity,
          category: notification.category,
        }),
      });

      if (!response.ok) throw new Error('Failed to send test notification');

      setToast({
        title: 'Success',
        message: `Test notification "${notification.title}" sent successfully`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setToast({
        title: 'Error',
        message: 'Failed to send test notification',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendAllTestNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications/test', {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to send test notifications');

      setToast({
        title: 'Success',
        message: 'All test notifications sent successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Failed to send test notifications:', error);
      setToast({
        title: 'Error',
        message: 'Failed to send test notifications',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h4" className="font-bold">Notification Test Center</Typography>
        <Typography variant="body1" className="text-gray-600 dark:text-gray-300">
          Test the notification system by sending various types of notifications
        </Typography>
      </div>

      {/* Send All Button */}
      <Card>
        <CardHeader>
          <Typography variant="h6" className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Send All Test Notifications
          </Typography>
          <CardDescription>
            Send all test notifications at once to verify the system is working
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={sendAllTestNotifications} 
            disabled={isLoading}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send All Test Notifications'}
          </Button>
        </CardContent>
      </Card>

      {/* Individual Test Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testNotifications.map((notification, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={notification.color}>
                    {notification.icon}
                  </div>
                  <Typography variant="h6" className="text-lg">{notification.title}</Typography>
                </div>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {notification.severity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {notification.category}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                {notification.message}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => sendTestNotification(notification)}
                disabled={isLoading}
                variant="outlined"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <Typography variant="h6">How to Test</Typography>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Send Individual Notifications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click on any "Send Test" button to send a specific type of notification.
              This will help you verify that different notification types work correctly.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Send All Notifications</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Click "Send All Test Notifications" to send all test notifications at once.
              They will be sent with a 1-second delay between each notification.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Check Notification Center</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              After sending test notifications, check the notification center (bell icon in the header)
              to see the notifications appear in real-time.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">4. Test Real-time Updates</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Open multiple browser tabs and send notifications from one tab to see them
              appear in real-time on other tabs.
            </p>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 