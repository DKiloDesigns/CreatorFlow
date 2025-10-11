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
  Grid,
  Chip
} from '@mui/material';
import {
  CardGiftcard as CardGiftcardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { toast } from 'sonner';

interface PromoCodeInputProps {
  onSuccess?: (data: any) => void;
  className?: string;
}

export function PromoCodeInput({ onSuccess, className }: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [trialInfo, setTrialInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsLoading(true);
    setIsValid(null);

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: promoCode.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsValid(true);
        setTrialInfo(data);
        toast.success(data.message);
        onSuccess?.(data);
      } else {
        setIsValid(false);
        toast.error(data.error || 'Failed to validate promo code');
      }
    } catch (error) {
      setIsValid(false);
      toast.error('Failed to validate promo code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ ...(className && { className }) }}>
      <CardHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CardGiftcardIcon sx={{ height: 20, width: 20, color: 'success.main' }} />
          <Typography variant="h6">Have a Promo Code?</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Enter your promo code to unlock special offers and trials
        </Typography>
      </CardHeader>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              sx={{ flexGrow: 1 }}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !promoCode.trim()}>
              {isLoading ? (
                <CircularProgress size={16} sx={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                'Apply'
              )}
            </Button>
          </Box>

          {isValid === true && trialInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, bgcolor: 'success.light', border: '1px solid', borderColor: 'success.main', borderRadius: 2 }}>
              <CheckCircleIcon sx={{ height: 20, width: 20, color: 'success.main' }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight="medium" color="success.dark">
                  Trial Activated!
                </Typography>
                <Typography variant="body2" color="success.main">
                  {trialInfo.message} • Code: {trialInfo.promoCode}
                </Typography>
              </Box>
              <Chip label={`Expires ${new Date(trialInfo.trialEndDate).toLocaleDateString()}`} variant="outlined" color="success" />
            </Box>
          )}

          {isValid === false && (
            <Box sx={{ p: 3, bgcolor: 'error.light', border: '1px solid', borderColor: 'error.main', borderRadius: 2 }}>
              <CancelIcon sx={{ height: 20, width: 20, color: 'error.main', mr: 1 }} />
              <Typography variant="body2" fontWeight="medium" color="error.dark">Invalid promo code</Typography>
              <Typography variant="body2" color="error.main">
                Invalid promo code. Please check and try again.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
} 