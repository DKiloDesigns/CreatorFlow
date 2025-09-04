'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface NotificationPreference {
  type: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  channels: ('in-app' | 'email' | 'push')[];
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  keywords: string[];
  frequency: 'immediate' | 'digest' | 'weekly';
}

interface SmartNotification {
  id: string;
  type: 'content' | 'engagement' | 'system' | 'collaboration' | 'ai_insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  dismissed: boolean;
  aiScore: number; // AI confidence score (0-1)
  userRelevance: number; // User relevance score (0-1)
  actionRequired: boolean;
  actions?: Array<{
    label: string;
    action: string;
    primary?: boolean;
  }>;
}

interface UserBehavior {
  notificationInteractions: Array<{
    notificationId: string;
    action: 'read' | 'dismiss' | 'click' | 'ignore';
    timestamp: Date;
  }>;
  preferredCategories: string[];
  activeHours: {
    start: string;
    end: string;
  };
  responseTime: {
    average: number;
    patterns: Array<{
      hour: number;
      responseRate: number;
    }>;
  };
}

interface SmartNotificationContextType {
  notifications: SmartNotification[];
  preferences: NotificationPreference[];
  behavior: UserBehavior;
  isLearning: boolean;
  addNotification: (notification: Omit<SmartNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  updatePreferences: (type: string, preferences: Partial<NotificationPreference>) => void;
  getSmartNotifications: () => SmartNotification[];
  getNotificationInsights: () => any;
}

const SmartNotificationContext = createContext<SmartNotificationContextType | undefined>(undefined);

// AI-powered notification scoring
const calculateAIScore = (notification: Omit<SmartNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>, behavior: UserBehavior): number => {
  let score = 0.5; // Base score

  // Category relevance
  if (behavior.preferredCategories.includes(notification.category)) {
    score += 0.2;
  }

  // Time-based relevance
  const currentHour = new Date().getHours();
  const activeStart = parseInt(behavior.activeHours.start.split(':')[0]);
  const activeEnd = parseInt(behavior.activeHours.end.split(':')[0]);
  
  if (currentHour >= activeStart && currentHour <= activeEnd) {
    score += 0.1;
  }

  // Priority boost
  switch (notification.priority) {
    case 'urgent':
      score += 0.3;
      break;
    case 'high':
      score += 0.2;
      break;
    case 'medium':
      score += 0.1;
      break;
  }

  // Type-specific scoring
  switch (notification.type) {
    case 'ai_insight':
      score += 0.15; // AI insights are generally valuable
      break;
    case 'collaboration':
      score += 0.1; // Collaboration notifications are time-sensitive
      break;
    case 'engagement':
      score += 0.05; // Engagement notifications are nice to have
      break;
  }

  return Math.min(1, Math.max(0, score));
};

// User relevance scoring based on behavior
const calculateUserRelevance = (notification: Omit<SmartNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>, behavior: UserBehavior): number => {
  let relevance = 0.5;

  // Check interaction history with similar notifications
  const similarInteractions = behavior.notificationInteractions.filter(interaction => {
    // This would be more sophisticated in a real implementation
    return interaction.action === 'click' || interaction.action === 'read';
  });

  if (similarInteractions.length > 0) {
    relevance += 0.2;
  }

  // Check if user is typically active during this time
  const currentHour = new Date().getHours();
  const hourPattern = behavior.responseTime.patterns.find(p => p.hour === currentHour);
  if (hourPattern && hourPattern.responseRate > 0.7) {
    relevance += 0.1;
  }

  return Math.min(1, Math.max(0, relevance));
};

export function SmartNotificationProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [behavior, setBehavior] = useState<UserBehavior>({
    notificationInteractions: [],
    preferredCategories: ['content', 'engagement'],
    activeHours: { start: '09:00', end: '18:00' },
    responseTime: {
      average: 5, // minutes
      patterns: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        responseRate: i >= 9 && i <= 18 ? 0.8 : 0.2,
      })),
    },
  });
  const [isLearning, setIsLearning] = useState(true);

  // Load user preferences and behavior from localStorage
  useEffect(() => {
    if (!session?.user) return;

    const savedPreferences = localStorage.getItem(`smart-notifications-preferences-${session.user.id}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    } else {
      // Default preferences
      setPreferences([
        {
          type: 'content',
          enabled: true,
          priority: 'medium',
          channels: ['in-app'],
          quietHours: { enabled: true, start: '22:00', end: '08:00' },
          keywords: ['important', 'urgent', 'deadline'],
          frequency: 'immediate',
        },
        {
          type: 'engagement',
          enabled: true,
          priority: 'low',
          channels: ['in-app'],
          quietHours: { enabled: true, start: '22:00', end: '08:00' },
          keywords: ['like', 'comment', 'share'],
          frequency: 'digest',
        },
        {
          type: 'ai_insight',
          enabled: true,
          priority: 'high',
          channels: ['in-app', 'email'],
          quietHours: { enabled: false, start: '22:00', end: '08:00' },
          keywords: ['insight', 'recommendation', 'optimization'],
          frequency: 'immediate',
        },
      ]);
    }

    const savedBehavior = localStorage.getItem(`smart-notifications-behavior-${session.user.id}`);
    if (savedBehavior) {
      setBehavior(JSON.parse(savedBehavior));
    }
  }, [session]);

  // Save preferences and behavior to localStorage
  useEffect(() => {
    if (!session?.user || preferences.length === 0) return;
    localStorage.setItem(`smart-notifications-preferences-${session.user.id}`, JSON.stringify(preferences));
  }, [preferences, session]);

  useEffect(() => {
    if (!session?.user) return;
    localStorage.setItem(`smart-notifications-behavior-${session.user.id}`, JSON.stringify(behavior));
  }, [behavior, session]);

  const addNotification = useCallback((notification: Omit<SmartNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => {
    const aiScore = calculateAIScore(notification, behavior);
    const userRelevance = calculateUserRelevance(notification, behavior);
    
    const newNotification: SmartNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      dismissed: false,
      aiScore,
      userRelevance,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Update behavior based on notification type
    setBehavior(prev => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(notification.category)
        ? prev.preferredCategories
        : [...prev.preferredCategories, notification.category],
    }));
  }, [behavior]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    // Update behavior
    setBehavior(prev => ({
      ...prev,
      notificationInteractions: [
        ...prev.notificationInteractions,
        { notificationId: id, action: 'read', timestamp: new Date() },
      ],
    }));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, dismissed: true } : n));
    
    // Update behavior
    setBehavior(prev => ({
      ...prev,
      notificationInteractions: [
        ...prev.notificationInteractions,
        { notificationId: id, action: 'dismiss', timestamp: new Date() },
      ],
    }));
  }, []);

  const updatePreferences = useCallback((type: string, newPreferences: Partial<NotificationPreference>) => {
    setPreferences(prev => prev.map(p => 
      p.type === type ? { ...p, ...newPreferences } : p
    ));
  }, []);

  const getSmartNotifications = useCallback(() => {
    return notifications
      .filter(n => !n.dismissed)
      .sort((a, b) => {
        // Sort by AI score and user relevance
        const aScore = (a.aiScore + a.userRelevance) / 2;
        const bScore = (b.aiScore + b.userRelevance) / 2;
        return bScore - aScore;
      });
  }, [notifications]);

  const getNotificationInsights = useCallback(() => {
    const totalNotifications = notifications.length;
    const readNotifications = notifications.filter(n => n.read).length;
    const dismissedNotifications = notifications.filter(n => n.dismissed).length;
    const avgAIScore = notifications.reduce((sum, n) => sum + n.aiScore, 0) / totalNotifications || 0;
    const avgUserRelevance = notifications.reduce((sum, n) => sum + n.userRelevance, 0) / totalNotifications || 0;

    return {
      totalNotifications,
      readRate: totalNotifications > 0 ? readNotifications / totalNotifications : 0,
      dismissalRate: totalNotifications > 0 ? dismissedNotifications / totalNotifications : 0,
      avgAIScore,
      avgUserRelevance,
      learningProgress: isLearning ? Math.min(100, behavior.notificationInteractions.length * 5) : 100,
    };
  }, [notifications, behavior, isLearning]);

  const value: SmartNotificationContextType = {
    notifications,
    preferences,
    behavior,
    isLearning,
    addNotification,
    markAsRead,
    dismissNotification,
    updatePreferences,
    getSmartNotifications,
    getNotificationInsights,
  };

  return (
    <SmartNotificationContext.Provider value={value}>
      {children}
    </SmartNotificationContext.Provider>
  );
}

export function useSmartNotifications() {
  const context = useContext(SmartNotificationContext);
  if (context === undefined) {
    throw new Error('useSmartNotifications must be used within a SmartNotificationProvider');
  }
  return context;
}
