'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Badge,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Bell,
  Brain,
  Settings,
  Play,
  Pause,
  Refresh,
  ArrowLeft,
  TrendingUp,
  Users,
  MessageCircle,
  Lightbulb,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useSmartNotifications } from '@/contexts/SmartNotificationContext';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { SmartNotificationCenter } from '@/components/notifications/SmartNotificationCenter';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SmartNotificationsDemoPage() {
  const [tabValue, setTabValue] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const {
    notifications,
    behavior,
    isLearning,
    addNotification,
    getNotificationInsights,
  } = useSmartNotifications();

  const insights = getNotificationInsights();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const simulateNotification = () => {
    const notificationTypes = ['content', 'engagement', 'system', 'collaboration', 'ai_insight'];
    const priorities = ['low', 'medium', 'high', 'urgent'];
    const categories = ['social', 'content', 'analytics', 'collaboration', 'system'];
    
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const notificationTemplates = {
      content: [
        { title: "New Content Idea", message: "AI found trending hashtag #CreatorFlow2024" },
        { title: "Content Performance", message: "Your latest post gained 150% more engagement" },
        { title: "Content Optimization", message: "Suggested improvements for better reach" },
      ],
      engagement: [
        { title: "Engagement Spike", message: "Your content is trending in your niche" },
        { title: "New Followers", message: "You gained 25 new followers today" },
        { title: "Comment Activity", message: "High engagement on your recent post" },
      ],
      system: [
        { title: "System Update", message: "New features available in CreatorFlow" },
        { title: "Backup Complete", message: "Your content has been backed up successfully" },
        { title: "Maintenance", message: "Scheduled maintenance completed" },
      ],
      collaboration: [
        { title: "Team Invite", message: "You've been invited to collaborate on a project" },
        { title: "Comment Reply", message: "Someone replied to your comment" },
        { title: "Shared Content", message: "Your content was shared by a team member" },
      ],
      ai_insight: [
        { title: "AI Insight", message: "Optimal posting time identified: 2 PM EST" },
        { title: "Trend Prediction", message: "Hashtag #CreatorFlow will trend next week" },
        { title: "Content Analysis", message: "Your content style matches trending creators" },
      ],
    };
    
    const template = notificationTemplates[randomType as keyof typeof notificationTemplates];
    const randomTemplate = template[Math.floor(Math.random() * template.length)];
    
    addNotification({
      type: randomType as any,
      title: randomTemplate.title,
      message: randomTemplate.message,
      priority: randomPriority as any,
      category: randomCategory,
      actionRequired: randomPriority === 'urgent',
      actions: randomPriority === 'urgent' ? [
        { label: 'View', action: 'view', primary: true },
        { label: 'Dismiss', action: 'dismiss' },
      ] : undefined,
    });
  };

  const startSimulation = () => {
    setIsSimulating(true);
    const interval = setInterval(() => {
      simulateNotification();
    }, 3000);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsSimulating(false);
    }, 30000); // Run for 30 seconds
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link href="/features-demo">
          <Button variant="outlined" startIcon={<ArrowLeft size={16} />}>
            Back to Features
          </Button>
        </Link>
        <Typography variant="h3" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          🔔 Smart Notifications Demo
        </Typography>
        <Chip 
          label="Phase 2 Complete" 
          color="success" 
          icon={<Brain size={16} />}
        />
      </Box>

      {/* AI Learning Status */}
      <Alert 
        severity={isLearning ? "info" : "success"} 
        sx={{ mb: 4 }}
        icon={<Brain size={20} />}
      >
        <Typography variant="body1">
          {isLearning 
            ? `🧠 AI is learning your preferences... ${insights.learningProgress}% complete`
            : "✅ AI has learned your preferences and is optimizing notifications"
          }
        </Typography>
        {isLearning && (
          <LinearProgress 
            variant="determinate" 
            value={insights.learningProgress} 
            sx={{ mt: 2 }}
          />
        )}
      </Alert>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title="AI Accuracy"
              avatar={<Brain size={24} />}
            />
            <CardContent>
              <Typography variant="h4" color="primary">
                {Math.round(insights.avgAIScore * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Smart scoring accuracy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title="Relevance Score"
              avatar={<Target size={24} />}
            />
            <CardContent>
              <Typography variant="h4" color="success.main">
                {Math.round(insights.avgUserRelevance * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                User relevance matching
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title="Read Rate"
              avatar={<MessageCircle size={24} />}
            />
            <CardContent>
              <Typography variant="h4" color="info.main">
                {Math.round(insights.readRate * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Notification engagement
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader
              title="Total Notifications"
              avatar={<Bell size={24} />}
            />
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {insights.totalNotifications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Processed by AI
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Simulation Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Zap size={20} />
          AI Notification Simulation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Test the smart notification system by generating sample notifications. 
          The AI will learn from your interactions and improve scoring over time.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Play size={16} />}
            onClick={startSimulation}
            disabled={isSimulating}
          >
            Start Simulation
          </Button>
          <Button
            variant="outlined"
            startIcon={<Pause size={16} />}
            onClick={stopSimulation}
            disabled={!isSimulating}
          >
            Stop Simulation
          </Button>
          <Button
            variant="outlined"
            startIcon={<Bell size={16} />}
            onClick={simulateNotification}
          >
            Send Test Notification
          </Button>
        </Box>
        {isSimulating && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              🔄 Simulation running... AI is learning from your interactions
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Main Content Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="smart notifications tabs">
            <Tab 
              label="Notification Center" 
              icon={<Bell size={16} />}
              iconPosition="start"
            />
            <Tab 
              label="AI Preferences" 
              icon={<Settings size={16} />}
              iconPosition="start"
            />
            <Tab 
              label="Behavior Analysis" 
              icon={<TrendingUp size={16} />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SmartNotificationCenter />
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <NotificationPreferences />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp size={20} />
              AI Behavior Analysis
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Learning Progress" />
                  <CardContent>
                    <LinearProgress 
                      variant="determinate" 
                      value={insights.learningProgress} 
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {behavior.notificationInteractions.length} interactions analyzed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Active Hours" />
                  <CardContent>
                    <Typography variant="h6">
                      {behavior.activeHours.start} - {behavior.activeHours.end}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI-detected optimal notification times
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="Preferred Categories" />
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {behavior.preferredCategories.map((category) => (
                        <Chip 
                          key={category} 
                          label={category} 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Paper>
    </Container>
  );
}
