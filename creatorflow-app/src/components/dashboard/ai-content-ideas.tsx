import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Box,
  Typography,
  Grid
} from '@mui/material';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { 
  Lightbulb, 
  Copy, 
  Check, 
  RefreshCw,
  Calendar,
  Image,
  Video,
  Layers,
  BookOpen
} from 'lucide-react';
import { ContentIdea } from '@/lib/ai-service';

interface AIContentIdeasProps {
  onIdeaSelect?: (idea: ContentIdea) => void;
  className?: string;
}

export function AIContentIdeas({ onIdeaSelect, className }: AIContentIdeasProps) {
  const [platform, setPlatform] = useState('Instagram');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
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

  const audiences = [
    { value: 'young_professionals', label: 'Young Professionals' },
    { value: 'entrepreneurs', label: 'Entrepreneurs' },
    { value: 'students', label: 'Students' },
    { value: 'fitness_enthusiasts', label: 'Fitness Enthusiasts' },
    { value: 'food_lovers', label: 'Food Lovers' },
    { value: 'travelers', label: 'Travelers' },
    { value: 'creatives', label: 'Creatives' },
    { value: 'parents', label: 'Parents' }
  ];

  const generateIdeas = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          industry,
          targetAudience
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIdeas(data.data);
      } else {
        console.error('Failed to generate ideas:', data.error);
      }
    } catch (error) {
      console.error('Error generating ideas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseIdea = (idea: ContentIdea) => {
    if (onIdeaSelect) {
      onIdeaSelect(idea);
    }
    // You can add additional logic here like opening a modal or navigating to a form
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

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image style={{ width: 16, height: 16 }} aria-label="Image content type" />;
      case 'video':
        return <Video style={{ width: 16, height: 16 }} aria-label="Video content type" />;
      case 'carousel':
        return <Layers style={{ width: 16, height: 16 }} aria-label="Carousel content type" />;
      case 'story':
        return <BookOpen style={{ width: 16, height: 16 }} aria-label="Story content type" />;
      default:
        return <Image style={{ width: 16, height: 16 }} aria-label="Default content type" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: 'warning.600' }}>
            <Lightbulb className="h-5 w-5" />
          </Box>
          AI Content Ideas
        </Typography>
      </CardHeader>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Input Fields */}
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid xs={12} md={4}>
              <Typography variant="body2" component="label" sx={{ display: 'block', mb: 0.5 }}>Platform</Typography>
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
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="body2" component="label" sx={{ display: 'block', mb: 0.5 }}>Industry</Typography>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Grid>

            <Grid xs={12} md={4}>
              <Typography variant="body2" component="label" sx={{ display: 'block', mb: 0.5 }}>Target Audience</Typography>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            onClick={generateIdeas}
            disabled={isGenerating}
            sx={{ mt: 2, width: '100%' }}
          >
            <Box sx={{ mr: 1 }}>
              <RefreshCw style={{ 
                width: 16, 
                height: 16,
                animation: isGenerating ? 'spin 1s linear infinite' : 'none'
              }} />
            </Box>
            {isGenerating ? 'Generating Ideas...' : 'Generate Content Ideas'}
          </Button>
        </Box>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="h6" component="h3">Generated Ideas</Typography>
            
            {ideas.map((idea, index) => (
              <Box
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    borderColor: 'divider',
                  },
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} md={8} component="div">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="subtitle2" component="h4">{idea.title}</Typography>
                      <Badge variant="outline" sx={{ fontSize: '0.75rem' }}>
                        {getContentTypeIcon(idea.content_type)}
                        <Box sx={{ ml: 0.5, textTransform: 'capitalize' }}>{idea.content_type}</Box>
                      </Badge>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.muted' }}>{idea.description}</Typography>
                    
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Platforms:</Typography>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {idea.platforms.map((platform, pIndex) => (
                            <Badge key={pIndex} variant="secondary" sx={{ fontSize: '0.75rem' }}>
                              {platform}
                            </Badge>
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>Suggested Hashtags:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {idea.hashtags.slice(0, 3).map((hashtag, hIndex) => (
                            <Badge key={hIndex} variant="outline" sx={{ fontSize: '0.75rem' }}>
                              {hashtag}
                            </Badge>
                          ))}
                          {idea.hashtags.length > 3 && (
                            <Typography variant="body2" sx={{ color: 'text.muted' }}>
                              +{idea.hashtags.length - 3} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} component="div">
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => copyToClipboard(`${idea.title}: ${idea.description}`, index)}
                      sx={{ p: 0, minWidth: 40 }}
                    >
                      {copiedIndex === index ? (
                        <Box sx={{ color: 'success.600' }}><Check className="h-4 w-4" /></Box>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleUseIdea(idea)}
                      sx={{ p: 0, minWidth: 40 }}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              onClick={generateIdeas}
              disabled={isGenerating}
              sx={{ width: '100%' }}
            >
              <Box sx={{ mr: 1 }}><RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} /></Box>
              Generate More Ideas
            </Button>
          </Box>
        )}

        {/* Quick Tips */}
        <Box sx={{ p: 2, backgroundColor: 'yellow.50', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" component="h6" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Box sx={{ color: 'warning.600' }}><Lightbulb className="h-4 w-4" /></Box>
            Content Creation Tips
          </Typography>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.25rem' }}>• Mix educational, entertaining, and promotional content</li>
            <li style={{ marginBottom: '0.25rem' }}>• Use high-quality visuals and engaging captions</li>
            <li style={{ marginBottom: '0.25rem' }}>• Post consistently and at optimal times</li>
            <li style={{ marginBottom: '0.25rem' }}>• Engage with your audience through comments and stories</li>
          </ul>
        </Box>
      </CardContent>
    </Card>
  );
} 