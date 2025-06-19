import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  X, 
  ArrowRight,
  Zap
} from 'lucide-react';

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
    <Card className={`bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">Unlock AI-Powered Features</h3>
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  New
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Get instant captions, hashtag suggestions, content ideas, and optimal posting times with our AI tools.
              </p>
              <div className="flex items-center gap-4">
                <Button onClick={handleSetup} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Set Up AI Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDismiss}>
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 