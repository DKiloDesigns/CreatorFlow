'use client';

import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Popover, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip,
  Button
} from '@mui/material';
import { Users, UserPlus, Settings } from 'lucide-react';
import { useMinimalCollaboration } from '@/contexts/MinimalCollaborationContext';

export function MinimalCollaborationPanel() {
  const { users, isConnected, currentRoom, joinRoom, leaveRoom } = useMinimalCollaboration();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Collaboration">
        <IconButton 
          onClick={handleClick} 
          sx={{
            color: 'text.primary',
            backgroundColor: 'background.paper',
            border: '2px solid',
            borderColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderColor: 'primary.dark',
            },
            // Ensure visibility in both light and dark modes
            minWidth: 44,
            minHeight: 44,
            boxShadow: 1,
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: 2,
            }
          }}
        >
          <Users size={20} />
        </IconButton>
      </Tooltip>
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Users size={20} />
            Collaboration
            <Chip 
              label={isConnected ? 'Connected' : 'Disconnected'} 
              color={isConnected ? 'success' : 'error'} 
              size="small" 
            />
          </Typography>

          {currentRoom && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Current Room: {currentRoom}
              </Typography>
              <Button size="small" onClick={leaveRoom}>
                Leave Room
              </Button>
            </Box>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Online Users ({users.length})
          </Typography>
          
          <List dense>
            {users.map((user) => (
              <ListItem key={user.id}>
                <ListItemAvatar>
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={user.isActive ? 'Active' : 'Away'} 
                        color={user.isActive ? 'success' : 'default'} 
                        size="small" 
                      />
                      {user.cursor && (
                        <Typography variant="caption">
                          Cursor: {user.cursor.x}, {user.cursor.y}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          {users.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No users online
            </Typography>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button 
              size="small" 
              startIcon={<UserPlus size={16} />}
              onClick={() => joinRoom('demo-room')}
            >
              Join Demo Room
            </Button>
            <Button 
              size="small" 
              startIcon={<Settings size={16} />}
              variant="outlined"
            >
              Settings
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
