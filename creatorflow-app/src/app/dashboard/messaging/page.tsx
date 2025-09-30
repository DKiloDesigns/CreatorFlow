'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';

function MessagingContent() {
  const searchParams = useSearchParams();
  const [selectedConversation, setSelectedConversation] = React.useState('1');

  useEffect(() => {
    const conversationParam = searchParams.get('conversation');
    const actionParam = searchParams.get('action');
    
    if (conversationParam) {
      setSelectedConversation(conversationParam);
    }
    if (actionParam === 'new') {
      // Focus on the new message button or show a modal
      console.log('New message action triggered');
    }
  }, [searchParams]);

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Hey! How\'s the content strategy going?',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      lastMessage: 'Thanks for the collaboration opportunity!',
      timestamp: '1h ago',
      unread: 0,
      online: false
    },
    {
      id: '3',
      name: 'CreatorFlow Team',
      lastMessage: 'Welcome to the community! 🎉',
      timestamp: '3h ago',
      unread: 1,
      online: true
    },
    {
      id: '4',
      name: 'Alex Rodriguez',
      lastMessage: 'Let\'s schedule that podcast interview',
      timestamp: '5h ago',
      unread: 0,
      online: false
    },
    {
      id: '5',
      name: 'Emma Wilson',
      lastMessage: 'The new content calendar looks amazing!',
      timestamp: '1d ago',
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'Sarah Johnson',
      content: 'Hey! How\'s the content strategy going?',
      timestamp: '2m ago',
      isOwn: false
    },
    {
      id: '2',
      sender: 'You',
      content: 'Going great! Just finished the Q1 planning. How about you?',
      timestamp: '1m ago',
      isOwn: true
    },
    {
      id: '3',
      sender: 'Sarah Johnson',
      content: 'That\'s awesome! I\'d love to hear about your approach. Maybe we could collaborate on something?',
      timestamp: '30s ago',
      isOwn: false
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Messages
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect and collaborate with other creators
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Search and New Message */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Search conversations..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Plus size={20} />}
                  onClick={() => {
                    // For now, just show an alert. In a real app, this would open a modal or navigate to a new conversation page
                    alert('New message feature coming soon! This will open a modal to start a new conversation.');
                  }}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  New
                </Button>
              </Box>
            </Box>

            {/* Conversations */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {conversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    selected={conversation.id === selectedConversation}
                    onClick={() => setSelectedConversation(conversation.id)}
                    sx={{
                      cursor: 'pointer',
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&.Mui-selected': {
                        bgcolor: 'primary.50',
                        '&:hover': {
                          bgcolor: 'primary.100',
                        }
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: conversation.online ? 'success.main' : 'grey.400'
                          }}
                        >
                          <MessageSquare size={24} />
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
                              bgcolor: 'success.main',
                              border: '2px solid white',
                              boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.3)'
                            }}
                          />
                        )}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {conversation.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conversation.timestamp}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '200px'
                            }}
                          >
                            {conversation.lastMessage}
                          </Typography>
                          {conversation.unread > 0 && (
                            <Chip
                              label={conversation.unread}
                              size="small"
                              color="primary"
                              sx={{ 
                                minWidth: 20, 
                                height: 20, 
                                fontSize: '0.75rem',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: selectedConv.online ? 'success.main' : 'grey.400'
                        }}
                      >
                        <MessageSquare size={20} />
                      </Avatar>
                      {selectedConv.online && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: 'success.main',
                            border: '2px solid white',
                            boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.3)'
                          }}
                        />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {selectedConv.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedConv.online ? 'Online' : 'Last seen 2 hours ago'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <Phone size={20} />
                    </IconButton>
                    <IconButton size="small">
                      <Video size={20} />
                    </IconButton>
                    <IconButton size="small">
                      <MoreVertical size={20} />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto', 
                  p: 2,
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                }}>
                  {messages.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: message.isOwn ? 'row-reverse' : 'row',
                          alignItems: 'flex-end',
                          gap: 1
                        }}
                      >
                        {!message.isOwn && (
                          <Avatar
                            sx={{ width: 32, height: 32 }}
                          >
                            <MessageSquare size={16} />
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            bgcolor: message.isOwn ? 'primary.main' : 'white',
                            color: message.isOwn ? 'white' : 'text.primary',
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: message.isOwn ? 'none' : '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Typography variant="body2">
                            {message.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block',
                              mt: 0.5,
                              opacity: 0.7,
                              fontSize: '0.75rem'
                            }}
                          >
                            {message.timestamp}
                          </Typography>
                        </Box>
                        {message.isOwn && (
                          <CheckCircle size={16} color="#22c55e" />
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ 
                  p: 2, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  background: 'white'
                }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Type a message..."
                      variant="outlined"
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<Send size={20} />}
                      sx={{ 
                        minWidth: 'auto', 
                        px: 2,
                        borderRadius: 3,
                        height: 40
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
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
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.1)'
                }}>
                  <MessageSquare size={32} color="#22c55e" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose a conversation from the list to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default function MessagingPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6">Loading messages...</Typography>
        </Box>
      </Container>
    }>
      <MessagingContent />
    </Suspense>
  );
}
