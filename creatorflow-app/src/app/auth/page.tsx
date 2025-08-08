'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 

  Alert,
  AlertTitle,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsEmailValid(isValid);
  }, [email]);

  // Check if email exists when user finishes typing
  useEffect(() => {
    if (!isEmailValid || email.length < 5) {
      setIsNewUser(null);
      return;
    }

    const checkEmail = async () => {
      setIsCheckingEmail(true);
      try {
        const response = await fetch('/api/auth/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.toLowerCase() }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const { exists } = data;
          const newUserStatus = !exists;
          setIsNewUser(newUserStatus);
        } else {
          console.error('Email check failed:', response.status);
          const errorText = await response.text();
          console.error('Error response body:', errorText);
        }
      } catch (error) {
        console.error('Error checking email:', error);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [email, isEmailValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isNewUser) {
        // Validate name for new users
        if (!name.trim()) {
          throw new Error('Name is required for new accounts');
        }

        // Sign up new user
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Signup failed');
        }

        // Sign in the new user
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push('/dashboard');
      } else {
        // Sign in existing user
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push('/dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  const getActionText = () => {
    if (isNewUser === null) return 'Continue';
    return isNewUser ? 'Create Account' : 'Sign In';
  };

  const getDescription = () => {
    if (isNewUser === null) return 'Enter your email to get started';
    return isNewUser 
      ? 'Create your CreatorFlow account to start growing your audience'
      : 'Welcome back! Sign in to your CreatorFlow account';
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        {/* Back to Home */}
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowLeft style={{ width: 16, height: 16 }} />}
            variant="text"
            sx={{ color: 'text.secondary' }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            CreatorFlow
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {getDescription()}
          </Typography>
        </Box>

        {/* Auth Card */}
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardHeader
            title={getActionText()}
            titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
            sx={{ textAlign: 'center', pb: 1 }}
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Email Field */}
              <TextField
                label="Email"
                type="email"
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
                  endAdornment: isCheckingEmail && (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ),
                }}
                error={email.length > 0 && !isEmailValid}
                helperText={email.length > 0 && !isEmailValid ? 'Please enter a valid email' : ''}
              />

              {/* Name Field (only for new users) */}
              {isNewUser && (
                <TextField
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User style={{ width: 16, height: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              {/* Password Field */}
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock style={{ width: 16, height: 16 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  <AlertTitle>Error</AlertTitle>
                  {error}
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !isEmailValid || (isNewUser && !name.trim())}
                sx={{ mt: 2, height: 48 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, marginRight: 8, animation: 'spin 1s linear infinite' }} />
                    {isNewUser ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  getActionText()
                )}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            {/* OAuth Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOAuthSignIn('google')}
                sx={{ height: 48 }}
              >
                Continue with Google
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleOAuthSignIn('github')}
                sx={{ height: 48 }}
              >
                Continue with GitHub
              </Button>
            </Box>

            {/* Terms */}
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
              By continuing, you agree to our{' '}
              <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>
                Privacy Policy
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
} 