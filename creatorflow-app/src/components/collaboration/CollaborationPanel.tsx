'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Users,
  Plus,
  Copy,
  Share2,
  Video,
  MessageCircle,
  Settings,
  Wifi,
  WifiOff,
  Clock,
} from 'lucide-react';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { useSession } from 'next-auth/react';

export function CollaborationPanel() {
  const { users, isConnected, currentRoom, joinRoom, leaveRoom } = useCollaboration();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      joinRoom(roomId.trim());
      setShowJoinDialog(false);
      setRoomId('');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setIsOpen(false);
  };

  const copyRoomLink = () => {
    if (currentRoom) {
      const link = `${window.location.origin}/collaborate/${currentRoom}`;
      navigator.clipboard.writeText(link);
      // You could show a toast notification here
    }
  };

  const getStatusColor = (isActive: boolean, lastSeen: Date) => {
    const now = new Date();
    const timeSinceLastSeen = now.getTime() - lastSeen.getTime();
    
    if (!isActive || timeSinceLastSeen > 30000) {
      return 'error';
    } else if (timeSinceLastSeen > 10000) {
      return 'warning';
    } else {
      return 'success';
    }
  };

  const getStatusText = (isActive: boolean, lastSeen: Date) => {
    const now = new Date();
    const timeSinceLastSeen = now.getTime() - lastSeen.getTime();
    
    if (!isActive || timeSinceLastSeen > 30000) {
      return 'Offline';
    } else if (timeSinceLastSeen > 10000) {
      return 'Away';
    } else {
      return 'Active';
    }
  };

  return (
    <>
      {/* Collaboration Button */}
      <Tooltip title="Collaboration">
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            position: 'relative',
            bgcolor: currentRoom ? 'primary.main' : 'background.paper',
            color: currentRoom ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: currentRoom ? 'primary.dark' : 'action.hover',
            },
          }}
        >
          <Badge
            badgeContent={users.length}
            color="error"
            invisible={users.length === 0}
          >
            <Users size={20} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Collaboration Panel */}
      {isOpen && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            width: 320,
            maxHeight: 500,
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          <Box sx={{ p: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Users size={20} />
                Collaboration
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: isConnected ? 'success.main' : 'error.main',
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Typography>
              </Box>
            </Box>

            {/* Room Status */}
            {currentRoom ? (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2">Room: {currentRoom}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Copy room link">
                      <IconButton size="small" onClick={copyRoomLink}>
                        <Copy size={14} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share room">
                      <IconButton size="small">
                        <Share2 size={14} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLeaveRoom}
                  sx={{ width: '100%' }}
                >
                  Leave Room
                </Button>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => setShowJoinDialog(true)}
                  sx={{ width: '100%' }}
                >
                  Join Room
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Users List */}
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Online Users ({users.length})
            </Typography>
            <List dense>
              {users.map((userPresence) => (
                <ListItem key={userPresence.user.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: getStatusColor(userPresence.isActive, userPresence.lastSeen) === 'success' 
                              ? 'success.main' 
                              : getStatusColor(userPresence.isActive, userPresence.lastSeen) === 'warning'
                              ? 'warning.main'
                              : 'error.main',
                            border: '1px solid white',
                          }}
                        />
                      }
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: userPresence.user.color,
                          fontSize: '0.75rem',
                        }}
                      >
                        {userPresence.user.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {userPresence.user.name}
                        </Typography>
                        {userPresence.user.id === session?.user?.id && (
                          <Chip label="You" size="small" color="primary" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {getStatusText(userPresence.isActive, userPresence.lastSeen)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {/* Quick Actions */}
            {currentRoom && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Video size={14} />}
                    sx={{ flex: 1 }}
                  >
                    Video Call
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<MessageCircle size={14} />}
                    sx={{ flex: 1 }}
                  >
                    Chat
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Join Room Dialog */}
      <Dialog open={showJoinDialog} onClose={() => setShowJoinDialog(false)}>
        <DialogTitle>Join Collaboration Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room ID"
            fullWidth
            variant="outlined"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID or create a new one"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinDialog(false)}>Cancel</Button>
          <Button onClick={handleJoinRoom} variant="contained">
            Join Room
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
