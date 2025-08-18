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
  Grid
} from '@mui/material';
import { Mail, Activity } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link href="/auth" className="text-gray-500 hover:text-gray-700">
                <Activity className="h-4 w-4" />
              </Link>
              <Typography variant="h5" component="h1" className="text-2xl font-bold">
                Forgot Password
              </Typography>
            </div>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Typography>
          </CardHeader>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: (
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      ),
                    }}
                  />
                </Grid>

                {message && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        ...(message.type === 'error' ? { border: 1, borderColor: 'red.200', bgcolor: 'red.50' } : { border: 1, borderColor: 'green.200', bgcolor: 'green.50' }),
                      }}
                    >
                      <Typography variant="body2" color={message.type === 'error' ? 'red.800' : 'green.800'}>
                        {message.text}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="body2" align="center">
                    <Link href="/auth" className="text-sm text-blue-600 hover:text-blue-500">
                      Back to Sign In
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 