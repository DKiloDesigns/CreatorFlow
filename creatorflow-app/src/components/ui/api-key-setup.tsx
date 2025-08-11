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
import { Key, Activity } from 'lucide-react';
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
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="div" className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          OpenAI API Key Setup
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1: Get API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Chip label="Step 1" variant="outlined" />
            <Typography variant="h6" component="div">Get Your OpenAI API Key</Typography>
          </div>
          
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Key className="h-5 w-5 text-blue-600" />
            </Grid>
            <Grid item xs>
              <Typography variant="body2">Don&apos;t have an API key?</Typography>
              <ol className="text-sm text-muted-foreground space-y-1">
                <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">OpenAI Platform <span className="h-3 w-3">↗</span></a></li>
                <li>2. Sign in or create an account</li>
                <li>3. Click &quot;Create new secret key&quot;</li>
                <li>4. Copy the generated key (starts with &quot;sk-&quot;)</li>
              </ol>
            </Grid>
          </Grid>
        </div>

        {/* Step 2: Enter API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Chip label="Step 2" variant="outlined" />
            <Typography variant="h6" component="div">Enter Your API Key</Typography>
          </div>
          
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
                      {showKey ? <span className="h-3 w-3">🙈</span> : <span className="h-3 w-3">👁️</span>}
                    </Button>
                  </Grid>
                  <Grid item>
                    {apiKey && (
                      <Button
                        variant="text"
                        onClick={() => copyToClipboard(apiKey)}
                        size="small"
                      >
                        <span className="h-3 w-3">📋</span>
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
            <Grid container alignItems="center" spacing={1} sx={{ mt: 1, color: 'text.success', fontSize: '0.875rem' }}>
              <Grid item>
                <span className="h-4 w-4">✓</span>
              </Grid>
              <Grid item>
                API key is valid!
              </Grid>
            </Grid>
          )}
          
          {error && (
            <Grid container alignItems="center" spacing={1} sx={{ mt: 1, color: 'text.error', fontSize: '0.875rem' }}>
              <Grid item>
                <span className="h-4 w-4">⚠️</span>
              </Grid>
              <Grid item>
                {error}
              </Grid>
            </Grid>
          )}
        </div>

        {/* Step 3: Save Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Chip label="Step 3" variant="outlined" />
            <Typography variant="h6" component="div">Save & Activate</Typography>
          </div>
          
          <Button
            onClick={handleSaveKey}
            disabled={!isValid || isValidating}
            fullWidth
            variant="contained"
            startIcon={isValidating ? <LoadingSpinner size="sm" /> : <span className="h-4 w-4">⚡</span>}
          >
            {isValidating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Validating...
              </>
            ) : (
              <>
                <span className="h-4 w-4 mr-2">⚡</span>
                Activate AI Features
              </>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        {/* The AlertDialog component was removed, so this section is removed. */}

        {/* Pricing Info */}
        <Grid container alignItems="center" spacing={1} sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
          <Grid item>
            <span className="h-4 w-4 text-yellow-600">⚡</span>
          </Grid>
          <Grid item xs>
            <Typography variant="body2">
              <Typography variant="subtitle2" component="span" fontWeight="medium">Usage Costs</Typography>
              <br />
              OpenAI charges per API call. Typical costs are $0.002-0.02 per request. 
              <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                View pricing <span className="h-3 w-3 inline">↗</span>
              </a>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 