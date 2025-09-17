/**
 * Workflow Automation Component
 * Complex workflow automation and automation rules
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  alpha,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Schedule as ScheduleIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  ContentCopy as ContentCopyIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Link as LinkIcon,
  Filter as FilterIcon,
  Transform as TransformIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Timeline as TimelineIcon,
  Code as CodeIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: Trigger;
  conditions: Condition[];
  actions: Action[];
  createdAt: Date;
  lastRun?: Date;
  runCount: number;
  successRate: number;
  category: 'content' | 'social' | 'analytics' | 'notification' | 'workflow';
}

interface Trigger {
  type: 'schedule' | 'event' | 'condition' | 'webhook' | 'manual';
  config: any;
}

interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists';
  value: any;
  logic: 'AND' | 'OR';
}

interface Action {
  id: string;
  type: 'create_content' | 'schedule_post' | 'send_notification' | 'update_analytics' | 'webhook' | 'transform_data';
  config: any;
  delay?: number; // in minutes
}

interface WorkflowAutomationProps {
  onRuleCreate?: (rule: AutomationRule) => void;
  onRuleUpdate?: (rule: AutomationRule) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleExecute?: (ruleId: string) => void;
  className?: string;
}

export function WorkflowAutomation({
  onRuleCreate,
  onRuleUpdate,
  onRuleDelete,
  onRuleExecute,
  className,
}: WorkflowAutomationProps) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
    name: '',
    description: '',
    isActive: true,
    trigger: { type: 'manual', config: {} },
    conditions: [],
    actions: [],
    category: 'content',
  });
  const theme = useTheme();

  // Mock data for demonstration
  const mockRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Auto Post to Instagram',
      description: 'Automatically post content to Instagram when approved',
      isActive: true,
      trigger: {
        type: 'condition',
        config: { field: 'status', value: 'approved' }
      },
      conditions: [
        {
          id: 'c1',
          field: 'platform',
          operator: 'equals',
          value: 'instagram',
          logic: 'AND'
        },
        {
          id: 'c2',
          field: 'status',
          operator: 'equals',
          value: 'approved',
          logic: 'AND'
        }
      ],
      actions: [
        {
          id: 'a1',
          type: 'schedule_post',
          config: { platform: 'instagram', immediate: true },
          delay: 0
        },
        {
          id: 'a2',
          type: 'send_notification',
          config: { type: 'success', message: 'Content posted to Instagram' },
          delay: 5
        }
      ],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
      runCount: 15,
      successRate: 93.3,
      category: 'social'
    },
    {
      id: '2',
      name: 'Weekly Analytics Report',
      description: 'Generate and send weekly analytics report every Monday',
      isActive: true,
      trigger: {
        type: 'schedule',
        config: { frequency: 'weekly', day: 'monday', time: '09:00' }
      },
      conditions: [],
      actions: [
        {
          id: 'a1',
          type: 'update_analytics',
          config: { generateReport: true, period: 'weekly' },
          delay: 0
        },
        {
          id: 'a2',
          type: 'send_notification',
          config: { type: 'email', template: 'weekly_report' },
          delay: 30
        }
      ],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      runCount: 8,
      successRate: 100,
      category: 'analytics'
    },
    {
      id: '3',
      name: 'Content Optimization',
      description: 'Automatically optimize content based on performance data',
      isActive: false,
      trigger: {
        type: 'event',
        config: { event: 'content_published' }
      },
      conditions: [
        {
          id: 'c1',
          field: 'engagement_rate',
          operator: 'less_than',
          value: 2.0,
          logic: 'AND'
        }
      ],
      actions: [
        {
          id: 'a1',
          type: 'transform_data',
          config: { operation: 'optimize_hashtags' },
          delay: 0
        },
        {
          id: 'a2',
          type: 'send_notification',
          config: { type: 'info', message: 'Content optimized based on performance' },
          delay: 10
        }
      ],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      runCount: 3,
      successRate: 66.7,
      category: 'content'
    }
  ];

  useEffect(() => {
    setRules(mockRules);
  }, []);

  const handleCreateRule = useCallback(() => {
    if (!newRule.name?.trim()) return;

    const rule: AutomationRule = {
      id: `rule_${Date.now()}`,
      name: newRule.name!,
      description: newRule.description || '',
      isActive: newRule.isActive || false,
      trigger: newRule.trigger || { type: 'manual', config: {} },
      conditions: newRule.conditions || [],
      actions: newRule.actions || [],
      createdAt: new Date(),
      runCount: 0,
      successRate: 0,
      category: newRule.category || 'content',
    };

    setRules(prev => [...prev, rule]);
    onRuleCreate?.(rule);
    setIsCreateDialogOpen(false);
    setNewRule({
      name: '',
      description: '',
      isActive: true,
      trigger: { type: 'manual', config: {} },
      conditions: [],
      actions: [],
      category: 'content',
    });
    setActiveStep(0);
  }, [newRule, onRuleCreate]);

  const handleUpdateRule = useCallback((rule: AutomationRule) => {
    setRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    onRuleUpdate?.(rule);
    setIsEditDialogOpen(false);
    setEditingRule(null);
  }, [onRuleUpdate]);

  const handleDeleteRule = useCallback((ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
    onRuleDelete?.(ruleId);
  }, [onRuleDelete]);

  const handleExecuteRule = useCallback((ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    // Simulate rule execution
    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { ...r, lastRun: new Date(), runCount: r.runCount + 1 }
        : r
    ));

    onRuleExecute?.(ruleId);
  }, [rules, onRuleExecute]);

  const handleToggleRule = useCallback((ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, isActive: !r.isActive } : r
    ));
  }, []);

  const getCategoryIcon = (category: AutomationRule['category']) => {
    switch (category) {
      case 'content': return <ContentCopyIcon />;
      case 'social': return <ShareIcon />;
      case 'analytics': return <AnalyticsIcon />;
      case 'notification': return <NotificationsIcon />;
      case 'workflow': return <TimelineIcon />;
      default: return <SettingsIcon />;
    }
  };

  const getCategoryColor = (category: AutomationRule['category']) => {
    switch (category) {
      case 'content': return 'primary';
      case 'social': return 'secondary';
      case 'analytics': return 'info';
      case 'notification': return 'warning';
      case 'workflow': return 'success';
      default: return 'default';
    }
  };

  const getTriggerIcon = (type: Trigger['type']) => {
    switch (type) {
      case 'schedule': return <ScheduleIcon />;
      case 'event': return <NotificationsIcon />;
      case 'condition': return <FilterIcon />;
      case 'webhook': return <LinkIcon />;
      case 'manual': return <PlayIcon />;
      default: return <SettingsIcon />;
    }
  };

  const getActionIcon = (type: Action['type']) => {
    switch (type) {
      case 'create_content': return <ContentCopyIcon />;
      case 'schedule_post': return <ScheduleIcon />;
      case 'send_notification': return <EmailIcon />;
      case 'update_analytics': return <AnalyticsIcon />;
      case 'webhook': return <LinkIcon />;
      case 'transform_data': return <TransformIcon />;
      default: return <SettingsIcon />;
    }
  };

  const RuleCard = ({ rule }: { rule: AutomationRule }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" color={getCategoryColor(rule.category) as any}>
                {getCategoryIcon(rule.category)}
              </IconButton>
              <Typography variant="h6">
                {rule.name}
              </Typography>
              <Chip
                label={rule.category}
                color={getCategoryColor(rule.category) as any}
                size="small"
              />
              {rule.isActive ? (
                <Chip label="Active" color="success" size="small" />
              ) : (
                <Chip label="Inactive" color="default" size="small" />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={rule.isActive ? 'Pause' : 'Activate'}>
                <IconButton
                  size="small"
                  onClick={() => handleToggleRule(rule.id)}
                >
                  {rule.isActive ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Execute Now">
                <IconButton
                  size="small"
                  onClick={() => handleExecuteRule(rule.id)}
                >
                  <PlayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditingRule(rule);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => handleDeleteRule(rule.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {rule.description}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Trigger:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getTriggerIcon(rule.trigger.type)}
                  <Typography variant="caption">
                    {rule.trigger.type}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Actions:</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {rule.actions.map((action, index) => (
                    <Chip
                      key={index}
                      label={action.type.replace('_', ' ')}
                      size="small"
                      icon={getActionIcon(action.type)}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Runs:</Typography>
                <Typography variant="body2">{rule.runCount}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Success Rate:</Typography>
                <Typography variant="body2">{rule.successRate.toFixed(1)}%</Typography>
              </Box>
              
              {rule.lastRun && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">Last Run:</Typography>
                  <Typography variant="caption">
                    {rule.lastRun.toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box className={className}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Workflow Automation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage automated workflows for content and social media
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create Rule
        </Button>
      </Box>

      {/* Rules List */}
      <Box>
        {rules.map((rule) => (
          <RuleCard key={rule.id} rule={rule} />
        ))}
      </Box>

      {/* Create Rule Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Automation Rule</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Basic Information</StepLabel>
              <StepContent>
                <TextField
                  fullWidth
                  label="Rule Name"
                  value={newRule.name || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={newRule.description || ''}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  margin="normal"
                  multiline
                  rows={3}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newRule.category || 'content'}
                    onChange={(e) => setNewRule(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <MenuItem value="content">Content</MenuItem>
                    <MenuItem value="social">Social Media</MenuItem>
                    <MenuItem value="analytics">Analytics</MenuItem>
                    <MenuItem value="notification">Notification</MenuItem>
                    <MenuItem value="workflow">Workflow</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(1)}
                    disabled={!newRule.name?.trim()}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Trigger Configuration</StepLabel>
              <StepContent>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Trigger Type</InputLabel>
                  <Select
                    value={newRule.trigger?.type || 'manual'}
                    onChange={(e) => setNewRule(prev => ({ 
                      ...prev, 
                      trigger: { ...prev.trigger!, type: e.target.value as any }
                    }))}
                  >
                    <MenuItem value="manual">Manual</MenuItem>
                    <MenuItem value="schedule">Schedule</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="condition">Condition</MenuItem>
                    <MenuItem value="webhook">Webhook</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setActiveStep(2)}
                  >
                    Next
                  </Button>
                </Box>
              </StepContent>
            </Step>
            
            <Step>
              <StepLabel>Actions Configuration</StepLabel>
              <StepContent>
                <Typography variant="body2" color="text.secondary">
                  Configure the actions to be performed when the rule is triggered.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleCreateRule}
                  >
                    Create Rule
                  </Button>
                </Box>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Rule Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Automation Rule</DialogTitle>
        <DialogContent>
          {editingRule && (
            <Box>
              <TextField
                fullWidth
                label="Rule Name"
                value={editingRule.name}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                value={editingRule.description}
                onChange={(e) => setEditingRule(prev => prev ? { ...prev, description: e.target.value } : null)}
                margin="normal"
                multiline
                rows={3}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingRule.isActive}
                    onChange={(e) => setEditingRule(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  />
                }
                label="Active"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => editingRule && handleUpdateRule(editingRule)}
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default WorkflowAutomation;
