'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Crown, AlertTriangle } from 'lucide-react';

interface TrialStatusProps {
  trialStartDate: Date;
  trialEndDate: Date;
  className?: string;
}

export function TrialStatus({ trialStartDate, trialEndDate, className }: TrialStatusProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(trialEndDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });

        // Calculate progress percentage
        const totalDuration = new Date(trialEndDate).getTime() - new Date(trialStartDate).getTime();
        const elapsed = now - new Date(trialStartDate).getTime();
        const progressPercent = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(progressPercent);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setProgress(100);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [trialStartDate, trialEndDate]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
  const isExpiringSoon = timeLeft.days <= 2 && timeLeft.days >= 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          Pro Trial Status
        </CardTitle>
        <CardDescription>
          Your trial period details and remaining time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Trial Progress</span>
          <Badge variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}>
            {isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
          </Badge>
        </div>

        <Progress value={progress} className="h-2" />

        {!isExpired ? (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-lg font-bold text-gray-900">{timeLeft.days}</div>
              <div className="text-xs text-gray-500">Days</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-lg font-bold text-gray-900">{timeLeft.hours}</div>
              <div className="text-xs text-gray-500">Hours</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-lg font-bold text-gray-900">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-500">Minutes</div>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <div className="text-lg font-bold text-gray-900">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-500">Seconds</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Trial Expired</p>
              <p className="text-xs text-red-600">
                Upgrade to Pro to continue using all features
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <div>Started: {new Date(trialStartDate).toLocaleDateString()}</div>
          <div>Ends: {new Date(trialEndDate).toLocaleDateString()}</div>
        </div>

        {isExpiringSoon && !isExpired && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <Clock className="h-4 w-4 text-yellow-600" />
            <p className="text-sm text-yellow-800">
              Your trial expires soon! Upgrade to Pro to keep all features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 