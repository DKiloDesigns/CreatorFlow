'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Tooltip,
  Fade,
  Zoom,
  keyframes,
  Drawer,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  TextField,
  InputAdornment,
  Paper
} from '@mui/material';
import { 
  MessageSquare, 
  Sparkles, 
  Zap, 
  Settings, 
  X, 
  Send, 
  RefreshCw, 
  Users, 
  Plus, 
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';

// Keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.3); }
  50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(99, 102, 241, 0.4); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
`;

interface FloatingMessengerIconProps {
  unreadCount?: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'creative' | 'minimal';
}

type ViewMode = 'conversations' | 'chat' | 'new-message';

export function FloatingMessengerIcon({
  unreadCount = 0,
  isActive = false,
  href = '/dashboard/messaging',
  onClick,
  size = 'medium',
  variant = 'creative'
}: FloatingMessengerIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('conversations');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessageText, setNewMessageText] = useState('');

  // Mock data for conversations
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Hey! How\'s the content strategy going?',
      timestamp: '2m ago',
      unread: 2,
      online: true,
      messages: [
        { id: '1', sender: 'Sarah Johnson', content: 'Hey! How\'s the content strategy going?', timestamp: '2m ago', isOwn: false },
        { id: '2', sender: 'You', content: 'Going great! Just finished the Q1 planning.', timestamp: '1m ago', isOwn: true },
        { id: '3', sender: 'Sarah Johnson', content: 'That\'s awesome! Would love to collaborate on some ideas.', timestamp: '1m ago', isOwn: false }
      ]
    },
    {
      id: '2',
      name: 'Mike Chen',
      lastMessage: 'Thanks for the collaboration opportunity!',
      timestamp: '1h ago',
      unread: 0,
      online: false,
      messages: [
        { id: '1', sender: 'Mike Chen', content: 'Thanks for the collaboration opportunity!', timestamp: '1h ago', isOwn: false },
        { id: '2', sender: 'You', content: 'Happy to work together!', timestamp: '1h ago', isOwn: true }
      ]
    },
    {
      id: '3',
      name: 'CreatorFlow Team',
      lastMessage: 'Welcome to the community! 🎉',
      timestamp: '3h ago',
      unread: 1,
      online: true,
      messages: [
        { id: '1', sender: 'CreatorFlow Team', content: 'Welcome to the community! 🎉', timestamp: '3h ago', isOwn: false },
        { id: '2', sender: 'CreatorFlow Team', content: 'Don\'t forget to check out our latest features!', timestamp: '2h ago', isOwn: false }
      ]
    }
  ]);

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 36, height: 36, minWidth: 36, minHeight: 36 };
      case 'large':
        return { width: 52, height: 52, minWidth: 52, minHeight: 52 };
      default:
        return { width: 44, height: 44, minWidth: 44, minHeight: 44 };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          bgcolor: 'background.paper',
          color: 'text.primary',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
            transform: 'scale(1.05)',
          }
        };
      case 'creative':
        return {
          background: isActive 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: isActive ? 'white' : 'primary.main',
          animation: isActive ? `${glow} 2s ease-in-out infinite` : `${float} 3s ease-in-out infinite`,
          '&:hover': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            transform: 'scale(1.1) translateY(-2px)',
            boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
          }
        };
      default:
        return {
          bgcolor: isActive ? 'primary.main' : 'background.paper',
          color: isActive ? 'primary.contrastText' : 'text.primary',
          '&:hover': {
            bgcolor: isActive ? 'primary.dark' : 'action.hover',
            transform: 'scale(1.05)',
          }
        };
    }
  };

  const getBadgeStyles = () => {
    if (unreadCount === 0) return {};
    
    return {
      '& .MuiBadge-badge': {
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        color: 'white',
        fontWeight: 600,
        fontSize: '0.75rem',
        minWidth: 20,
        height: 20,
        borderRadius: '10px',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
        animation: unreadCount > 0 ? `${pulse} 1.5s ease-in-out infinite` : 'none',
      }
    };
  };

  const iconElement = (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...getSizeStyles()
      }}
    >
      {/* Sparkle effects for creative variant */}
      {variant === 'creative' && showSparkles && (
        <>
          <Fade in={showSparkles} timeout={500}>
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                animation: `${sparkle} 0.6s ease-in-out`,
                zIndex: 1
              }}
            >
              <Sparkles size={12} color="#ffd700" />
            </Box>
          </Fade>
          <Fade in={showSparkles} timeout={800}>
            <Box
              sx={{
                position: 'absolute',
                bottom: -6,
                left: -6,
                animation: `${sparkle} 0.8s ease-in-out`,
                zIndex: 1
              }}
            >
              <Zap size={10} color="#ff6b6b" />
            </Box>
          </Fade>
        </>
      )}

      {/* Main icon */}
      <MessageSquare size={getIconSize()} />
    </Box>
  );

  const handleMessengerClick = () => {
    if (onClick) {
      onClick();
    } else {
      setDrawerOpen(true);
      setViewMode('conversations');
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setViewMode('conversations');
    setSelectedConversation(null);
  };

  const handleNewMessage = () => {
    setViewMode('new-message');
  };

  const handleRefresh = () => {
    setConversations(prev => [...prev]);
    console.log('Conversations refreshed');
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversation(conversationId);
    setViewMode('chat');
  };

  const handleBackToConversations = () => {
    setViewMode('conversations');
    setSelectedConversation(null);
  };

  const handleSendMessage = () => {
    if (newMessageText.trim()) {
      console.log('Sending message:', newMessageText);
      setNewMessageText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Filter conversations based on selected filter
  const filteredConversations = conversations.filter(conversation => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return conversation.unread > 0;
    if (filterType === 'online') return conversation.online;
    return true;
  });

  const selectedConv = selectedConversation ? conversations.find(c => c.id === selectedConversation) : null;

  const buttonElement = (
    <IconButton
      component="button"
      onClick={handleMessengerClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        borderRadius: '50%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        ...getSizeStyles(),
        background: 'transparent',
        color: isActive ? 'primary.main' : 'text.primary',
        '&:hover': {
          background: 'transparent',
          color: 'primary.main',
          transform: 'scale(1.1)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        }
      }}
      aria-label={unreadCount > 0 ? `${unreadCount} unread messages` : 'Messages'}
    >
      {iconElement}
    </IconButton>
  );

  const renderConversationsList = () => (
    <>
      {/* Action Buttons */}
      <Box sx={{ 
        p: 3, 
        pt: 2, 
        pb: 2,
        background: 'rgba(255, 255, 255, 0.5)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={handleNewMessage}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.5,
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50'
              }
            }}
          >
            New Message
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<RefreshCw size={16} />}
            onClick={handleRefresh}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
              py: 0.5,
              borderColor: 'rgba(148, 163, 184, 0.3)',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
                bgcolor: 'primary.50'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ 
        p: 3, 
        pt: 2, 
        pb: 2,
        background: 'rgba(255, 255, 255, 0.3)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)'
      }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {['all', 'unread', 'online'].map((filter) => (
            <Chip
              key={filter}
              label={filter}
              size="small"
              variant={filterType === filter ? 'filled' : 'outlined'}
              color={filterType === filter ? 'primary' : 'default'}
              onClick={() => setFilterType(filter)}
              clickable
              sx={{
                borderRadius: 2,
                textTransform: 'capitalize',
                fontWeight: filterType === filter ? 600 : 500,
                fontSize: '0.75rem',
                height: 28,
                '&.MuiChip-filled': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                },
                '&.MuiChip-outlined': {
                  borderColor: 'rgba(148, 163, 184, 0.4)',
                  color: 'text.secondary',
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'primary.50'
                  }
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Conversations List */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        background: 'rgba(255, 255, 255, 0.2)',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(148, 163, 184, 0.1)',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(148, 163, 184, 0.3)',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'rgba(148, 163, 184, 0.5)',
        }
      }}>
        {filteredConversations.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            textAlign: 'center',
            p: 4
          }}>
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <MessageSquare size={32} color="#94a3b8" />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              No messages
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.disabled',
                maxWidth: 200
              }}
            >
              Start a conversation with other creators!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 2 }}>
            {filteredConversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                sx={{
                  bgcolor: conversation.unread > 0 ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  borderRadius: 2,
                  mb: 1.5,
                  p: 2,
                  border: conversation.unread > 0 ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: conversation.unread > 0 ? '0 2px 8px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: conversation.unread > 0 ? '0 4px 16px rgba(59, 130, 246, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                    bgcolor: conversation.unread > 0 ? 'rgba(59, 130, 246, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
                secondaryAction={
                  conversation.unread > 0 && (
                    <Badge 
                      badgeContent={conversation.unread} 
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          minWidth: 20,
                          height: 20,
                          borderRadius: '10px',
                          border: '2px solid white',
                          boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                        }
                      }}
                    >
                      <Box />
                    </Badge>
                  )
                }
              >
                <ListItemIcon sx={{ minWidth: 50, position: 'relative' }}>
                  <Avatar sx={{ 
                    width: 40, 
                    height: 40, 
                    background: conversation.online 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
                    boxShadow: conversation.online 
                      ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                      : '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <MessageSquare size={20} color={conversation.online ? 'white' : '#6b7280'} />
                  </Avatar>
                  {conversation.online && (
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 2,
                        right: 2,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        border: '2px solid white',
                        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)'
                      }}
                    />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: conversation.unread > 0 ? 700 : 600,
                          color: conversation.unread > 0 ? 'primary.main' : 'text.primary',
                          mb: 0.5
                        }}
                      >
                        {conversation.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.disabled',
                          fontSize: '0.75rem'
                        }}
                      >
                        {conversation.timestamp}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </>
  );

  const renderChatView = () => {
    if (!selectedConv) return null;

    return (
      <>
        {/* Chat Header */}
        <Box sx={{ 
          p: 3, 
          pb: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              size="small" 
              onClick={handleBackToConversations}
              sx={{ 
                color: 'text.secondary',
                '&:hover': { 
                  color: 'primary.main',
                  bgcolor: 'primary.50'
                }
              }}
            >
              <ArrowLeft size={20} />
            </IconButton>
            <Avatar sx={{ 
              width: 40, 
              height: 40, 
              background: selectedConv.online 
                ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
              boxShadow: selectedConv.online 
                ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <MessageSquare size={20} color={selectedConv.online ? 'white' : '#6b7280'} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {selectedConv.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {selectedConv.online ? 'Online' : 'Offline'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Phone size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Video size={18} />
              </IconButton>
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <MoreVertical size={18} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Messages */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          p: 2,
          background: 'rgba(255, 255, 255, 0.2)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(148, 163, 184, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(148, 163, 184, 0.3)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(148, 163, 184, 0.5)',
          }
        }}>
          {selectedConv.messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  background: message.isOwn 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
                  color: message.isOwn ? 'white' : 'text.primary',
                  borderRadius: message.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {message.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: '0.7rem'
                  }}
                >
                  {message.timestamp}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* Message Input */}
        <Box sx={{ 
          p: 2,
          background: 'rgba(255, 255, 255, 0.5)',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type a message..."
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  }
                }
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              disabled={!newMessageText.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&:disabled': {
                  bgcolor: 'action.disabled',
                  color: 'action.disabled',
                }
              }}
            >
              <Send size={18} />
            </IconButton>
          </Box>
        </Box>
      </>
    );
  };

  const renderNewMessageView = () => (
    <>
      {/* New Message Header */}
      <Box sx={{ 
        p: 3, 
        pb: 2,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            size="small" 
            onClick={handleBackToConversations}
            sx={{ 
              color: 'text.secondary',
              '&:hover': { 
                color: 'primary.main',
                bgcolor: 'primary.50'
              }
            }}
          >
            <ArrowLeft size={20} />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            New Message
          </Typography>
        </Box>
      </Box>

      {/* New Message Form */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3,
        background: 'rgba(255, 255, 255, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <TextField
          fullWidth
          label="To"
          placeholder="Search for users..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Message"
          placeholder="What would you like to say?"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        />
        <Button
          variant="contained"
          startIcon={<Send size={16} />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1.5,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            }
          }}
        >
          Send Message
        </Button>
      </Box>
    </>
  );

  return (
    <>
      <Tooltip 
        title={unreadCount > 0 ? `${unreadCount} unread messages` : 'No new messages'}
        placement="bottom"
        arrow
      >
        <Box sx={{ position: 'relative' }}>
        {unreadCount > 0 ? (
          <Badge 
            badgeContent={unreadCount} 
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                minWidth: 20,
                height: 20,
                borderRadius: '10px',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(255, 107, 107, 0.4)',
                animation: `${pulse} 1.5s ease-in-out infinite`,
                top: 8,
                right: 8,
              }
            } as any}
          >
            {buttonElement}
          </Badge>
        ) : (
          buttonElement
        )}
        </Box>
      </Tooltip>

      {/* Messenger Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: viewMode === 'conversations' ? 420 : 600,
            maxWidth: '90vw',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderLeft: '1px solid rgba(148, 163, 184, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            '& .MuiDrawer-paper': {
              background: 'transparent',
            }
          }
        }}
      >
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            pb: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.025em'
                }}
              >
                {viewMode === 'conversations' && 'Messages'}
                {viewMode === 'chat' && selectedConv?.name}
                {viewMode === 'new-message' && 'New Message'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {viewMode === 'conversations' && (
                  <>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { 
                          color: 'primary.main',
                          bgcolor: 'primary.50'
                        }
                      }}
                    >
                      <Settings size={20} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleDrawerClose}
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { 
                          color: 'error.main',
                          bgcolor: 'error.50'
                        }
                      }}
                    >
                      <X size={20} />
                    </IconButton>
                  </>
                )}
                {viewMode !== 'conversations' && (
                  <IconButton 
                    size="small" 
                    onClick={handleDrawerClose}
                    sx={{ 
                      color: 'text.secondary',
                      '&:hover': { 
                        color: 'error.main',
                        bgcolor: 'error.50'
                      }
                    }}
                  >
                    <X size={20} />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          {/* Content based on view mode */}
          {viewMode === 'conversations' && renderConversationsList()}
          {viewMode === 'chat' && renderChatView()}
          {viewMode === 'new-message' && renderNewMessageView()}
        </Box>
      </Drawer>
    </>
  );
}

export default FloatingMessengerIcon;