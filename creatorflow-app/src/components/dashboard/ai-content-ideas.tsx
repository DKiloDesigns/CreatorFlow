import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
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

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const useIdea = (idea: ContentIdea) => {
    onIdeaSelect?.(idea);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'carousel':
        return <Layers className="h-4 w-4" />;
      case 'story':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Image className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          AI Content Ideas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Target Audience</label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateIdeas}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Content Ideas
            </>
          )}
        </Button>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              Content Ideas ({ideas.length})
            </h3>
            {ideas.map((idea, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{idea.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getContentTypeIcon(idea.content_type)}
                        <span className="ml-1 capitalize">{idea.content_type}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {idea.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Platforms:</span>
                        <div className="flex gap-1">
                          {idea.platforms.map((platform, pIndex) => (
                            <Badge key={pIndex} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">Suggested Hashtags:</span>
                        <div className="flex flex-wrap gap-1">
                          {idea.hashtags.slice(0, 3).map((hashtag, hIndex) => (
                            <Badge key={hIndex} variant="outline" className="text-xs">
                              {hashtag}
                            </Badge>
                          ))}
                          {idea.hashtags.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{idea.hashtags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${idea.title}: ${idea.description}`, index)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => useIdea(idea)}
                      className="h-8 w-8 p-0"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={generateIdeas}
              disabled={isGenerating}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate More Ideas
            </Button>
          </div>
        )}

        {/* Quick Tips */}
        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            Content Creation Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Mix educational, entertaining, and promotional content</li>
            <li>• Use high-quality visuals and engaging captions</li>
            <li>• Post consistently and at optimal times</li>
            <li>• Engage with your audience through comments and stories</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 