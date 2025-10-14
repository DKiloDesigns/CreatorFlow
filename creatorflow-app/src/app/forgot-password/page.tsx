'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  InputAdornment,
  Alert,
  AlertTitle,
  CircularProgress
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import Link from 'next/link';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout'; // Import PublicPageLayout
import { useTheme } from '@mui/material/styles'; // Import useTheme

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const theme = useTheme(); // Initialize useTheme

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'Password reset email sent successfully!'
        });
        setEmail('');
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to send reset email. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicPageLayout> {/* Wrap content with PublicPageLayout */}
      {/* Hero Section Wrapper */}
      <Box 
        component="section" 
        sx={{
          py: { xs: 8, md: 12 }, 
          px: { xs: 2, sm: 3, lg: 4 }, // Use consistent horizontal padding
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(to right, #dbeafe, #e9d5ff)' 
            : 'linear-gradient(to right, rgba(30, 58, 138, 0.2), rgba(147, 51, 234, 0.2))', 
        }}
      >
        <Container maxWidth="sm" sx={{ py: 0 }}> {/* Adjust Container padding */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            {/* Back to Auth */}
            <Box sx={{ alignSelf: 'flex-start' }}>
              <Button
                component={Link}
                href="/auth"
                startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
                variant="text"
                sx={{ color: theme.palette.text.secondary }} // Use theme.palette.text.secondary for consistency
              >
                Back to Sign In
              </Button>
            </Box>

            {/* Logo */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                floai.studio
              </Typography>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}> // Use theme.palette.text.secondary for consistency
                Reset your password to get back to growing your audience
              </Typography>
            </Box>

            {/* Forgot Password Card */}
            <Card sx={{ width: '100%', maxWidth: 400 }}>
              <CardHeader
                title="Reset Password"
                titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
                sx={{ textAlign: 'center', pb: 1 }}
              />
              <CardContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Email Field */}
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Message Alert */}
                  {message && (
                    <Alert
                      severity={message.type === 'error' ? 'error' : 'success'}
                      sx={{ mt: 1 }}
                    >
                      <AlertTitle>
                        {message.type === 'error' ? 'Error' : 'Success'}
                      </AlertTitle>
                      {message.text}
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading || !email}
                    sx={{ mt: 2, height: 48 }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={16} sx={{ mr: 1, animation: 'spin 1s linear infinite' }} />
                        <Typography>Sending Reset Link...</Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <VpnKeyIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography>Send Reset Link</Typography>
                      </Box>
                    )}
                  </Button>
                </Box>

                {/* Help Text */}
                <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: theme.palette.text.secondary }}> // Use theme.palette.text.secondary for consistency
                  We&apos;ll send you a secure link to reset your password. 
                  Check your email and follow the instructions.
                </Typography>

                {/* Back to Sign In */}
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2">
                    Remember your password?{' '}
                    <Link href="/auth" style={{ color: theme.palette.info.main, textDecoration: 'underline' }}> // Use theme.palette.info.main for link consistency
                      Back to Sign In
                    </Link>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box> {/* Close Hero Section Wrapper */}
    </PublicPageLayout> /* Close PublicPageLayout */
  );
} 