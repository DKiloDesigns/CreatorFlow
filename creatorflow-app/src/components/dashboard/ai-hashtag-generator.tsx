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
import { Hash, Activity } from 'lucide-react';
import { 
  Copy, 
  Check, 
  RefreshCw,
  TrendingUp,
  Target,
  Zap
} from 'lucide-react';
import { HashtagSuggestion } from '@/lib/ai-service';

interface AIHashtagGeneratorProps {
  onHashtagsSelect?: (hashtags: string[]) => void;
  className?: string;
}

export function AIHashtagGenerator({ onHashtagsSelect, className }: AIHashtagGeneratorProps) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagSuggestion[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { value: 'Instagram', label: 'Instagram' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Twitter', label: 'Twitter' },
    { value: 'Facebook', label: 'Facebook' },
    { value: 'TikTok', label: 'TikTok' }
  ];

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'beauty', label: 'Beauty' },
    { value: 'lifestyle', label: 'Lifestyle' }
  ];

  const generateHashtags = async () => {
    if (!content.trim() && !industry) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform,
          industry
        }),
      });

      const data = await response.json();
      if (data.success) {
        setHashtags(data.data);
        setSelectedHashtags([]);
      } else {
        console.error('Failed to generate hashtags:', data.error);
      }
    } catch (error) {
      console.error('Error generating hashtags:', error);
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

  const toggleHashtagSelection = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const useSelectedHashtags = () => {
    if (selectedHashtags.length > 0) {
      onHashtagsSelect?.(selectedHashtags);
    }
  };

  const copyAllSelected = () => {
    if (selectedHashtags.length > 0) {
      copyToClipboard(selectedHashtags.join(' '), -1);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="div" className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-blue-600" />
          AI Hashtag Generator
        </Typography>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <Box sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Content Description"
                multiline
                rows={4}
                placeholder="Describe your content to get relevant hashtags..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Platform"
                select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as string)}
                fullWidth
              >
                {platforms.map((p) => (
                  <Chip key={p.value} label={p.label} value={p.value} />
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Industry"
                select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as string)}
                fullWidth
              >
                {industries.map((i) => (
                  <Chip key={i.value} label={i.label} value={i.value} />
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* Generate Button */}
        <Button
          onClick={generateHashtags}
          disabled={(!content.trim() && !industry) || isGenerating}
          fullWidth
        >
          {isGenerating ? (
            <>
              <Activity className="h-4 w-4 mr-2" />
              Generating Hashtags...
            </>
          ) : (
            <>
              <Hash className="h-4 w-4 mr-2" />
              Generate Hashtags
            </>
          )}
        </Button>

        {/* Generated Hashtags */}
        {hashtags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" component="div" className="flex items-center justify-between">
              <Typography variant="subtitle1" component="span">
                Generated Hashtags ({hashtags.length})
              </Typography>
              {selectedHashtags.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" component="span" color="text.secondary">
                    {selectedHashtags.length} selected
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={copyAllSelected}
                    startIcon={<Copy className="h-3 w-3" />}
                  >
                    Copy All
                  </Button>
                  <Button
                    size="small"
                    onClick={useSelectedHashtags}
                    startIcon={<Zap className="h-3 w-3" />}
                  >
                    Use Selected
                  </Button>
                </Box>
              )}
            </Typography>

            <Grid container spacing={1} sx={{ mt: 1 }}>
              {hashtags.map((hashtag, index) => (
                <Grid item xs={12} key={index}>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" component="span">{hashtag.hashtag}</Typography>
                        {hashtag.trending && (
                          <Chip
                            label="Trending"
                            size="small"
                            icon={<TrendingUp className="h-3 w-3" />}
                            variant="outlined"
                            color="error"
                          />
                        )}
                      </Box>
                    }
                    variant={selectedHashtags.includes(hashtag.hashtag) ? 'filled' : 'outlined'}
                    onClick={() => toggleHashtagSelection(hashtag.hashtag)}
                    onDelete={() => toggleHashtagSelection(hashtag.hashtag)}
                    deleteIcon={
                      copiedIndex === index ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )
                    }
                  />
                </Grid>
              ))}
            </Grid>
            
            <Button
              variant="outlined"
              onClick={generateHashtags}
              disabled={isGenerating}
              fullWidth
              startIcon={<RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />}
            >
              Generate More
            </Button>
          </Box>
        )}

        {/* Selected Hashtags Preview */}
        {selectedHashtags.length > 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle2" component="h4" gutterBottom>
              Selected Hashtags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedHashtags.map((hashtag, index) => (
                <Chip
                  key={index}
                  label={hashtag}
                  variant="outlined"
                  onClick={() => toggleHashtagSelection(hashtag)}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
} 