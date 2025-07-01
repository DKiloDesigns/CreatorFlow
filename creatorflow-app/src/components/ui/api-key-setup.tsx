'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  ExternalLink, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          OpenAI API Key Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step 1: Get API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 1</Badge>
            <h3 className="font-medium">Get Your OpenAI API Key</h3>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/60 rounded-lg">
            <div className="flex items-start gap-3">
              <Key className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">Don't have an API key?</p>
                <ol className="text-sm text-muted-foreground space-y-1">
                  <li>1. Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">OpenAI Platform <ExternalLink className="h-3 w-3" /></a></li>
                  <li>2. Sign in or create an account</li>
                  <li>3. Click "Create new secret key"</li>
                  <li>4. Copy the generated key (starts with "sk-")</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Enter API Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 2</Badge>
            <h3 className="font-medium">Enter Your API Key</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleKeyChange(e.target.value)}
                className={`pr-20 ${isValid ? 'border-green-500' : error ? 'border-red-500' : ''}`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="h-6 w-6 p-0"
                >
                  {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                {apiKey && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(apiKey)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Validation Status */}
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LoadingSpinner size="sm" />
                Validating API key...
              </div>
            )}
            
            {isValid && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                API key is valid!
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Save Key */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step 3</Badge>
            <h3 className="font-medium">Save & Activate</h3>
          </div>
          
          <Button
            onClick={handleSaveKey}
            disabled={!isValid || isValidating}
            className="w-full"
          >
            {isValidating ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Validating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Activate AI Features
              </>
            )}
          </Button>
        </div>

        {/* Security Notice */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
              How is my API key secured?
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>API Key Security</AlertDialogTitle>
              <AlertDialogDescription>
                Your OpenAI API key is stored securely and used only for AI feature requests. We:
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Never store your key in plain text</li>
                  <li>• Only use it for legitimate AI requests</li>
                  <li>• Don't share it with third parties</li>
                  <li>• Allow you to revoke access anytime</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Got it</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pricing Info */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/60 rounded-lg">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Usage Costs</p>
              <p className="text-muted-foreground">
                OpenAI charges per API call. Typical costs are $0.002-0.02 per request. 
                <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  View pricing <ExternalLink className="h-3 w-3 inline" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 