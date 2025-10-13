'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Link,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  CheckCircle,
  Error as ErrorIcon,
  ArrowBack,
  Security,
} from '@mui/icons-material';
import { signIn, signUp, signOut, useSession } from 'next-auth/react';
import { ErrorDisplay, ValidationError } from '../ui/error-handler';

interface AuthStep {
  id: string;
  label: string;
  component: React.ReactNode;
}

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  rememberMe: boolean;
  acceptTerms: boolean;
}

interface AuthErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  general?: string;
}

export function EnhancedAuthFlow() {
  const { data: session, status } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    rememberMe: false,
    acceptTerms: false,
  });

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  // Clear errors when form data changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: AuthErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    // Confirm password validation (for signup)
    if (authMode === 'signup') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    // Name validation (for signup)
    if (authMode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required';
    }

    // Terms acceptance (for signup)
    if (authMode === 'signup' && !formData.acceptTerms) {
      newErrors.general = 'Please accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof AuthFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Invalid email or password' });
      } else if (result?.ok) {
        // Success - user will be redirected
        setActiveStep(1);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signUp('credentials', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        redirect: false,
      });

      if (result?.error) {
        setErrors({ general: 'Failed to create account. Please try again.' });
      } else if (result?.ok) {
        setActiveStep(1);
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Implement forgot password logic here
      // This would typically send a reset email
      setErrors({ general: 'Password reset email sent!' });
    } catch (error) {
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const steps: AuthStep[] = [
    {
      id: 'credentials',
      label: authMode === 'signin' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password',
      component: (
        <Box sx={{ mt: 2 }}>
          {Object.keys(errors).length > 0 && (
            <ValidationError errors={errors} onClear={() => setErrors({})} />
          )}

          {authMode === 'signup' && (
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {authMode !== 'forgot' && (
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}

          {authMode === 'signup' && (
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          )}

          {authMode === 'signin' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                  />
                }
                label="Remember me"
              />
              <Link
                component="button"
                variant="body2"
                onClick={() => setAuthMode('forgot')}
              >
                Forgot password?
              </Link>
            </Box>
          )}

          {authMode === 'signup' && (
            <FormControlLabel
              control={
                <Switch
                  checked={formData.acceptTerms}
                  onChange={handleInputChange('acceptTerms')}
                />
              }
              label={
                <Typography variant="body2">
                  I accept the{' '}
                  <Link href="/terms" target="_blank">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" target="_blank">
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={authMode === 'signin' ? handleSignIn : authMode === 'signup' ? handleSignUp : handleForgotPassword}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Security />}
            sx={{ mb: 2 }}
          >
            {isLoading
              ? 'Processing...'
              : authMode === 'signin'
              ? 'Sign In'
              : authMode === 'signup'
              ? 'Create Account'
              : 'Send Reset Email'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => signIn('google')}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setErrors({});
                }}
              >
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </Link>
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'success',
      label: 'Success',
      component: (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {authMode === 'signin' ? 'Welcome back!' : 'Account created successfully!'}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {authMode === 'signin'
              ? 'You have been signed in successfully.'
              : 'Your account has been created. You can now start using floai.studio.'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Dashboard
          </Button>
        </Box>
      ),
    },
  ];

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (session) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          You're already signed in!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome back, {session.user?.name || session.user?.email}!
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = '/dashboard'}
          sx={{ mr: 2 }}
        >
          Go to Dashboard
        </Button>
        <Button
          variant="outlined"
          onClick={() => signOut()}
        >
          Sign Out
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto' }}>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {authMode === 'signin' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {authMode === 'signin'
              ? 'Sign in to your floai.studio account'
              : authMode === 'signup'
              ? 'Join floai.studio and start creating amazing content'
              : 'Enter your email to reset your password'}
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.id}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>{step.component}</StepContent>
            </Step>
          ))}
        </Stepper>

        {authMode === 'forgot' && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => setAuthMode('signin')}
            >
              Back to Sign In
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
