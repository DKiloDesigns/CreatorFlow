'use client';
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { VpnKey as KeyIcon, TrendingUp as ActivityIcon } from '@mui/icons-material';
import { LoadingSpinner } from './loading-spinner';


interface APIKeySetupProps {
  onKeyAdded?: (key: string) => void;
  className?: string;
}

export function APIKeySetup({ onKeyAdded, className }: APIKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const validateAPIKey = async (key: string) => {
    if (!key.trim()) return false;
    
    setIsValidating(true);
    setError('');
    
    try {
      // Test the API key by making a simple request
      const response = await fetch('/api/ai/test-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: key }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsValid(true);
        return true;
      } else {
        setError(data.error || 'Invalid API key');
        setIsValid(false);
        return false;
      }
    } catch (error) {
      setError('Failed to validate API key. Please check your connection.');
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyChange = async (value: string) => {
    setApiKey(value);
    setIsValid(false);
    setError('');
    
    // Validate key when it looks like a complete OpenAI key
    if (value.length >= 40 && value.startsWith('sk-')) {
      await validateAPIKey(value);
    }
  };

  const handleSaveKey = async () => {
    if (!isValid) return;
    
    try {
      const response = await fetch('/api/ai/save-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      
      if (data.success) {
        onKeyAdded?.(apiKey);
        // Show success message
      } else {
        setError(data.error || 'Failed to save API key');
      }
    } catch (error) {
      setError('Failed to save API key');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <Card sx={className ? { className } : undefined}>
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ActivityIcon sx={{ width: 20, height: 20, color: 'inherit' }} />
          <Typography variant="h5" component="div">
            OpenAI API Key Setup
          </Typography>
        </Box>
      </CardHeader>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Step 1: Get API Key */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Step 1" variant="outlined" />
            <Typography variant="h6" component="div">Get Your OpenAI API Key</Typography>
          </Box>
          
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <KeyIcon sx={{ width: 20, height: 20, color: 'inherit' }} />
            </Grid>
            <Grid item xs>
              <Typography variant="body2">Don&apos;t have an API key?</Typography>
              <Box component="ol" sx={{ fontSize: '0.875rem', color: 'text.secondary', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>
                  1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'underline' }}>OpenAI Platform <span style={{ fontSize: '0.75rem' }}>↗</span></a>
                </Typography>
                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>2. Sign in or create an account</Typography>
                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>3. Click &quot;Create new secret key&quot;</Typography>
                <Typography component="li" variant="body2" sx={{ color: 'text.secondary' }}>4. Copy the generated key (starts with &quot;sk-&quot;)</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Step 2: Enter API Key */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Step 2" variant="outlined" />
            <Typography variant="h6" component="div">Enter Your API Key</Typography>
          </Box>
          
          <TextField
            label="OpenAI API Key"
            type={showKey ? 'text' : 'password'}
            placeholder="sk-..."
            value={apiKey}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeyChange(e.target.value)}
            fullWidth
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <Grid container alignItems="center" spacing={1}>
                  <Grid item>
                    <Button
                      variant="text"
                      onClick={() => setShowKey(!showKey)}
                      size="small"
                    >
                      {showKey ? <span style={{ fontSize: '0.75rem' }}>🙈</span> : <span style={{ fontSize: '0.75rem' }}>👁️</span>}
                    </Button>
                  </Grid>
                  <Grid item>
                    {apiKey && (
                      <Button
                        variant="text"
                        onClick={() => copyToClipboard(apiKey)}
                        size="small"
                      >
                        <span style={{ fontSize: '0.75rem' }}>📋</span>
                      </Button>
                    )}
                  </Grid>
                </Grid>
              ),
            }}
          />
          
          {/* Validation Status */}
          {isValidating && (
            <Grid container alignItems="center" spacing={1} sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              <Grid item>
                <LoadingSpinner size="sm" />
              </Grid>
              <Grid item>
                Validating API key...
              </Grid>
            </Grid>
          )}
          
          {isValid && (
            <Grid container alignItems="center" spacing={1} sx={{ mt: 1, color: 'success.main', fontSize: '0.875rem' }}>
              <Grid item>
                <span style={{ fontSize: '1rem' }}>✓</span>
              </Grid>
              <Grid item>
                API key is valid!
              </Grid>
            </Grid>
          )}
          
          {error && (
            <Grid container alignItems="center" spacing={1} sx={{ mt: 1, color: 'error.main', fontSize: '0.875rem' }}>
              <Grid item>
                <span style={{ fontSize: '1rem' }}>⚠️</span>
              </Grid>
              <Grid item>
                {error}
              </Grid>
            </Grid>
          )}
        </Box>

        {/* Step 3: Save Key */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="Step 3" variant="outlined" />
            <Typography variant="h6" component="div">Save & Activate</Typography>
          </Box>
          
          <Button
            onClick={handleSaveKey}
            disabled={!isValid || isValidating}
            fullWidth
            variant="contained"
            startIcon={isValidating ? <LoadingSpinner size="sm" /> : <ActivityIcon sx={{ fontSize: 16 }} />}
          >
            {isValidating ? (
              <>
                <LoadingSpinner size="sm" className="mr-1" />
                Validating...
              </>
            ) : (
              <>
                <ActivityIcon sx={{ fontSize: 16, mr: 1 }} />
                Activate AI Features
              </>
            )}
          </Button>
        </Box>

        {/* Security Notice */}
        {/* The AlertDialog component was removed, so this section is removed. */}

        {/* Pricing Info */}
        <Grid container alignItems="center" spacing={1} sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
          <Grid item>
            <span style={{ fontSize: '1rem', color: 'warning.main' }}>⚡</span>
          </Grid>
          <Grid item xs>
            <Typography variant="body2">
              <Typography variant="subtitle2" component="span" fontWeight="medium">Usage Costs</Typography>
              <br />
              OpenAI charges per API call. Typical costs are $0.002-0.02 per request. 
              <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" style={{ color: 'primary.main', textDecoration: 'underline', marginLeft: 4 }}>
                View pricing <span style={{ fontSize: '0.75rem', display: 'inline' }}>↗</span>
              </a>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 