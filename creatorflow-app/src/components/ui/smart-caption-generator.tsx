'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Typography, Button, Slider } from '@mui/material';
import { 
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  AutoFixHigh as AutoFixHighIcon,
  ContentCopy as ContentCopyIcon,
  Tag as TagIcon,
  Psychology as PsychologyIcon,
  Target as TargetIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { toast } from 'sonner';

import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { TextField } from '@mui/material';
import { Switch, FormControlLabel } from '@mui/material';
import { Chip } from '@mui/material';
import { Tabs, Tab, Box } from '@mui/material';

interface CaptionVariant {
  id: string;
  text: string;
  platform: string;
  tone: string;
  length: number;
  hashtags: string[];
  engagement_score: number;
  virality_potential: number;
  brand_alignment: number;
  readability_score: number;
  emoji_count: number;
  call_to_action: string;
  hooks: string[];
  pain_points: string[];
  benefits: string[];
  social_proof: string[];
  urgency_indicators: string[];
}

interface PlatformConfig {
  id: string;
  name: string;
  icon: string;
  maxLength: number;
  optimalLength: number;
  hashtagLimit: number;
  emojiLimit: number;
  features: string[];
  tone: string;
  audience: string;
  bestPractices: string[];
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    maxLength: 2200,
    optimalLength: 125,
    hashtagLimit: 30,
    emojiLimit: 5,
    features: ['Stories', 'Reels', 'Carousel', 'IGTV'],
    tone: 'Visual, Authentic, Aspirational',
    audience: 'Visual learners, Lifestyle enthusiasts',
    bestPractices: ['Use line breaks', 'Include relevant hashtags', 'Ask questions', 'Use emojis strategically']
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    maxLength: 3000,
    optimalLength: 150,
    hashtagLimit: 5,
    emojiLimit: 2,
    features: ['Professional', 'Thought Leadership', 'Networking'],
    tone: 'Professional, Educational, Insightful',
    audience: 'Professionals, B2B, Industry leaders',
    bestPractices: ['Share insights', 'Use data', 'Professional tone', 'Minimal emojis']
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: '🐦',
    maxLength: 280,
    optimalLength: 200,
    hashtagLimit: 3,
    emojiLimit: 3,
    features: ['Threads', 'Spaces', 'Fleets'],
    tone: 'Conversational, Timely, Engaging',
    audience: 'News followers, Real-time users',
    bestPractices: ['Be concise', 'Use trending hashtags', 'Engage with mentions', 'Timely content']
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    maxLength: 150,
    optimalLength: 50,
    hashtagLimit: 5,
    emojiLimit: 3,
    features: ['Short-form Video', 'Trending Sounds', 'Duets'],
    tone: 'Fun, Trendy, Authentic',
    audience: 'Gen Z, Millennials, Creative content',
    bestPractices: ['Use trending hashtags', 'Keep it short', 'Be authentic', 'Include music references']
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    maxLength: 63206,
    optimalLength: 200,
    hashtagLimit: 10,
    emojiLimit: 4,
    features: ['Groups', 'Live', 'Marketplace'],
    tone: 'Community-focused, Personal, Engaging',
    audience: 'All ages, Community builders',
    bestPractices: ['Encourage engagement', 'Share personal stories', 'Use Facebook groups', 'Include calls-to-action']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    maxLength: 5000,
    optimalLength: 300,
    hashtagLimit: 15,
    emojiLimit: 3,
    features: ['Long-form Video', 'Shorts', 'Live Streaming'],
    tone: 'Educational, Entertaining, Detailed',
    audience: 'Video learners, Content consumers',
    bestPractices: ['Include timestamps', 'Ask for subscriptions', 'Use relevant hashtags', 'Encourage comments']
  }
];

interface BrandVoice {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
  tone_words: string[];
  avoid_words: string[];
}

const BRAND_VOICES: BrandVoice[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal, authoritative, and trustworthy',
    characteristics: ['Clear', 'Confident', 'Reliable', 'Expert'],
    examples: ['Our comprehensive analysis shows...', 'Based on industry best practices...'],
    tone_words: ['expert', 'professional', 'reliable', 'trusted', 'proven'],
    avoid_words: ['awesome', 'amazing', 'incredible', 'mind-blowing']
  },
  {
    id: 'friendly',
    name: 'Friendly',
    description: 'Warm, approachable, and conversational',
    characteristics: ['Welcoming', 'Supportive', 'Relatable', 'Helpful'],
    examples: ['Hey there! 👋', 'We\'ve got your back!', 'Let\'s make this happen together!'],
    tone_words: ['friendly', 'helpful', 'supportive', 'warm', 'welcoming'],
    avoid_words: ['formal', 'corporate', 'official', 'strict']
  },
  {
    id: 'energetic',
    name: 'Energetic',
    description: 'High-energy, exciting, and motivational',
    characteristics: ['Dynamic', 'Inspiring', 'Bold', 'Action-oriented'],
    examples: ['Ready to crush your goals? 💪', 'This is going to be EPIC!', 'Let\'s make magic happen!'],
    tone_words: ['epic', 'amazing', 'incredible', 'awesome', 'mind-blowing'],
    avoid_words: ['calm', 'quiet', 'gentle', 'soft']
  },
  {
    id: 'humorous',
    name: 'Humorous',
    description: 'Funny, witty, and entertaining',
    characteristics: ['Clever', 'Witty', 'Entertaining', 'Light-hearted'],
    examples: ['Plot twist: this actually works! 😂', 'Because adulting is hard...', 'Who else can relate? 🙋‍♀️'],
    tone_words: ['hilarious', 'funny', 'witty', 'clever', 'entertaining'],
    avoid_words: ['serious', 'formal', 'professional', 'corporate']
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'Sophisticated, premium, and exclusive',
    characteristics: ['Elegant', 'Premium', 'Exclusive', 'Refined'],
    examples: ['Experience the extraordinary...', 'Where luxury meets innovation...', 'Crafted for the discerning...'],
    tone_words: ['luxury', 'premium', 'exclusive', 'sophisticated', 'elegant'],
    avoid_words: ['cheap', 'budget', 'affordable', 'basic']
  }
];

interface SmartCaptionGeneratorProps {
  provider: string;
}

export function SmartCaptionGenerator({ provider }: SmartCaptionGeneratorProps) {
  const [content, setContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedVoice, setSelectedVoice] = useState('friendly');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [variants, setVariants] = useState<CaptionVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<CaptionVariant | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [engagementFocus, setEngagementFocus] = useState(50);
  const [viralityFocus, setViralityFocus] = useState(50);
  const [brandAlignment, setBrandAlignment] = useState(50);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeCTA, setIncludeCTA] = useState(true);
  const [useAITweaks, setUseAITweaks] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const platformConfig = PLATFORM_CONFIGS.find(p => p.id === selectedPlatform);
  const brandVoice = BRAND_VOICES.find(v => v.id === selectedVoice);

  const generateCaptions = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to generate captions from');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic delays
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedVariants: CaptionVariant[] = [
        {
          id: '1',
          text: `🎯 Ready to transform your ${industry} game? 

${content}

💡 Pro tip: The best ${industry} creators focus on one thing - delivering real value to their audience.

What's your biggest ${industry} challenge? Drop it below! 👇

#${industry} #${targetAudience} #growth #success`,
          platform: selectedPlatform,
          tone: selectedVoice,
          length: 280,
          hashtags: [`#${industry}`, `#${targetAudience}`, '#growth', '#success'],
          engagement_score: 85,
          virality_potential: 72,
          brand_alignment: 88,
          readability_score: 92,
          emoji_count: 4,
          call_to_action: 'Drop it below! 👇',
          hooks: ['Ready to transform', 'Pro tip'],
          pain_points: ['biggest challenge'],
          benefits: ['real value', 'growth', 'success'],
          social_proof: ['best creators'],
          urgency_indicators: ['Ready to transform']
        },
        {
          id: '2',
          text: `🔥 The ${industry} secret nobody talks about:

${content}

But here's what most people get wrong - they focus on the wrong metrics.

Want to know the #1 factor that separates successful ${industry} creators from the rest?

Comment "YES" if you want the full breakdown! 🚀

#${industry} #strategy #${targetAudience}`,
          platform: selectedPlatform,
          tone: selectedVoice,
          length: 320,
          hashtags: [`#${industry}`, '#strategy', `#${targetAudience}`],
          engagement_score: 92,
          virality_potential: 88,
          brand_alignment: 85,
          readability_score: 89,
          emoji_count: 3,
          call_to_action: 'Comment "YES" if you want the full breakdown! 🚀',
          hooks: ['secret nobody talks about', 'what most people get wrong'],
          pain_points: ['wrong metrics'],
          benefits: ['successful creators'],
          social_proof: ['successful creators'],
          urgency_indicators: ['#1 factor']
        },
        {
          id: '3',
          text: `💭 Ever wonder why some ${industry} content goes viral while others flop?

${content}

The difference? It's not about luck - it's about understanding your audience.

Here's what I learned after analyzing 1000+ ${industry} posts:

• Hook your audience in the first 3 seconds
• Deliver unexpected value
• Make it shareable

Which tip resonates most with you? 🤔

#${industry} #content #${targetAudience}`,
          platform: selectedPlatform,
          tone: selectedVoice,
          length: 380,
          hashtags: [`#${industry}`, '#content', `#${targetAudience}`],
          engagement_score: 78,
          virality_potential: 85,
          brand_alignment: 82,
          readability_score: 95,
          emoji_count: 2,
          call_to_action: 'Which tip resonates most with you? 🤔',
          hooks: ['Ever wonder why', 'The difference?'],
          pain_points: ['content flops'],
          benefits: ['understanding audience', 'viral content'],
          social_proof: ['1000+ posts analyzed'],
          urgency_indicators: ['first 3 seconds']
        }
      ];

      setVariants(generatedVariants);
      setSelectedVariant(generatedVariants[0]);
      toast.success('Generated 3 caption variants!');
    } catch (error) {
      toast.error('Failed to generate captions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Caption copied to clipboard!');
  };

  const regenerateVariant = async (variantId: string) => {
    // Simulate regenerating a specific variant
    toast.info('Regenerating variant...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Variant regenerated!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <StarIcon style={{ width: 16, height: 16 }} />;
    if (score >= 80) return <TrendingUpIcon style={{ width: 16, height: 16 }} />;
    if (score >= 70) return <CheckCircleIcon style={{ width: 16, height: 16 }} />;
    return <ErrorIcon style={{ width: 16, height: 16 }} />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesomeIcon style={{ width: 20, height: 20 }} />
            Smart Caption Generator
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate platform-optimized captions with AI-powered engagement analysis
          </Typography>
        </CardHeader>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Settings */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <TextField
              label="Content Description"
              placeholder="Describe your content, key message, or what you want to achieve..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Platform</InputLabel>
                <Select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} label="Platform">
                  {PLATFORM_CONFIGS.map((platform) => (
                    <MenuItem key={platform.id} value={platform.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{platform.icon}</span>
                        <span>{platform.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Brand Voice</InputLabel>
                <Select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} label="Brand Voice">
                  {BRAND_VOICES.map((voice) => (
                    <MenuItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Industry/Niche"
                placeholder="e.g., fitness, tech, fashion..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Target Audience"
                placeholder="e.g., entrepreneurs, fitness enthusiasts..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>

          {/* Advanced Settings */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ width: '100%' }}
            >
              <SettingsIcon style={{ width: 16, height: 16, marginRight: 8 }} />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, p: 2, bgcolor: 'grey.50', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Engagement Focus</Typography>
                    <Slider
                      value={engagementFocus}
                      onChange={(e, value) => setEngagementFocus(value as number)}
                      max={100}
                      step={5}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Comments & Shares</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Likes & Views</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Virality Potential</Typography>
                    <Slider
                      value={viralityFocus}
                      onChange={(e, value) => setViralityFocus(value as number)}
                      max={100}
                      step={5}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Niche Appeal</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Mass Appeal</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Brand Alignment</Typography>
                    <Slider
                      value={brandAlignment}
                      onChange={(e, value) => setBrandAlignment(value as number)}
                      max={100}
                      step={5}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Casual</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Professional</Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Call to Action</Typography>
                    <TextField
                      placeholder="e.g., Comment below, Save this post..."
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <FormControlLabel
                      control={<Switch checked={includeHashtags} onChange={(e) => setIncludeHashtags(e.target.checked)} />}
                      label="Include Hashtags"
                    />
                    <FormControlLabel
                      control={<Switch checked={includeEmojis} onChange={(e) => setIncludeEmojis(e.target.checked)} />}
                      label="Include Emojis"
                    />
                    <FormControlLabel
                      control={<Switch checked={includeCTA} onChange={(e) => setIncludeCTA(e.target.checked)} />}
                      label="Include CTA"
                    />
                    <FormControlLabel
                      control={<Switch checked={useAITweaks} onChange={(e) => setUseAITweaks(e.target.checked)} />}
                      label="AI Tweaks"
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Platform Info */}
          {platformConfig && (
                          <Box sx={{ p: 2, bgcolor: 'blue.50', borderRadius: '8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h4">{platformConfig.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{platformConfig.name} Optimization</Typography>
                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Optimal Length:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{platformConfig.optimalLength} characters</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Hashtag Limit:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{platformConfig.hashtagLimit} hashtags</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Tone:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{platformConfig.tone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Audience:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{platformConfig.tone}</Typography>
                  </Box>
                                </Box>
              </Box>
            )}

          {/* Generate Button */}
          <Button
            onClick={generateCaptions}
            disabled={isGenerating || !content.trim()}
            sx={{ width: '100%' }}
            size="large"
          >
            {isGenerating ? (
              <>
                <RefreshIcon style={{ width: 16, height: 16, marginRight: 8 }} />
                Generating Captions...
              </>
            ) : (
              <>
                <AutoFixHighIcon style={{ width: 16, height: 16, marginRight: 8 }} />
                Generate Smart Captions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {variants.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>Generated Captions</Typography>
            <Chip 
              label={`${variants.length} variants created`}
              color="secondary"
              variant="outlined"
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Caption Variants" />
              <Tab label="AI Analysis" />
              <Tab label="A/B Testing" />
            </Tabs>

            {activeTab === 0 && (
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {variants.map((variant, index) => (
                <Card
                  key={variant.id}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    ...(selectedVariant?.id === variant.id
                      ? { ring: 2, ringColor: 'blue.500', bgcolor: 'blue.50' }
                      : { '&:hover': { bgcolor: 'grey.50' } })
                  }}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <CardContent sx={{ pt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`Variant ${index + 1}`} variant="outlined" size="small" />
                        <Chip label={variant.platform} color="secondary" size="small" />
                        <Chip label={variant.tone} color="secondary" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateVariant(variant.id);
                          }}
                        >
                          <RefreshIcon style={{ width: 16, height: 16 }} />
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(variant.text);
                          }}
                        >
                          <ContentCopyIcon style={{ width: 16, height: 16 }} />
                        </Button>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{variant.text}</Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }, gap: 2, fontSize: '0.875rem' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, color: getScoreColor(variant.engagement_score) }}>
                          {getScoreIcon(variant.engagement_score)}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Engagement</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{variant.engagement_score}%</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, color: getScoreColor(variant.virality_potential) }}>
                          {getScoreIcon(variant.virality_potential)}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Virality</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{variant.virality_potential}%</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, color: getScoreColor(variant.brand_alignment) }}>
                          {getScoreIcon(variant.brand_alignment)}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Brand Fit</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{variant.brand_alignment}%</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, color: getScoreColor(variant.readability_score) }}>
                          {getScoreIcon(variant.readability_score)}
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Readability</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{variant.readability_score}%</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          <TagIcon style={{ width: 16, height: 16, margin: '0 auto' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Hashtags</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{variant.hashtags.length}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ mt: 3 }}>
              {selectedVariant && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 6 }}>
                  <Card>
                    <CardHeader>
                      <Typography variant="h6" className="flex items-center gap-2">
                        <PsychologyIcon className="w-5 h-5" />
                        Content Analysis
                      </Typography>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Hooks Used</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedVariant.hooks.map((hook, index) => (
                              <Chip key={index} label={hook} variant="outlined" size="small" />
                            ))}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Pain Points Addressed</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedVariant.pain_points.map((point, index) => (
                              <Chip key={index} label={point} variant="outlined" size="small" />
                            ))}
                          </Box>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'medium', mb: 1 }}>Benefits Highlighted</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {selectedVariant.benefits.map((benefit, index) => (
                              <Chip key={index} label={benefit} variant="outlined" size="small" />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Typography variant="h6" className="flex items-center gap-2">
                        <BarChartIcon className="w-5 h-5" />
                        Performance Metrics
                      </Typography>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Character Count</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{selectedVariant.length}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Emoji Count</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{selectedVariant.emoji_count}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Call to Action</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'green.600' }}>✓ Included</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Social Proof</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'green.600' }}>✓ Used</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">Urgency Indicators</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'green.600' }}>✓ Present</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ mt: 3 }}>
              <Card>
                <CardHeader>
                  <Typography variant="h6" className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5" />
                    A/B Testing Comparison
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compare variants to choose the best performing option
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ overflowX: 'auto' }}>
                    <Box component="table" sx={{ width: '100%', fontSize: '0.875rem' }}>
                      <thead>
                        <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Box component="th" sx={{ textAlign: 'left', py: 2 }}>Metric</Box>
                          {variants.map((_, index) => (
                            <Box key={index} component="th" sx={{ textAlign: 'center', py: 2 }}>
                              Variant {index + 1}
                            </Box>
                          ))}
                        </Box>
                      </thead>
                      <tbody>
                        <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Box component="td" sx={{ py: 2, fontWeight: 500 }}>Engagement Score</Box>
                          {variants.map((variant) => (
                            <Box key={variant.id} component="td" sx={{ textAlign: 'center', py: 2 }}>
                              <Typography sx={{ fontWeight: 600, color: getScoreColor(variant.engagement_score) }}>
                                {variant.engagement_score}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Box component="td" sx={{ py: 2, fontWeight: 500 }}>Virality Potential</Box>
                          {variants.map((variant) => (
                            <Box key={variant.id} component="td" sx={{ textAlign: 'center', py: 2 }}>
                              <Typography sx={{ fontWeight: 600, color: getScoreColor(variant.virality_potential) }}>
                                {variant.virality_potential}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box component="tr" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Box component="td" sx={{ py: 2, fontWeight: 500 }}>Brand Alignment</Box>
                          {variants.map((variant) => (
                            <Box key={variant.id} component="td" sx={{ textAlign: 'center', py: 2 }}>
                              <Typography sx={{ fontWeight: 600, color: getScoreColor(variant.brand_alignment) }}>
                                {variant.brand_alignment}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box component="tr">
                          <Box component="td" sx={{ py: 2, fontWeight: 500 }}>Readability</Box>
                          {variants.map((variant) => (
                            <Box key={variant.id} component="td" sx={{ textAlign: 'center', py: 2 }}>
                              <Typography sx={{ fontWeight: 600, color: getScoreColor(variant.readability_score) }}>
                                {variant.readability_score}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </tbody>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
} 