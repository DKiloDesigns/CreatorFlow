'use client';

import React, { useState } from 'react';
import { useUserSupport } from '@/hooks/useUserSupport';
import Link from 'next/link';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  TextField, 
  Alert,
  AlertTitle,
  Grid,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { FileText, Shield, Mail, MessageCircle, HelpCircle, Users, BarChart3 } from 'lucide-react';

export default function SupportPage() {
  const { loading, error, success, submitFeedback, setSuccess, setError } = useUserSupport();
  const [feedback, setFeedback] = useState('');

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    await submitFeedback(feedback);
    setFeedback('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Support & Help Center
        </Typography>
        
        <Grid container spacing={3}>
          {/* Resources Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <HelpCircle style={{ width: 20, height: 20, color: '#2563eb' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Resources
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FileText style={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Button 
                          variant="text" 
                          sx={{ color: 'primary.main', textTransform: 'none', p: 0, minWidth: 'auto' }}
                        >
                          FAQ / Knowledge Base
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <BarChart3 style={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Button 
                          variant="text" 
                          sx={{ color: 'primary.main', textTransform: 'none', p: 0, minWidth: 'auto' }}
                        >
                          System Status
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Users style={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Button 
                          variant="text" 
                          sx={{ color: 'primary.main', textTransform: 'none', p: 0, minWidth: 'auto' }}
                        >
                          Community / Forum
                        </Button>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Contact Support Section */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Mail style={{ width: 20, height: 20, color: '#16a34a' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Contact Support
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    component="a"
                    href="mailto:support@creatorflow.com"
                    variant="contained"
                    startIcon={<Mail style={{ width: 16, height: 16 }} />}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Email Support
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MessageCircle style={{ width: 16, height: 16 }} />}
                    disabled
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Live Chat (Coming Soon)
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Legal & Feedback Section */}
          <Grid item xs={12} md={6}>
            {/* Legal & Policies Section */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Shield style={{ width: 20, height: 20, color: '#9333ea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Legal & Policies
                  </Typography>
                </Box>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <FileText style={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Button 
                          component={Link}
                          href="/terms"
                          variant="text" 
                          sx={{ color: 'primary.main', textTransform: 'none', p: 0, minWidth: 'auto' }}
                        >
                          Terms of Service
                        </Button>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Shield style={{ width: 16, height: 16 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Button 
                          component={Link}
                          href="/privacy"
                          variant="text" 
                          sx={{ color: 'primary.main', textTransform: 'none', p: 0, minWidth: 'auto' }}
                        >
                          Privacy Policy
                        </Button>
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Send Feedback
                </Typography>
                
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    <AlertTitle>Success</AlertTitle>
                    {success}
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleFeedback} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Your Feedback"
                    multiline
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tell us what you think about CreatorFlow..."
                    fullWidth
                    required
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !feedback.trim()}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    {loading ? 'Sending...' : 'Send Feedback'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 