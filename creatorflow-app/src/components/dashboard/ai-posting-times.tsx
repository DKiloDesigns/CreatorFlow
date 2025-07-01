import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Clock, 
  Calendar,
  TrendingUp,
  Target,
  Zap,
  Info
} from 'lucide-react';
import { PostingTimeSuggestion } from '@/lib/ai-service';

interface AIPostingTimesProps {
  className?: string;
}

export function AIPostingTimes({ className }: AIPostingTimesProps) {
  const [platform, setPlatform] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [postingTimes, setPostingTimes] = useState<PostingTimeSuggestion[]>([]);

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'TikTok', label: 'TikTok' }
  ];

  const getOptimalTimes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/posting-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: platform === 'all' ? undefined : platform
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPostingTimes(data.data);
      } else {
        console.error('Failed to get posting times:', data.error);
      }
    } catch (error) {
      console.error('Error getting posting times:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeIcon = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return '🌅'; // Morning
    if (hour >= 12 && hour < 17) return '☀️'; // Afternoon
    if (hour >= 17 && hour < 21) return '🌆'; // Evening
    return '🌙'; // Night
  };

  const getEngagementLevel = (times: string[]) => {
    // Simple algorithm to determine engagement level based on number of optimal times
    if (times.length >= 4) return { level: 'High', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' };
    if (times.length >= 2) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' };
    return { level: 'Low', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' };
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          AI Optimal Posting Times
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={getOptimalTimes}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Analyzing Posting Times...
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              Get Optimal Times
            </>
          )}
        </Button>

        {/* Generated Posting Times */}
        {postingTimes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">
              Optimal Posting Times
            </h3>
            
            {postingTimes.map((suggestion, index) => {
              const engagement = getEngagementLevel(suggestion.best_times);
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{suggestion.platform}</h4>
                      <Badge className={`text-xs ${engagement.color}`}>
                        {engagement.level} Engagement
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {suggestion.timezone}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Best Times to Post
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {suggestion.best_times.map((time, timeIndex) => (
                          <div
                            key={timeIndex}
                            className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                          >
                            <span className="text-lg">{getTimeIcon(time)}</span>
                            <span className="font-medium text-sm">{time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-900/60 rounded-lg">
                      <h5 className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        AI Reasoning
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips Section */}
        <div className="p-4 bg-green-50 dark:bg-green-900/60 rounded-lg">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Posting Time Best Practices
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <h5 className="font-medium mb-2">General Tips:</h5>
              <ul className="space-y-1">
                <li>• Post when your audience is most active</li>
                <li>• Test different times and track engagement</li>
                <li>• Consider your timezone vs audience timezone</li>
                <li>• Be consistent with your posting schedule</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-2">Platform-Specific:</h5>
              <ul className="space-y-1">
                <li>• Instagram: Evenings and weekends</li>
                <li>• LinkedIn: Weekdays during business hours</li>
                <li>• Twitter: Throughout the day, peak at lunch</li>
                <li>• TikTok: Evenings and late nights</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setPlatform('Instagram');
              getOptimalTimes();
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            Instagram Times
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setPlatform('LinkedIn');
              getOptimalTimes();
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            LinkedIn Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 