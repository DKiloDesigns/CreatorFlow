import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Typography, Button, Chip, Grid } from '@mui/material';
import { 
  Clock, 
  TrendingUp, 
  Target,
  Info,
  Zap
} from 'lucide-react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { PostingTimeSuggestion } from '@/lib/ai-service';
import { Box } from '@mui/material';

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
        <Typography variant="h6" className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          AI Posting Times
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <FormControl>
              <InputLabel>Platform</InputLabel>
              <Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {platforms.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={getOptimalTimes}
          disabled={isLoading}
          sx={{ width: '100%' }}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Analyzing Posting Times...
            </>
          ) : (
            <>
              <Clock style={{ width: 16, height: 16, marginRight: 8 }} />
              Get Optimal Times
            </>
          )}
        </Button>

        {/* Generated Posting Times */}
        {postingTimes.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'text.secondary' }}>
              Optimal Posting Times
            </Typography>
            
            {postingTimes.map((suggestion, index) => {
              const engagement = getEngagementLevel(suggestion.best_times);
              return (
                <Box
                  key={index}
                  sx={{ 
                    p: 2, 
                    border: '1px solid', 
                    borderColor: 'divider', 
                    borderRadius: 2,
                    '&:hover': { borderColor: 'grey.300' },
                    transition: 'border-color 0.2s'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>{suggestion.platform}</Typography>
                      <Chip 
                        label={`${engagement.level} Engagement`} 
                        color={engagement.color as any}
                      />
                    </Box>
                    <Chip variant="filled" label={suggestion.timezone} />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Target className="h-4 w-4" />
                        Best Times to Post
                      </Typography>
                      <Grid container spacing={1}>
                        {suggestion.best_times.map((time, timeIndex) => (
                          <Grid item xs={6} md={4} key={timeIndex} component="div">
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              p: 1, 
                              bgcolor: 'action.hover', 
                              borderRadius: 2 
                            }}>
                              <Box sx={{ fontSize: '1.125rem' }}>{getTimeIcon(time)}</Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{time}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: 'info.50', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Info className="h-4 w-4" />
                        AI Reasoning
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {suggestion.reasoning}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Tips Section */}
        <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: 'success.600' }}><TrendingUp className="h-4 w-4" /></Box>
            Posting Time Best Practices
          </Typography>
          <Grid container spacing={2} sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            <Grid item xs={12} md={6} component="div">
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>General Tips:</Typography>
              <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box component="li">• Post when your audience is most active</Box>
                <Box component="li">• Test different times and track engagement</Box>
                <Box component="li">• Consider your timezone vs audience timezone</Box>
                <Box component="li">• Be consistent with your posting schedule</Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} component="div">
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>Platform-Specific:</Typography>
              <Box component="ul" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box component="li">• Instagram: Evenings and weekends</Box>
                <Box component="li">• LinkedIn: Weekdays during business hours</Box>
                <Box component="li">• Twitter: Throughout the day, peak at lunch</Box>
                <Box component="li">• TikTok: Evenings and late nights</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
            onClick={() => {
              setPlatform('Instagram');
              getOptimalTimes();
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            Instagram Times
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ flex: 1 }}
            onClick={() => {
              setPlatform('LinkedIn');
              getOptimalTimes();
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            LinkedIn Times
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
} 