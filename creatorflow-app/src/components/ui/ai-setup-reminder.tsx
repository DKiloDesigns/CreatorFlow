import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/mui-card';
import { Button, Box, Typography } from '@mui/material';
import { 
  Brain, 
  Zap, 
  ArrowRight, 
  X,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AISetupReminderProps {
  onSetup?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function AISetupReminder({ onSetup, onDismiss, className }: AISetupReminderProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleSetup = () => {
    onSetup?.();
  };

  if (!isVisible) return null;

  return (
    <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }} className={className}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: '8px' }}>
              <Brain style={{ height: 24, width: 24, color: 'white' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>Unlock AI-Powered Features</Typography>
                <Badge variant="outline" sx={{ fontSize: '0.75rem' }}>
                  <Zap style={{ height: 12, width: 12, marginRight: 4 }} />
                  New
                </Badge>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Get instant captions, hashtag suggestions, content ideas, and optimal posting times with our AI tools.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button onClick={handleSetup} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sparkles style={{ height: 16, width: 16 }} />
                  Set Up AI Tools
                  <ArrowRight style={{ height: 16, width: 16 }} />
                </Button>
                <Button variant="text" size="small" onClick={handleDismiss}>
                  Maybe Later
                </Button>
              </Box>
            </Box>
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={handleDismiss}
            sx={{ height: 32, width: 32, p: 0 }}
          >
            <X style={{ height: 16, width: 16 }} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 