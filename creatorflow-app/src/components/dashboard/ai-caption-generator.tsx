import React, { useState } from 'react';
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
import { MessageSquare, Activity } from 'lucide-react';
import { CaptionSuggestion } from '@/lib/ai-service';

interface AICaptionGeneratorProps {
  onCaptionSelect?: (caption: string) => void;
  className?: string;
}

export function AICaptionGenerator({ onCaptionSelect, className }: AICaptionGeneratorProps) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('casual');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<CaptionSuggestion[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'TikTok', label: 'TikTok' }
  ];

  const tones = [
    { value: 'casual', label: 'Casual' },
    { value: 'professional', label: 'Professional' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const generateCaptions = async () => {
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform,
          tone,
          industry,
          targetAudience
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCaptions(data.data);
      } else {
        console.error('Failed to generate captions:', data.error);
      }
    } catch (error) {
      console.error('Error generating captions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const useCaption = (caption: string) => {
    onCaptionSelect?.(caption);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'purple.600' }}>
            <Activity className="h-5 w-5" />
          </Box>
          AI Caption Generator
        </Typography>
      </CardHeader>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Input Fields */}
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Content Description"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your content, what you want to share, or the message you want to convey..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Platform"
                select
                fullWidth
                variant="outlined"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as string)}
              >
                {platforms.map((p) => (
                  <Chip key={p.value} label={p.label} value={p.value} />
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tone"
                select
                fullWidth
                variant="outlined"
                value={tone}
                onChange={(e) => setTone(e.target.value as string)}
              >
                {tones.map((t) => (
                  <Chip key={t.value} label={t.label} value={t.value} />
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Industry (Optional)"
                select
                fullWidth
                variant="outlined"
                value={industry}
                onChange={(e) => setIndustry(e.target.value as string)}
                placeholder="Select industry"
              >
                {industries.map((i) => (
                  <Chip key={i.value} label={i.label} value={i.value} />
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Target Audience (Optional)"
                multiline
                rows={2}
                fullWidth
                variant="outlined"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Young professionals, fitness enthusiasts..."
              />
            </Grid>
          </Grid>
        </Box>

        {/* Generate Button */}
        <Button
          variant="contained"
          onClick={generateCaptions}
          disabled={!content.trim() || isGenerating}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isGenerating ? (
            <>
              {/* LoadingSpinner component was removed, so using a placeholder or removing it */}
              Generating Captions...
            </>
          ) : (
            <>
              <Activity className="h-4 w-4 mr-2" />
              Generate Captions
            </>
          )}
        </Button>

        {/* Generated Captions */}
        {captions.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" component="div" className="text-muted-foreground">
              Generated Captions ({captions.length})
            </Typography>
            {captions.map((caption, index) => (
              <Box
                key={index}
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  },
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="body2">{caption.caption}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={caption.tone} variant="outlined" size="small" />
                      <Chip label={caption.platform} variant="outlined" size="small" />
                      {caption.engagement_score && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Activity className="h-3 w-3" />
                          <Typography variant="body2">{caption.engagement_score}% engagement</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => copyToClipboard(caption.caption, index)}
                        sx={{ p: 0.5 }}
                      >
                        {copiedIndex === index ? (
                          <Activity className="h-4 w-4 text-green-600" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => useCaption(caption.caption)}
                        sx={{ p: 0.5 }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              onClick={generateCaptions}
              disabled={isGenerating}
              fullWidth
              sx={{ mt: 1 }}
            >
              <Activity className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate More
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 