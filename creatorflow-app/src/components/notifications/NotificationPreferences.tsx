'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Bell,
  Settings,
  Brain,
  Clock,
  Target,
  Zap,
  Save,
  RefreshCw,
  Info,
  TrendingUp,
  Users,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';
import { useSmartNotifications } from '@/contexts/SmartNotificationContext';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

export function NotificationPreferences() {
  const { isDark } = useMinimalTheme();
  const {
    preferences,
    behavior,
    isLearning,
    updatePreferences,
    getNotificationInsights,
  } = useSmartNotifications();

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const insights = getNotificationInsights();

  const handlePreferenceChange = (type: string, field: string, value: any) => {
    setLocalPreferences(prev => 
      prev.map(p => 
        p.type === type 
          ? { ...p, [field]: value }
          : p
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    localPreferences.forEach(pref => {
      updatePreferences(pref.type, pref);
    });
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'content': return MessageCircle;
      case 'engagement': return TrendingUp;
      case 'system': return Settings;
      case 'collaboration': return Users;
      case 'ai_insight': return Brain;
      default: return Bell;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'content': return 'primary';
      case 'engagement': return 'success';
      case 'system': return 'warning';
      case 'collaboration': return 'info';
      case 'ai_insight': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Settings size={32} />
        Smart Notification Preferences
      </Typography>

      {/* AI Learning Status */}
      <Alert 
        severity={isLearning ? "info" : "success"} 
        sx={{ mb: 3 }}
        icon={<Brain size={20} />}
      >
        <Typography variant="body2">
          {isLearning 
            ? `AI is learning your preferences... ${insights.learningProgress}% complete`
            : "AI has learned your preferences and is optimizing notifications"
          }
        </Typography>
        {isLearning && (
          <LinearProgress 
            variant="determinate" 
            value={insights.learningProgress} 
            sx={{ mt: 1 }}
          />
        )}
      </Alert>

      {/* Insights Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {Math.round(insights.readRate * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {Math.round(insights.avgAIScore * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI Accuracy
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info.main">
                {Math.round(insights.avgUserRelevance * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Relevance Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="warning.main">
                {insights.totalNotifications}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Notifications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Notification Type Preferences */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Target size={20} />
          Notification Types
        </Typography>
        
        {localPreferences.map((pref) => {
          const Icon = getNotificationTypeIcon(pref.type);
          const color = getNotificationTypeColor(pref.type);
          
          return (
            <Box key={pref.type} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Icon size={20} />
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {pref.type.replace('_', ' ')} Notifications
                </Typography>
                <Chip 
                  label={pref.enabled ? 'Enabled' : 'Disabled'} 
                  color={pref.enabled ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={pref.enabled}
                        onChange={(e) => handlePreferenceChange(pref.type, 'enabled', e.target.checked)}
                      />
                    }
                    label="Enable notifications"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Frequency</InputLabel>
                    <Select
                      value={pref.frequency}
                      onChange={(e) => handlePreferenceChange(pref.type, 'frequency', e.target.value)}
                      label="Frequency"
                    >
                      <MenuItem value="immediate">Immediate</MenuItem>
                      <MenuItem value="digest">Daily Digest</MenuItem>
                      <MenuItem value="weekly">Weekly Summary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Priority Threshold: {pref.priority || 'normal'}
                  </Typography>
                  <Slider
                    value={pref.priority === 'high' ? 2 : pref.priority === 'medium' ? 1 : 0}
                    onChange={(_, value) => handlePreferenceChange(pref.type, 'priorityThreshold', value)}
                    min={0}
                    max={1}
                    step={0.1}
                    marks={[
                      { value: 0, label: 'Low' },
                      { value: 0.5, label: 'Medium' },
                      { value: 1, label: 'High' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
                  />
                </Grid>
              </Grid>
              
              <Divider sx={{ mt: 2 }} />
            </Box>
          );
        })}
      </Paper>

      {/* User Behavior Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock size={20} />
          Active Hours
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Start: {behavior.activeHours.start}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              End: {behavior.activeHours.end}
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                AI learns your active hours based on when you interact with notifications.
                Currently learning from {behavior.notificationInteractions.length} interactions.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Paper>

      {/* Save/Reset Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={handleReset}
          disabled={!hasChanges}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          startIcon={<Save size={16} />}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Preferences
        </Button>
      </Box>
    </Box>
  );
}
