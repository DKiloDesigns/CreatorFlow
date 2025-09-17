/**
 * Real-time Collaboration Component
 * Live editing and collaboration features
 */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
  currentActivity?: string;
  cursorPosition?: { x: number; y: number };
  color: string;
}

interface CollaborationSession {
  id: string;
  name: string;
  description?: string;
  collaborators: Collaborator[];
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

interface RealTimeCollaborationProps {
  sessionId?: string;
  onSessionChange?: (session: CollaborationSession) => void;
  onCollaboratorJoin?: (collaborator: Collaborator) => void;
  onCollaboratorLeave?: (collaboratorId: string) => void;
  onActivityChange?: (activity: string) => void;
  className?: string;
}

export function RealTimeCollaboration({
  sessionId,
  onSessionChange,
  onCollaboratorJoin,
  onCollaboratorLeave,
  onActivityChange,
  className,
}: RealTimeCollaborationProps) {
  const [session, setSession] = useState<CollaborationSession | null>(null);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');
  const [currentActivity, setCurrentActivity] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const theme = useTheme();
  const wsRef = useRef<WebSocket | null>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for demonstration
  const mockCollaborators: Collaborator[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'owner',
      status: 'online',
      currentActivity: 'Editing content',
      color: '#1976d2',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      status: 'online',
      currentActivity: 'Reviewing analytics',
      color: '#9c27b0',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'viewer',
      status: 'away',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      color: '#f57c00',
    },
  ];

  // Initialize collaboration session
  useEffect(() => {
    if (sessionId) {
      // In a real implementation, this would connect to a WebSocket
      // and load the session data
      const mockSession: CollaborationSession = {
        id: sessionId,
        name: 'Content Creation Session',
        description: 'Working on Q4 marketing campaign',
        collaborators: mockCollaborators,
        isActive: true,
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      
      setSession(mockSession);
      setCollaborators(mockCollaborators);
      setIsConnected(true);
    }
  }, [sessionId]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      // Simulate activity changes
      const activities = [
        'Editing content',
        'Reviewing analytics',
        'Scheduling posts',
        'Managing media',
        'Viewing dashboard',
        'Idle',
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setCurrentActivity(randomActivity);
      onActivityChange?.(randomActivity);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isConnected, onActivityChange]);

  const handleInviteCollaborator = useCallback(() => {
    if (!inviteEmail.trim()) return;

    const newCollaborator: Collaborator = {
      id: `collaborator_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'offline',
      color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    };

    setCollaborators(prev => [...prev, newCollaborator]);
    onCollaboratorJoin?.(newCollaborator);
    
    setInviteEmail('');
    setIsInviteDialogOpen(false);
  }, [inviteEmail, inviteRole, onCollaboratorJoin]);

  const handleRemoveCollaborator = useCallback((collaboratorId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    onCollaboratorLeave?.(collaboratorId);
  }, [onCollaboratorLeave]);

  const getStatusColor = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return theme.palette.success.main;
      case 'away': return theme.palette.warning.main;
      case 'offline': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: Collaborator['status']) => {
    switch (status) {
      case 'online': return <CheckCircleIcon sx={{ fontSize: 12 }} />;
      case 'away': return <WarningIcon sx={{ fontSize: 12 }} />;
      case 'offline': return <ErrorIcon sx={{ fontSize: 12 }} />;
      default: return null;
    }
  };

  return (
    <Box className={className}>
      {/* Collaboration Header */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {session?.name || 'Collaboration Session'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {session?.description || 'Real-time collaboration'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={isConnected ? 'success' : 'error'}
              size="small"
            />
            <IconButton size="small">
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Current Activity */}
        {currentActivity && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Current Activity:</strong> {currentActivity}
            </Typography>
          </Alert>
        )}

        {/* Collaborators List */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Collaborators ({collaborators.length})
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setIsInviteDialogOpen(true)}
            size="small"
            variant="outlined"
          >
            Invite
          </Button>
        </Box>

        <List dense>
          {collaborators.map((collaborator, index) => (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  bgcolor: alpha(collaborator.color, 0.05),
                  borderRadius: 1,
                  mb: 1,
                  border: `1px solid ${alpha(collaborator.color, 0.2)}`,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: getStatusColor(collaborator.status),
                          border: `2px solid ${theme.palette.background.paper}`,
                        }}
                      />
                    }
                  >
                    <Avatar
                      sx={{
                        bgcolor: collaborator.color,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {collaborator.name}
                      </Typography>
                      <Chip
                        label={collaborator.role}
                        size="small"
                        color={collaborator.role === 'owner' ? 'primary' : 'default'}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {collaborator.email}
                      </Typography>
                      {collaborator.currentActivity && (
                        <Typography variant="caption" display="block" color="primary">
                          {collaborator.currentActivity}
                        </Typography>
                      )}
                      {collaborator.lastSeen && collaborator.status === 'offline' && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Last seen {collaborator.lastSeen.toLocaleTimeString()}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`Status: ${collaborator.status}`}>
                      <Box sx={{ color: getStatusColor(collaborator.status) }}>
                        {getStatusIcon(collaborator.status)}
                      </Box>
                    </Tooltip>
                    
                    {collaborator.role !== 'owner' && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveCollaborator(collaborator.id)}
                        color="error"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Paper>

      {/* Invite Dialog */}
      <Dialog
        open={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Invite Collaborator</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            margin="normal"
            placeholder="collaborator@example.com"
          />
          
          <TextField
            fullWidth
            select
            label="Role"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="editor">Editor - Can edit and manage content</option>
            <option value="viewer">Viewer - Can view only</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsInviteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInviteCollaborator}
            variant="contained"
            disabled={!inviteEmail.trim()}
          >
            Send Invite
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Hook for real-time collaboration
export function useRealTimeCollaboration(sessionId?: string) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentActivity, setCurrentActivity] = useState('');

  const updateCollaborator = useCallback((collaborator: Collaborator) => {
    setCollaborators(prev => {
      const existing = prev.find(c => c.id === collaborator.id);
      if (existing) {
        return prev.map(c => c.id === collaborator.id ? collaborator : c);
      }
      return [...prev, collaborator];
    });
  }, []);

  const removeCollaborator = useCallback((collaboratorId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  }, []);

  const updateActivity = useCallback((activity: string) => {
    setCurrentActivity(activity);
  }, []);

  return {
    collaborators,
    isConnected,
    currentActivity,
    updateCollaborator,
    removeCollaborator,
    updateActivity,
  };
}

export default RealTimeCollaboration;
