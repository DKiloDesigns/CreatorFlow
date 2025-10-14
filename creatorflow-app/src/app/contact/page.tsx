'use client';

import { useState } from "react";
import Link from 'next/link';
import { Email as EmailIcon, Phone as PhoneIcon, LocationOn as LocationOnIcon, AccessTime as AccessTimeIcon, Chat as ChatIcon, Send as SendIcon } from '@mui/icons-material';
// Removing PublicHeader and Footer imports as PublicPageLayout will handle these
import { PublicPageLayout } from '@/components/layout/PublicPageLayout';
import { useTheme } from '@mui/material/styles';
import { Box, Container, Typography, Grid, Paper, TextField, Button, MenuItem } from '@mui/material'; // Import Material-UI components

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useTheme();

  return (
    <PublicPageLayout>
      {/* Hero Section */}
      <Box component="section" sx={{
        py: { xs: 8, md: 12 }, 
        px: { xs: 4, sm: 3, lg: 4 }, 
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
          : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))', 
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.text.primary, 
            mb: 3,
            fontSize: { xs: '2.5rem', sm: '3rem', lg: '3.125rem' }
          }}>
            Get in Touch
          </Typography>
          <Typography variant="h5" sx={{ 
            color: theme.palette.text.secondary, 
            mb: 4,
          }}>
            Have questions about floai.studio? We&apos;d love to hear from you.
          </Typography>
        </Container>
      </Box>

      {/* Contact Methods */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 8 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.primary.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                }}>
                  <EmailIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: theme.palette.text.primary, mb: 1 }}>Email Us</Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>For general inquiries</Typography>
                <Link href="mailto:hello@floai.studio" style={{ textDecoration: 'none' }}>
                  <Typography component="span" sx={{
                    color: theme.palette.info.main,
                    '&:hover': { color: theme.palette.info.dark }
                  }}>
                hello@floai.studio
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.secondary.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                }}>
                  <ChatIcon sx={{ fontSize: 32, color: theme.palette.secondary.main }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: theme.palette.text.primary, mb: 1 }}>Support</Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>For technical help</Typography>
                <Link href="mailto:support@floai.studio" style={{ textDecoration: 'none' }}>
                  <Typography component="span" sx={{
                    color: theme.palette.info.main,
                    '&:hover': { color: theme.palette.info.dark }
                  }}>
                support@floai.studio
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 64, 
                  height: 64, 
                  bgcolor: theme.palette.success.light, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mx: 'auto', 
                  mb: 2,
                }}>
                  <PhoneIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: theme.palette.text.primary, mb: 1 }}>Sales</Typography>
                <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 2 }}>For enterprise inquiries</Typography>
                <Link href="mailto:sales@floai.studio" style={{ textDecoration: 'none' }}>
                  <Typography component="span" sx={{
                    color: theme.palette.info.main,
                    '&:hover': { color: theme.palette.info.dark }
                  }}>
                sales@floai.studio
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Box maxWidth="sm" sx={{ mx: 'auto' }}>
            <Paper sx={{ p: 4, border: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 4, textAlign: 'center' }}>Send us a Message</Typography>
              
              {submitted ? (
                <Box sx={{ bgcolor: theme.palette.success.light, color: theme.palette.success.dark, borderRadius: 1, p: 3, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>✅</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'semibold', mb: 1 }}>Thank you for reaching out!</Typography>
                  <Typography variant="body2">We&apos;ll get back to you within 24 hours.</Typography>
                </Box>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" component="label" htmlFor="firstName" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.text.secondary, mb: 1 }}>
                        First Name
                      </Typography>
                      <TextField 
                        id="firstName" 
                        name="firstName" 
                        type="text" 
                        required 
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            borderColor: theme.palette.divider,
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: '2px'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" component="label" htmlFor="lastName" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.text.secondary, mb: 1 }}>
                        Last Name
                      </Typography>
                      <TextField 
                        id="lastName" 
                        name="lastName" 
                        type="text" 
                        required 
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            borderColor: theme.palette.divider,
                            bgcolor: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: '2px'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" component="label" htmlFor="email" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.text.secondary, mb: 1 }}>
                      Email Address
                    </Typography>
                    <TextField 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      fullWidth
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          borderColor: theme.palette.divider,
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" component="label" htmlFor="subject" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.text.secondary, mb: 1 }}>
                      Subject
                    </Typography>
                    <TextField 
                      id="subject" 
                      name="subject" 
                      select
                      required 
                      fullWidth
                      variant="outlined"
                      defaultValue=""
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          borderColor: theme.palette.divider,
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    >
                      <MenuItem value="">Select a subject</MenuItem>
                      <MenuItem value="general">General Inquiry</MenuItem>
                      <MenuItem value="support">Technical Support</MenuItem>
                      <MenuItem value="sales">Sales Question</MenuItem>
                      <MenuItem value="partnership">Partnership</MenuItem>
                      <MenuItem value="feedback">Feedback</MenuItem>
                    </TextField>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="body2" component="label" htmlFor="message" sx={{ display: 'block', fontWeight: 'medium', color: theme.palette.text.secondary, mb: 1 }}>
                      Message
                    </Typography>
                    <TextField 
                      id="message" 
                      name="message" 
                      rows={5} 
                      required 
                      fullWidth
                      multiline
                      variant="outlined"
                      placeholder="Tell us how we can help you..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          borderColor: theme.palette.divider,
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.text.primary,
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                            borderWidth: '2px'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.primary.main,
                          }
                        }
                      }}
                    />
                  </Box>
                  
                  <Button 
                    type="submit" 
                    variant="contained"
                    fullWidth
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.common.white,
                      fontWeight: 'semibold',
                      py: 1.5,
                      px: 3,
                      borderRadius: '0.5rem',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark,
                      },
                    }}
                    startIcon={<SendIcon sx={{ fontSize: 16 }} />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* Office Info */}
      <Box component="section" sx={{ py: 8, px: { xs: 4, sm: 3, lg: 4 }, bgcolor: theme.palette.background.default }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 4, textAlign: 'center' }}>Our Office</Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    width: 48, 
                    height: 48, 
                    bgcolor: theme.palette.primary.light, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                  }}>
                    <LocationOnIcon sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: theme.palette.text.primary, mb: 1 }}>San Francisco</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    123 floai.studio Street<br />
                    San Francisco, CA 94105<br />
                    United States
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, border: `1px solid ${theme.palette.divider}` }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{
                    width: 48, 
                    height: 48, 
                    bgcolor: theme.palette.secondary.light, 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                  }}>
                    <AccessTimeIcon sx={{ fontSize: 24, color: theme.palette.secondary.main }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', color: theme.palette.text.primary, mb: 1 }}>Business Hours</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Monday - Friday: 9:00 AM - 6:00 PM PST<br />
                    Saturday: 10:00 AM - 4:00 PM PST<br />
                    Sunday: Closed
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </PublicPageLayout>
  );
} 