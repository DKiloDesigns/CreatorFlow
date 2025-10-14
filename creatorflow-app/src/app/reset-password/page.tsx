'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  Alert,
  AlertTitle,
  TextField,
  Box,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import { LockOutlined as LockOutlinedIcon, ArrowBack as ArrowBackIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import Link from 'next/link';
import { PublicPageLayout } from '@/components/layout/PublicPageLayout'; // Import PublicPageLayout
import { useTheme } from '@mui/material/styles'; // Import useTheme

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');
  const email = searchParams?.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const theme = useTheme(); // Initialize useTheme

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setIsValidToken(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`);
        const data = await response.json();

        if (response.ok && data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (_error) {
        setIsValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long'
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Password reset successfully! Redirecting to sign in...'
        });
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to reset password. Please try again.'
        });
      }
    } catch (_error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body1">Validating reset link...</Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  if (!isValidToken) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Back to Auth */}
          <Box sx={{ alignSelf: 'flex-start' }}>
            <Button
              component={Link}
              href="/auth"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              variant="text"
              sx={{ color: theme.palette.text.secondary }}
            >
              Back to Sign In
            </Button>
          </Box>

          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              floai.studio
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Invalid Reset Link
            </Typography>
          </Box>

          {/* Invalid Link Card */}
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardHeader
              title="Invalid Reset Link"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              sx={{ textAlign: 'center', pb: 1 }}
            />
            <CardContent>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 3, color: theme.palette.text.secondary }}>
                This password reset link is invalid or has expired.
              </Typography>
              
              <Button
                component={Link}
                href="/forgot-password"
                variant="contained"
                fullWidth
                sx={{ mb: 2, height: 48 }}
              >
                Request New Reset Link
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Remember your password?{' '}
                  <Link href="/auth" style={{ color: theme.palette.info.main, textDecoration: 'underline' }}>
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
        <Container maxWidth="sm" sx={{ py: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          {/* Back to Auth */}
          <Box sx={{ alignSelf: 'flex-start' }}>
            <Button
              component={Link}
              href="/auth"
              startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              variant="text"
              sx={{ color: theme.palette.text.secondary }}
            >
              Back to Sign In
            </Button>
          </Box>

          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              floai.studio
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              Set your new password to get back to growing your audience
            </Typography>
          </Box>

          {/* Reset Password Card */}
          <Card sx={{ width: '100%', maxWidth: 400 }}>
            <CardHeader
              title="Reset Password"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              sx={{ textAlign: 'center', pb: 1 }}
            />
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* New Password Field */}
                <TextField
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password Field */}
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? <VisibilityOffIcon sx={{ fontSize: 16 }} /> : <VisibilityIcon sx={{ fontSize: 16 }} />}
                        </IconButton>
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
                  disabled={isLoading || !password || !confirmPassword}
                  sx={{ mt: 2, height: 48 }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={16} sx={{ mr: 1, animation: 'spin 1s linear infinite' }} />
                      <Typography>Resetting Password...</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <VpnKeyIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography>Reset Password</Typography>
                    </Box>
                  )}
                </Button>
              </Box>

              {/* Help Text */}
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: theme.palette.text.secondary }}>
                Your password must be at least 8 characters long and contain a mix of letters and numbers.
              </Typography>

              {/* Back to Sign In */}
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2">
                  Remember your password?{' '}
                  <Link href="/auth" style={{ color: theme.palette.info.main, textDecoration: 'underline' }}>
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <PublicPageLayout> {/* Ensure PublicPageLayout is applied even during suspense fallback */}
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Card sx={{ width: '100%', maxWidth: 400 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body1">Loading...</Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </PublicPageLayout>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
} 