import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Target
} from 'lucide-react';
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
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Caption Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Content Description</label>
            <Textarea
              placeholder="Describe your content, what you want to share, or the message you want to convey..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <label className="text-sm font-medium mb-2 block">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Industry (Optional)</label>
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
              <label className="text-sm font-medium mb-2 block">Target Audience (Optional)</label>
              <Textarea
                placeholder="e.g., Young professionals, fitness enthusiasts..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="min-h-[40px]"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateCaptions}
          disabled={!content.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Generating Captions...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Captions
            </>
          )}
        </Button>

        {/* Generated Captions */}
        {captions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground">
              Generated Captions ({captions.length})
            </h3>
            {captions.map((caption, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm mb-2">{caption.caption}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">
                        {caption.tone}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {caption.platform}
                      </Badge>
                      {caption.engagement_score && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>{caption.engagement_score}% engagement</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(caption.caption, index)}
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
                      onClick={() => useCaption(caption.caption)}
                      className="h-8 w-8 p-0"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={generateCaptions}
              disabled={isGenerating}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 