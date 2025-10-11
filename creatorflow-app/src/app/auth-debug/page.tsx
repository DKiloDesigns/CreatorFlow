'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Shield as ShieldIcon,
  Key as KeyIcon,
  Timeline as ActivityIcon
} from '@mui/icons-material';

export default function AuthDebugPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const checkEmail = async () => {
    if (!email || email.length < 5) {
      addDebugInfo('Email too short, skipping check');
      setIsNewUser(null);
      return;
    }

    setIsCheckingEmail(true);
    addDebugInfo(`Checking email: ${email}`);
    
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });
      
      if (response.ok) {
        const { exists } = await response.json();
        addDebugInfo(`Email check result: exists=${exists}, isNewUser=${!exists}`);
        setIsNewUser(!exists);
      } else {
        addDebugInfo(`Email check failed: ${response.status}`);
      }
    } catch (error) {
      addDebugInfo(`Email check error: ${error}`);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    addDebugInfo('Form submitted');

    try {
      addDebugInfo(`Form data: email=${email}, isNewUser=${isNewUser}, hasName=${!!name}`);

      if (isNewUser) {
        if (!name.trim()) {
          throw new Error('Name is required for new accounts');
        }

        addDebugInfo('Creating new user account...');
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create account');
        }

        const signupData = await response.json();
        addDebugInfo(`User created: ${signupData.user.email}`);
      }

      addDebugInfo('Signing in...');
      const result = await signIn('credentials', {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        addDebugInfo(`Sign in error: ${result.error}`);
        throw new Error(result.error);
      }

      addDebugInfo('Sign in successful!');
      // Don't redirect in debug mode
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      addDebugInfo(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Auth Form */}
        <Card>
          <CardHeader>
                          <Typography variant="h6">Auth Debug</Typography>
            <Typography variant="body2" color="text.secondary">Test the auth flow step by step</Typography>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Typography variant="body2" component="label" htmlFor="email">Email</Typography>
              <TextField
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={checkEmail}
              />
              {isCheckingEmail && <div className="text-sm text-muted-foreground">Checking email...</div>}
              <div className="text-sm text-muted-foreground">
                Status: {isNewUser === null ? 'Checking...' : isNewUser ? 'New user' : 'Existing user'}
              </div>
            </div>

            {/* Name Field - Only show for new users */}
            {isNewUser && (
              <div className="space-y-2">
                <Typography variant="body2" component="label" htmlFor="name">Full Name</Typography>
                <TextField
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isNewUser}
                  fullWidth
                />
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <Typography variant="body2" component="label" htmlFor="password">Password</Typography>
              <TextField
                id="password"
                type="password"
                placeholder={isNewUser ? 'Create a password' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Test Auth Flow'}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert severity="error">
                <Typography variant="body2">{error}</Typography>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
                          <Typography variant="h6">Debug Information</Typography>
            <Typography variant="body2" color="text.secondary">Step-by-step execution log</Typography>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <div className="text-muted-foreground">No debug info yet. Start by entering an email.</div>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    {info}
                  </div>
                ))
              )}
            </div>
            {debugInfo.length > 0 && (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setDebugInfo([])}
                sx={{ mt: 2 }}
              >
                Clear Log
              </Button>
            )}
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