"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Stack,
  Switch,
  FormControlLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Schedule,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  Add,
  Delete,
  Edit,
  Visibility,
  TrendingUp,
  AutoAwesome,
  SmartToy,
  Psychology,
  Analytics,
  CheckCircle,
  Warning,
  Error,
  Info,
  CalendarToday,
  AccessTime,
  Language,
  Public,
  Lock,
  ExpandMore
} from '@/lib/mui-optimized-imports';

interface PublishingCampaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'publishing' | 'completed' | 'failed';
  content: {
    text: string;
    media: string[];
    hashtags: string[];
  };
  platforms: Array<{
    name: string;
    status: 'pending' | 'publishing' | 'published' | 'failed';
    scheduledTime: string;
    publishedTime?: string;
    performance?: {
      engagement: number;
      reach: number;
      clicks: number;
    };
  }>;
  automation: {
    enabled: boolean;
    rules: Array<{
      id: string;
      name: string;
      active: boolean;
      conditions: string[];
      actions: string[];
    }>;
    optimization: {
      timing: boolean;
      hashtags: boolean;
      content: boolean;
      crossPlatform: boolean;
    };
  };
  analytics: {
    totalEngagement: number;
    totalReach: number;
    bestPerformingPlatform: string;
    optimalPostingTime: string;
    recommendations: string[];
  };
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  active: boolean;
  conditions: Array<{
    type: 'performance' | 'timing' | 'audience' | 'content';
    operator: 'gt' | 'lt' | 'eq' | 'contains';
    value: string | number;
  }>;
  actions: Array<{
    type: 'reschedule' | 'optimize' | 'notify' | 'duplicate';
    parameters: Record<string, any>;
  }>;
  successRate: number;
  lastTriggered: string;
}

export default function AutomatedPublisher() {
  const [campaigns, setCampaigns] = useState<PublishingCampaign[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<PublishingCampaign | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    campaigns: true,
    rules: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCampaigns: PublishingCampaign[] = [
        {
          id: '1',
          name: 'AI Content Marketing Campaign',
          status: 'publishing',
          content: {
            text: 'Discover how AI is revolutionizing content creation and marketing strategies. #AI #Marketing #Innovation',
            media: ['ai-marketing.jpg', 'content-strategy.png'],
            hashtags: ['#AI', '#Marketing', '#Innovation', '#ContentCreation']
          },
          platforms: [
            {
              name: 'LinkedIn',
              status: 'published',
              scheduledTime: '2025-08-12T10:00:00Z',
              publishedTime: '2025-08-12T10:00:00Z',
              performance: { engagement: 85, reach: 2500, clicks: 120 }
            },
            {
              name: 'Twitter',
              status: 'publishing',
              scheduledTime: '2025-08-12T11:00:00Z',
              performance: { engagement: 0, reach: 0, clicks: 0 }
            },
            {
              name: 'Instagram',
              status: 'pending',
              scheduledTime: '2025-08-12T14:00:00Z'
            }
          ],
          automation: {
            enabled: true,
            rules: [
              {
                id: '1',
                name: 'Performance-Based Optimization',
                active: true,
                conditions: ['Engagement < 70%', 'Reach < 1000'],
                actions: ['Optimize hashtags', 'Adjust timing']
              }
            ],
            optimization: {
              timing: true,
              hashtags: true,
              content: true,
              crossPlatform: true
            }
          },
          analytics: {
            totalEngagement: 85,
            totalReach: 2500,
            bestPerformingPlatform: 'LinkedIn',
            optimalPostingTime: '10:00 AM - 2:00 PM',
            recommendations: [
              'Post more content during peak hours',
              'Use trending hashtags for better discoverability',
              'Consider video format for higher engagement'
            ]
          }
        },
        {
          id: '2',
          name: 'Product Launch Announcement',
          status: 'scheduled',
          content: {
            text: 'Exciting news! Our new AI-powered platform is launching next week. #ProductLaunch #AI #Innovation',
            media: ['product-launch.jpg'],
            hashtags: ['#ProductLaunch', '#AI', '#Innovation', '#Tech']
          },
          platforms: [
            {
              name: 'LinkedIn',
              status: 'pending',
              scheduledTime: '2025-08-15T09:00:00Z'
            },
            {
              name: 'Twitter',
              status: 'pending',
              scheduledTime: '2025-08-15T10:00:00Z'
            }
          ],
          automation: {
            enabled: true,
            rules: [],
            optimization: {
              timing: true,
              hashtags: true,
              content: false,
              crossPlatform: true
            }
          },
          analytics: {
            totalEngagement: 0,
            totalReach: 0,
            bestPerformingPlatform: 'N/A',
            optimalPostingTime: '9:00 AM - 11:00 AM',
            recommendations: [
              'Schedule posts during business hours',
              'Use professional tone for LinkedIn',
              'Include product screenshots'
            ]
          }
        }
      ];

      const mockRules: AutomationRule[] = [
        {
          id: '1',
          name: 'Smart Timing Optimization',
          description: 'Automatically adjusts posting times based on audience engagement patterns',
          active: true,
          conditions: [
            { type: 'performance', operator: 'lt', value: 70 },
            { type: 'timing', operator: 'gt', value: '2 hours' }
          ],
          actions: [
            { type: 'reschedule', parameters: { delay: 'optimal_time' } },
            { type: 'notify', parameters: { message: 'Post rescheduled for optimal timing' } }
          ],
          successRate: 92,
          lastTriggered: '2 hours ago'
        },
        {
          id: '2',
          name: 'Cross-Platform Performance Sync',
          description: 'Automatically adjusts content strategy based on best-performing platform',
          active: true,
          conditions: [
            { type: 'performance', operator: 'gt', value: 20 },
            { type: 'audience', operator: 'contains', value: 'professional' }
          ],
          actions: [
            { type: 'optimize', parameters: { strategy: 'best_performing' } },
            { type: 'duplicate', parameters: { platform: 'similar_audience' } }
          ],
          successRate: 88,
          lastTriggered: '1 hour ago'
        },
        {
          id: '3',
          name: 'Content Quality Enhancement',
          description: 'Automatically enhances content based on trending topics and hashtags',
          active: false,
          conditions: [
            { type: 'content', operator: 'contains', value: 'trending' },
            { type: 'performance', operator: 'lt', value: 50 }
          ],
          actions: [
            { type: 'optimize', parameters: { enhancement: 'trending_elements' } },
            { type: 'notify', parameters: { message: 'Content enhanced with trending elements' } }
          ],
          successRate: 85,
          lastTriggered: '3 days ago'
        }
      ];

      setCampaigns(mockCampaigns);
      setAutomationRules(mockRules);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaignStatus = (campaignId: string, action: 'start' | 'pause' | 'stop') => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId) {
        let newStatus: PublishingCampaign['status'] = campaign.status;
        switch (action) {
          case 'start':
            newStatus = 'publishing';
            break;
          case 'pause':
            newStatus = 'scheduled';
            break;
          case 'stop':
            newStatus = 'completed';
            break;
        }
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, active: !rule.active } : rule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'scheduled': return 'info';
      case 'publishing': return 'warning';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'info';
      case 'publishing': return 'warning';
      case 'published': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev => ({ ...prev, [panel]: isExpanded }));
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading automated publishing system...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: { xs: 8, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Automated Publishing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Smart scheduling and cross-platform automation powered by AI
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={() => setShowCreateDialog(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          Create Campaign
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <IconButton size="small" onClick={loadMockData} sx={{ ml: 1 }}>
            <Refresh />
          </IconButton>
        </Alert>
      )}

      {/* Campaign Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Campaigns
              </Typography>
              <Typography variant="h4">
                {campaigns.filter(c => c.status === 'publishing').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Scheduled Posts
              </Typography>
              <Typography variant="h4">
                {campaigns.filter(c => c.status === 'scheduled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Automation Rules
              </Typography>
              <Typography variant="h4">
                {automationRules.filter(r => r.active).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">
                {Math.round(automationRules.reduce((acc, rule) => acc + rule.successRate, 0) / automationRules.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Campaigns */}
      <Accordion 
        expanded={expandedSections.campaigns} 
        onChange={handleAccordionChange('campaigns')}
        sx={{ mb: 4 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            Active Publishing Campaigns
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {campaigns.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No campaigns found. Create your first campaign to get started.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {campaigns.map((campaign) => (
                <Card key={campaign.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>{campaign.name}</Typography>
                          <Chip 
                            label={campaign.status.toUpperCase()} 
                            color={getStatusColor(campaign.status) as any}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, wordBreak: 'break-word' }}>
                          {campaign.content.text}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                          {campaign.content.hashtags.map((hashtag, index) => (
                            <Chip
                              key={index}
                              label={hashtag}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>
                        {campaign.status === 'scheduled' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => toggleCampaignStatus(campaign.id, 'start')}
                            sx={{ minWidth: 'fit-content' }}
                          >
                            Start
                          </Button>
                        )}
                        {campaign.status === 'publishing' && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Pause />}
                              onClick={() => toggleCampaignStatus(campaign.id, 'pause')}
                              sx={{ minWidth: 'fit-content' }}
                            >
                              Pause
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Stop />}
                              onClick={() => toggleCampaignStatus(campaign.id, 'stop')}
                              sx={{ minWidth: 'fit-content' }}
                            >
                              Stop
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                    
                    {/* Platform Status */}
                    <Typography variant="subtitle2" gutterBottom>
                      Platform Status
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                      gap: 2
                    }}>
                      {campaign.platforms.map((platform, index) => (
                        <Box key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">{platform.name}</Typography>
                            <Chip
                              label={platform.status}
                              size="small"
                              color={getPlatformStatusColor(platform.status) as any}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {platform.scheduledTime}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Automation Rules */}
      <Accordion 
        expanded={expandedSections.rules} 
        onChange={handleAccordionChange('rules')}
        sx={{ mb: 4 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">
            AI Automation Rules
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setShowRuleDialog(true)}
            >
              Add Rule
            </Button>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2
          }}>
            {automationRules.map((rule) => (
              <Card key={rule.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ wordBreak: 'break-word' }}>
                        {rule.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, wordBreak: 'break-word' }}>
                        {rule.description}
                      </Typography>
                    </Box>
                    <Switch
                      checked={rule.active}
                      onChange={() => toggleAutomationRule(rule.id)}
                      color="primary"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Conditions:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {rule.conditions.map((condition, index) => (
                        <Chip
                          key={index}
                          label={`${condition.type} ${condition.operator} ${condition.value}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Success Rate: {rule.successRate}%
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Last triggered: {rule.lastTriggered}
                      </Typography>
                    </Box>
                    <Chip
                      icon={rule.active ? <PlayArrow /> : <Pause />}
                      label={rule.active ? 'Active' : 'Paused'}
                      color={rule.active ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Publishing Campaign</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set up an automated publishing campaign with AI-powered optimization
          </Typography>
          {/* Campaign creation form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Campaign</Button>
        </DialogActions>
      </Dialog>

      {/* Create Rule Dialog */}
      <Dialog open={showRuleDialog} onClose={() => setShowRuleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Automation Rule</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define AI automation rules for intelligent content publishing
          </Typography>
          {/* Rule creation form would go here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRuleDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Rule</Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
    </Box>
  );
}
