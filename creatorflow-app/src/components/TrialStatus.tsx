'use client';

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Box,
  Typography,
  Grid,
  Chip,
  LinearProgress
} from '@mui/material';
import { Clock, Activity } from 'lucide-react';

interface TrialStatusProps {
  trialStartDate: Date;
  trialEndDate: Date;
  className?: string;
}

export function TrialStatus({ trialStartDate, trialEndDate, className }: TrialStatusProps) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'warning.600' }}>
            <Activity className="h-5 w-5" />
          </Box>
          <Typography variant="h6">Pro Trial Status</Typography>
        </Box>
        <Typography variant="body2">
          Your trial period details and remaining time
        </Typography>
      </CardHeader>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Trial Progress</Typography>
            <Chip
              label={isExpired ? "Expired" : isExpiringSoon ? "Expiring Soon" : "Active"}
              variant={isExpired ? "filled" : isExpiringSoon ? "outlined" : "default"}
              color={isExpired ? "error" : isExpiringSoon ? "warning" : "default"}
            />
          </Grid>

          <Grid item xs={12}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8 }} />
          </Grid>

          {!isExpired ? (
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={3}>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" color="text.primary">{timeLeft.days}</Typography>
                  <Typography variant="body2" color="text.secondary">Days</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" color="text.primary">{timeLeft.hours}</Typography>
                  <Typography variant="body2" color="text.secondary">Hours</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" color="text.primary">{timeLeft.minutes}</Typography>
                  <Typography variant="body2" color="text.secondary">Minutes</Typography>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                  <Typography variant="h6" color="text.primary">{timeLeft.seconds}</Typography>
                  <Typography variant="body2" color="text.secondary">Seconds</Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Box sx={{ color: 'error.main' }}>
                <Activity className="h-5 w-5" />
              </Box>
              <Box>
                <Typography variant="body2" color="error.dark" sx={{ fontWeight: 500 }}>Trial Expired</Typography>
                <Typography variant="body2" color="error.main">
                  Upgrade to Pro to continue using all features
                </Typography>
              </Box>
            </Box>
          )}

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <Box>Started: {new Date(trialStartDate).toLocaleDateString()}</Box>
              <Box>Ends: {new Date(trialEndDate).toLocaleDateString()}</Box>
            </Typography>
          </Grid>

          {isExpiringSoon && !isExpired && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Clock className="h-4 w-4" sx={{ color: 'warning.600' }} />
                <Typography variant="body2" color="warning.dark">
                  Your trial expires soon! Upgrade to Pro to keep all features.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
} 