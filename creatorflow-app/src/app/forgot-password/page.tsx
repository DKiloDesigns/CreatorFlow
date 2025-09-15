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
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Back to Auth */}
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Button
            component={Link}
            href="/auth"
            startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
            variant="text"
            sx={{ color: 'text.secondary' }}
          >
            Back to Sign In
          </Button>
        </Box>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            CreatorFlow
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
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
                      <Mail style={{ width: 16, height: 16 }} />
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
                  <>
                    <Loader2 style={{ width: 16, height: 16, marginRight: 8, animation: 'spin 1s linear infinite' }} />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <KeyRound style={{ width: 16, height: 16, marginRight: 8 }} />
                    Send Reset Link
                  </>
                )}
              </Button>
            </Box>

            {/* Help Text */}
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
              We&apos;ll send you a secure link to reset your password. 
              Check your email and follow the instructions.
            </Typography>

            {/* Back to Sign In */}
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Remember your password?{' '}
                <Link href="/auth" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Back to Sign In
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 