'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gift, CheckCircle, XCircle } from 'lucide-react';
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-600" />
          Have a Promo Code?
        </CardTitle>
        <CardDescription>
          Enter your promo code to unlock special offers and trials
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !promoCode.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </div>

          {isValid === true && trialInfo && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Trial Activated!
                </p>
                <p className="text-xs text-green-600">
                  {trialInfo.message} • Code: {trialInfo.promoCode}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {trialInfo.trialEndDate && 
                  `Expires ${new Date(trialInfo.trialEndDate).toLocaleDateString()}`
                }
              </Badge>
            </div>
          )}

          {isValid === false && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-800">
                Invalid promo code. Please check and try again.
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
} 