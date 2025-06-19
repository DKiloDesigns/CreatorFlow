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
import { Switch } from './switch';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Users, 
  BarChart3, 
  Search, 
  Copy, 
  RefreshCw,
  Zap,
  Eye,
  Clock,
  Globe,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
  Brain,
  Calendar,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Video,
  Image,
  FileText,
  Mic,
  Play,
  Camera,
  Edit3,
  Hash,
  MapPin,
  CalendarDays,
  Clock3,
  Target,
  Zap,
  Rocket,
  Crown,
  Trophy,
  Medal
} from 'lucide-react';
import { toast } from 'sonner';

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  content_type: 'video' | 'image' | 'carousel' | 'story' | 'reel' | 'article' | 'podcast' | 'live';
  platforms: string[];
  hashtags: string[];
  target_audience: string[];
  pain_points: string[];
  benefits: string[];
  viral_potential: number;
  engagement_score: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  time_required: string;
  resources_needed: string[];
  trending_score: number;
  content_gap_score: number;
  competitor_analysis: {
    similar_content: number;
    unique_angle: string;
    differentiation: string[];
  };
  seasonal_relevance: number;
  evergreen_potential: number;
  monetization_opportunities: string[];
  collaboration_ideas: string[];
  repurposing_options: string[];
  hooks: string[];
  call_to_actions: string[];
  keywords: string[];
  seo_potential: number;
  brand_alignment: number;
}

interface ContentIdeasGeneratorProps {
  provider: string;
}

const CONTENT_TYPES = [
  { id: 'video', name: 'Video', icon: Video, platforms: ['YouTube', 'TikTok', 'Instagram', 'LinkedIn'] },
  { id: 'image', name: 'Image Post', icon: Image, platforms: ['Instagram', 'Facebook', 'LinkedIn', 'Pinterest'] },
  { id: 'carousel', name: 'Carousel', icon: FileText, platforms: ['Instagram', 'LinkedIn', 'Facebook'] },
  { id: 'story', name: 'Story/Reel', icon: Play, platforms: ['Instagram', 'Facebook', 'Snapchat'] },
  { id: 'article', name: 'Article', icon: Edit3, platforms: ['LinkedIn', 'Medium', 'Blog'] },
  { id: 'podcast', name: 'Podcast', icon: Mic, platforms: ['Spotify', 'Apple Podcasts', 'YouTube'] },
  { id: 'live', name: 'Live Stream', icon: Camera, platforms: ['Instagram', 'Facebook', 'YouTube', 'Twitch'] }
];

const INDUSTRIES = [
  'Technology', 'Fitness', 'Fashion', 'Food', 'Travel', 'Business', 'Education', 
  'Health', 'Beauty', 'Gaming', 'Finance', 'Real Estate', 'Marketing', 'Design',
  'Photography', 'Music', 'Art', 'Sports', 'Parenting', 'Lifestyle', 'Automotive',
  'Pets', 'DIY', 'Science', 'Politics', 'Entertainment', 'Books', 'Movies'
];

const AUDIENCES = [
  'Entrepreneurs', 'Students', 'Professionals', 'Parents', 'Fitness Enthusiasts',
  'Tech Enthusiasts', 'Creative Professionals', 'Small Business Owners',
  'Investors', 'Job Seekers', 'Travelers', 'Food Lovers', 'Gamers',
  'Fashion Enthusiasts', 'Health Conscious', 'Budget Conscious', 'Luxury Seekers'
];

export function ContentIdeasGenerator({ provider }: ContentIdeasGeneratorProps) {
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentFocus, setContentFocus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeTrending, setIncludeTrending] = useState(true);
  const [includeEvergreen, setIncludeEvergreen] = useState(true);
  const [includeGapAnalysis, setIncludeGapAnalysis] = useState(true);
  const [includeCompetitorAnalysis, setIncludeCompetitorAnalysis] = useState(true);
  const [contentTypes, setContentTypes] = useState<string[]>(['video', 'image', 'carousel']);
  const [viralPotential, setViralPotential] = useState(50);
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [seasonalFocus, setSeasonalFocus] = useState('');
  const [brandVoice, setBrandVoice] = useState('friendly');

  const generateIdeas = async () => {
    if (!industry.trim() && !targetAudience.trim()) {
      toast.error('Please enter industry or target audience to generate ideas');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with realistic delays
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const mockIdeas: ContentIdea[] = [
        {
          id: '1',
          title: 'Behind the Scenes: Building a Tech Startup',
          description: 'Show the real journey of building a tech startup - the challenges, wins, and lessons learned. Perfect for entrepreneurs and tech enthusiasts.',
          content_type: 'video',
          platforms: ['YouTube', 'LinkedIn', 'Instagram'],
          hashtags: ['#startup', '#tech', '#entrepreneur', '#behindthescenes'],
          target_audience: ['Entrepreneurs', 'Tech Enthusiasts', 'Students'],
          pain_points: ['Lack of transparency', 'Fear of failure', 'Unrealistic expectations'],
          benefits: ['Authentic storytelling', 'Educational value', 'Community building'],
          viral_potential: 85,
          engagement_score: 92,
          difficulty_level: 'medium',
          time_required: '2-3 hours',
          resources_needed: ['Camera', 'Editing software', 'Story outline'],
          trending_score: 78,
          content_gap_score: 88,
          competitor_analysis: {
            similar_content: 45,
            unique_angle: 'Real-time startup journey',
            differentiation: ['Authentic storytelling', 'Educational focus', 'Community engagement']
          },
          seasonal_relevance: 65,
          evergreen_potential: 90,
          monetization_opportunities: ['Sponsorships', 'Course creation', 'Consulting'],
          collaboration_ideas: ['Partner with other startups', 'Interview industry experts'],
          repurposing_options: ['Blog post', 'Podcast episode', 'Social media carousel'],
          hooks: ['The startup journey nobody talks about', 'What I wish I knew before starting'],
          call_to_actions: ['Subscribe for more insights', 'Share your startup story'],
          keywords: ['startup', 'entrepreneur', 'tech', 'business', 'growth'],
          seo_potential: 85,
          brand_alignment: 88
        },
        {
          id: '2',
          title: '5 Productivity Hacks That Actually Work',
          description: 'Share proven productivity techniques with real examples and results. Include before/after scenarios and actionable tips.',
          content_type: 'carousel',
          platforms: ['Instagram', 'LinkedIn', 'Facebook'],
          hashtags: ['#productivity', '#hacks', '#tips', '#efficiency'],
          target_audience: ['Professionals', 'Students', 'Entrepreneurs'],
          pain_points: ['Time management', 'Overwhelm', 'Low productivity'],
          benefits: ['Immediate actionable tips', 'Proven results', 'Time-saving'],
          viral_potential: 92,
          engagement_score: 88,
          difficulty_level: 'easy',
          time_required: '1-2 hours',
          resources_needed: ['Design tools', 'Examples', 'Screenshots'],
          trending_score: 85,
          content_gap_score: 72,
          competitor_analysis: {
            similar_content: 120,
            unique_angle: 'Proven results with data',
            differentiation: ['Real examples', 'Measurable results', 'Actionable steps']
          },
          seasonal_relevance: 75,
          evergreen_potential: 95,
          monetization_opportunities: ['Product recommendations', 'Course sales', 'Consulting'],
          collaboration_ideas: ['Partner with productivity apps', 'Expert interviews'],
          repurposing_options: ['Video tutorial', 'Blog post', 'Email newsletter'],
          hooks: ['These 5 hacks saved me 10 hours a week', 'The productivity method that changed everything'],
          call_to_actions: ['Try these hacks', 'Share your favorite tip'],
          keywords: ['productivity', 'hacks', 'tips', 'efficiency', 'time management'],
          seo_potential: 78,
          brand_alignment: 82
        },
        {
          id: '3',
          title: 'The Future of AI in Content Creation',
          description: 'Explore how AI is transforming content creation with real examples, tools, and predictions for the future.',
          content_type: 'video',
          platforms: ['YouTube', 'LinkedIn', 'Instagram'],
          hashtags: ['#ai', '#contentcreation', '#future', '#technology'],
          target_audience: ['Content Creators', 'Tech Enthusiasts', 'Marketers'],
          pain_points: ['Content creation overwhelm', 'Keeping up with trends', 'Quality vs speed'],
          benefits: ['Future-proof knowledge', 'Tool recommendations', 'Industry insights'],
          viral_potential: 88,
          engagement_score: 85,
          difficulty_level: 'hard',
          time_required: '4-6 hours',
          resources_needed: ['Research materials', 'AI tools', 'Expert interviews'],
          trending_score: 95,
          content_gap_score: 82,
          competitor_analysis: {
            similar_content: 35,
            unique_angle: 'Practical AI implementation',
            differentiation: ['Real tool examples', 'Future predictions', 'Practical applications']
          },
          seasonal_relevance: 90,
          evergreen_potential: 70,
          monetization_opportunities: ['AI tool affiliate', 'Consulting', 'Course creation'],
          collaboration_ideas: ['AI tool companies', 'Industry experts'],
          repurposing_options: ['Webinar', 'Blog series', 'Podcast episode'],
          hooks: ['AI is changing content creation forever', 'The tools that will replace traditional methods'],
          call_to_actions: ['Learn more about AI tools', 'Share your AI experience'],
          keywords: ['ai', 'content creation', 'future', 'technology', 'automation'],
          seo_potential: 92,
          brand_alignment: 85
        },
        {
          id: '4',
          title: 'Day in the Life: Remote Work Edition',
          description: 'Show a realistic day in the life of a remote worker, including challenges, routines, and tips for staying productive.',
          content_type: 'story',
          platforms: ['Instagram', 'TikTok', 'YouTube'],
          hashtags: ['#remotework', '#dayinthelife', '#workfromhome', '#productivity'],
          target_audience: ['Remote Workers', 'Professionals', 'Job Seekers'],
          pain_points: ['Work-life balance', 'Isolation', 'Distractions'],
          benefits: ['Relatable content', 'Practical tips', 'Community building'],
          viral_potential: 78,
          engagement_score: 82,
          difficulty_level: 'easy',
          time_required: '30 minutes',
          resources_needed: ['Phone camera', 'Daily routine'],
          trending_score: 72,
          content_gap_score: 68,
          competitor_analysis: {
            similar_content: 200,
            unique_angle: 'Authentic remote work reality',
            differentiation: ['Real challenges', 'Practical solutions', 'Authentic storytelling']
          },
          seasonal_relevance: 80,
          evergreen_potential: 85,
          monetization_opportunities: ['Remote work products', 'Consulting', 'Course creation'],
          collaboration_ideas: ['Remote work tools', 'Other remote workers'],
          repurposing_options: ['Blog post', 'Video series', 'Email newsletter'],
          hooks: ['The reality of remote work nobody shows', 'How I stay productive working from home'],
          call_to_actions: ['Share your remote work tips', 'Follow for more remote work content'],
          keywords: ['remote work', 'work from home', 'productivity', 'day in the life'],
          seo_potential: 75,
          brand_alignment: 78
        },
        {
          id: '5',
          title: 'Industry Expert Interview Series',
          description: 'Interview thought leaders and experts in your industry, sharing insights, tips, and behind-the-scenes knowledge.',
          content_type: 'podcast',
          platforms: ['Spotify', 'Apple Podcasts', 'YouTube'],
          hashtags: ['#interview', '#expert', '#industry', '#insights'],
          target_audience: ['Industry Professionals', 'Students', 'Enthusiasts'],
          pain_points: ['Lack of expert insights', 'Industry knowledge gaps', 'Networking challenges'],
          benefits: ['Expert knowledge', 'Networking opportunities', 'Authority building'],
          viral_potential: 65,
          engagement_score: 88,
          difficulty_level: 'medium',
          time_required: '2-3 hours per episode',
          resources_needed: ['Recording equipment', 'Guest connections', 'Interview skills'],
          trending_score: 60,
          content_gap_score: 75,
          competitor_analysis: {
            similar_content: 85,
            unique_angle: 'Industry-specific focus',
            differentiation: ['Niche expertise', 'Deep insights', 'Practical takeaways']
          },
          seasonal_relevance: 70,
          evergreen_potential: 95,
          monetization_opportunities: ['Sponsorships', 'Premium content', 'Consulting'],
          collaboration_ideas: ['Industry experts', 'Companies', 'Event organizers'],
          repurposing_options: ['Blog posts', 'Social media clips', 'Email newsletters'],
          hooks: ['Insights from industry leaders', 'What the experts won\'t tell you'],
          call_to_actions: ['Subscribe to the podcast', 'Suggest interview guests'],
          keywords: ['interview', 'expert', 'industry', 'insights', 'podcast'],
          seo_potential: 88,
          brand_alignment: 90
        }
      ];

      setIdeas(mockIdeas);
      setSelectedIdea(mockIdeas[0]);
      toast.success('Generated 5 content ideas with AI analysis!');
    } catch (error) {
      toast.error('Failed to generate content ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Crown className="w-4 h-4" />;
    if (score >= 80) return <Trophy className="w-4 h-4" />;
    if (score >= 70) return <Medal className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Content Ideas Generator
          </CardTitle>
          <CardDescription>
            AI-powered content brainstorming with trend analysis, gap detection, and viral prediction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Input */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Industry/Niche</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((ind) => (
                    <SelectItem key={ind} value={ind.toLowerCase()}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience..." />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((audience) => (
                    <SelectItem key={audience} value={audience.toLowerCase()}>
                      {audience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Content Focus (Optional)</Label>
              <Input
                placeholder="e.g., productivity, growth, tips..."
                value={contentFocus}
                onChange={(e) => setContentFocus(e.target.value)}
              />
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full"
            >
              <Brain className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Content Types</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {CONTENT_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Switch
                            checked={contentTypes.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setContentTypes([...contentTypes, type.id]);
                              } else {
                                setContentTypes(contentTypes.filter(t => t !== type.id));
                              }
                            }}
                          />
                          <Label className="text-sm flex items-center gap-1">
                            <type.icon className="w-3 h-3" />
                            {type.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Analysis Features</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trending Analysis</span>
                        <Switch checked={includeTrending} onCheckedChange={setIncludeTrending} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Evergreen Content</span>
                        <Switch checked={includeEvergreen} onCheckedChange={setIncludeEvergreen} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Content Gap Analysis</span>
                        <Switch checked={includeGapAnalysis} onCheckedChange={setIncludeGapAnalysis} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Competitor Analysis</span>
                        <Switch checked={includeCompetitorAnalysis} onCheckedChange={setIncludeCompetitorAnalysis} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select value={difficultyLevel} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficultyLevel(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy (Quick wins)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="hard">Hard (High impact)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Seasonal Focus (Optional)</Label>
                    <Input
                      placeholder="e.g., summer, holidays, back to school..."
                      value={seasonalFocus}
                      onChange={(e) => setSeasonalFocus(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Brand Voice</Label>
                    <Select value={brandVoice} onValueChange={setBrandVoice}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                        <SelectItem value="professional">Professional & Authoritative</SelectItem>
                        <SelectItem value="energetic">Energetic & Motivational</SelectItem>
                        <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                        <SelectItem value="luxury">Luxury & Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateIdeas}
            disabled={isGenerating || (!industry && !targetAudience)}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating Content Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {ideas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Generated Content Ideas</h2>
            <Badge variant="secondary">
              {ideas.length} ideas created
            </Badge>
          </div>

          <Tabs defaultValue="ideas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ideas">Content Ideas</TabsTrigger>
              <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="trends">Trend Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="ideas" className="space-y-4">
              {ideas.map((idea, index) => (
                <Card
                  key={idea.id}
                  className={`cursor-pointer transition-all ${
                    selectedIdea?.id === idea.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedIdea(idea)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Idea {index + 1}</Badge>
                        <Badge className={getDifficultyColor(idea.difficulty_level)}>
                          {idea.difficulty_level}
                        </Badge>
                        <Badge variant="secondary">{idea.content_type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(idea.title);
                            toast.success('Idea title copied!');
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                    <p className="text-gray-600 mb-4">{idea.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(idea.viral_potential)}`}>
                          {getScoreIcon(idea.viral_potential)}
                        </div>
                        <p className="text-gray-600">Viral Potential</p>
                        <p className="font-medium">{idea.viral_potential}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(idea.engagement_score)}`}>
                          {getScoreIcon(idea.engagement_score)}
                        </div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-medium">{idea.engagement_score}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(idea.content_gap_score)}`}>
                          {getScoreIcon(idea.content_gap_score)}
                        </div>
                        <p className="text-gray-600">Content Gap</p>
                        <p className="font-medium">{idea.content_gap_score}%</p>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getScoreColor(idea.evergreen_potential)}`}>
                          {getScoreIcon(idea.evergreen_potential)}
                        </div>
                        <p className="text-gray-600">Evergreen</p>
                        <p className="font-medium">{idea.evergreen_potential}%</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {idea.platforms.slice(0, 3).map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                      {idea.platforms.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.platforms.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {selectedIdea && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Time Required</span>
                          <span className="font-medium">{selectedIdea.time_required}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">SEO Potential</span>
                          <span className="font-medium">{selectedIdea.seo_potential}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Brand Alignment</span>
                          <span className="font-medium">{selectedIdea.brand_alignment}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Seasonal Relevance</span>
                          <span className="font-medium">{selectedIdea.seasonal_relevance}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Monetization & Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Monetization Opportunities</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedIdea.monetization_opportunities.map((opp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {opp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Collaboration Ideas</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedIdea.collaboration_ideas.map((collab, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {collab}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Content Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800">High Viral Potential</h3>
                      <p className="text-green-600 text-sm">3 ideas with 85%+ viral score</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-blue-800">Content Gaps</h3>
                      <p className="text-blue-600 text-sm">2 ideas with 80%+ gap score</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-purple-800">Evergreen Content</h3>
                      <p className="text-purple-600 text-sm">4 ideas with 85%+ evergreen score</p>
                    </div>
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