'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Slider } from './slider';
import { Switch } from './switch';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Target, 
  TrendingUp, 
  Users, 
  Hash, 
  MessageSquare,
  Zap,
  Eye,
  BarChart3,
  Palette,
  Clock,
  Globe,
  Star,
  Heart,
  ThumbsUp,
  Share2,
  Bookmark,
  Send,
  Settings,
  Wand2,
  Brain,
  Lightbulb,
  Sparkle,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

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
    if (score >= 90) return <Star className="w-4 h-4" />;
    if (score >= 80) return <TrendingUp className="w-4 h-4" />;
    if (score >= 70) return <CheckCircle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Smart Caption Generator
          </CardTitle>
          <CardDescription>
            Generate platform-optimized captions with AI-powered engagement analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Content Description</Label>
              <Textarea
                placeholder="Describe your content, key message, or what you want to achieve..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORM_CONFIGS.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Brand Voice</Label>
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAND_VOICES.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Industry/Niche</Label>
                <Input
                  placeholder="e.g., fitness, tech, fashion..."
                  value={industry}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIndustry(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input
                  placeholder="e.g., entrepreneurs, fitness enthusiasts..."
                  value={targetAudience}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetAudience(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Engagement Focus</Label>
                    <Slider
                      value={[engagementFocus]}
                      onValueChange={([value]) => setEngagementFocus(value)}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Comments & Shares</span>
                      <span>Likes & Views</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Virality Potential</Label>
                    <Slider
                      value={[viralityFocus]}
                      onValueChange={([value]) => setViralityFocus(value)}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Niche Appeal</span>
                      <span>Mass Appeal</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Brand Alignment</Label>
                    <Slider
                      value={[brandAlignment]}
                      onValueChange={([value]) => setBrandAlignment(value)}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Casual</span>
                      <span>Professional</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Call to Action</Label>
                    <Input
                      placeholder="e.g., Comment below, Save this post..."
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Include Hashtags</Label>
                      <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include Emojis</Label>
                      <Switch checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include CTA</Label>
                      <Switch checked={includeCTA} onCheckedChange={setIncludeCTA} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>AI Tweaks</Label>
                      <Switch checked={useAITweaks} onCheckedChange={setUseAITweaks} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Platform Info */}
          {platformConfig && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{platformConfig.icon}</span>
                <h3 className="font-semibold">{platformConfig.name} Optimization</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Optimal Length:</span>
                  <p className="text-gray-600">{platformConfig.optimalLength} characters</p>
                </div>
                <div>
                  <span className="font-medium">Hashtag Limit:</span>
                  <p className="text-gray-600">{platformConfig.hashtagLimit} hashtags</p>
                </div>
                <div>
                  <span className="font-medium">Tone:</span>
                  <p className="text-gray-600">{platformConfig.tone}</p>
                </div>
                <div>
                  <span className="font-medium">Audience:</span>
                  <p className="text-gray-600">{platformConfig.audience}</p>
                </div>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <Button
            onClick={generateCaptions}
            disabled={isGenerating || !content.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Captions...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Smart Captions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {variants.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generated Captions</h2>
            <Badge variant="secondary">
              {variants.length} variants created
            </Badge>
          </div>

          <Tabs defaultValue="variants" className="space-y-4">
            <TabsList>
              <TabsTrigger value="variants">Caption Variants</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="comparison">A/B Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="variants" className="space-y-4">
              {variants.map((variant, index) => (
                <Card
                  key={variant.id}
                  className={`cursor-pointer transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Variant {index + 1}</Badge>
                        <Badge variant="secondary">{variant.platform}</Badge>
                        <Badge variant="secondary">{variant.tone}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateVariant(variant.id);
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(variant.text);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none mb-4">
                      <p className="whitespace-pre-wrap">{variant.text}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(variant.engagement_score)}`}>
                          {getScoreIcon(variant.engagement_score)}
                        </div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-medium">{variant.engagement_score}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(variant.virality_potential)}`}>
                          {getScoreIcon(variant.virality_potential)}
                        </div>
                        <p className="text-gray-600">Virality</p>
                        <p className="font-medium">{variant.virality_potential}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(variant.brand_alignment)}`}>
                          {getScoreIcon(variant.brand_alignment)}
                        </div>
                        <p className="text-gray-600">Brand Fit</p>
                        <p className="font-medium">{variant.brand_alignment}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(variant.readability_score)}`}>
                          {getScoreIcon(variant.readability_score)}
                        </div>
                        <p className="text-gray-600">Readability</p>
                        <p className="font-medium">{variant.readability_score}%</p>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-600">
                          <Hash className="w-4 h-4 mx-auto" />
                        </div>
                        <p className="text-gray-600">Hashtags</p>
                        <p className="font-medium">{variant.hashtags.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {selectedVariant && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        Content Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Hooks Used</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedVariant.hooks.map((hook, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {hook}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Pain Points Addressed</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedVariant.pain_points.map((point, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {point}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Benefits Highlighted</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedVariant.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Character Count</span>
                          <span className="font-medium">{selectedVariant.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Emoji Count</span>
                          <span className="font-medium">{selectedVariant.emoji_count}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Call to Action</span>
                          <span className="font-medium text-green-600">✓ Included</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Social Proof</span>
                          <span className="font-medium text-green-600">✓ Used</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Urgency Indicators</span>
                          <span className="font-medium text-green-600">✓ Present</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    A/B Testing Comparison
                  </CardTitle>
                  <CardDescription>
                    Compare variants to choose the best performing option
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          {variants.map((_, index) => (
                            <th key={index} className="text-center py-2">
                              Variant {index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Engagement Score</td>
                          {variants.map((variant) => (
                            <td key={variant.id} className="text-center py-2">
                              <span className={`font-semibold ${getScoreColor(variant.engagement_score)}`}>
                                {variant.engagement_score}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Virality Potential</td>
                          {variants.map((variant) => (
                            <td key={variant.id} className="text-center py-2">
                              <span className={`font-semibold ${getScoreColor(variant.virality_potential)}`}>
                                {variant.virality_potential}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-2 font-medium">Brand Alignment</td>
                          {variants.map((variant) => (
                            <td key={variant.id} className="text-center py-2">
                              <span className={`font-semibold ${getScoreColor(variant.brand_alignment)}`}>
                                {variant.brand_alignment}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 font-medium">Readability</td>
                          {variants.map((variant) => (
                            <td key={variant.id} className="text-center py-2">
                              <span className={`font-semibold ${getScoreColor(variant.readability_score)}`}>
                                {variant.readability_score}%
                              </span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
} 