import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Hash, 
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
        <CardTitle className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-blue-600" />
          AI Hashtag Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Content Description</label>
            <Textarea
              placeholder="Describe your content to get relevant hashtags..."
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
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateHashtags}
          disabled={(!content.trim() && !industry) || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-muted-foreground">
                Generated Hashtags ({hashtags.length})
              </h3>
              {selectedHashtags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {selectedHashtags.length} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllSelected}
                    className="h-6 px-2 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy All
                  </Button>
                  <Button
                    size="sm"
                    onClick={useSelectedHashtags}
                    className="h-6 px-2 text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Use Selected
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {hashtags.map((hashtag, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedHashtags.includes(hashtag.hashtag)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => toggleHashtagSelection(hashtag.hashtag)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{hashtag.hashtag}</span>
                        {hashtag.trending && (
                          <Badge variant="destructive" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Relevance: {hashtag.relevance}%</span>
                        <span>Reach: {hashtag.reach.toLocaleString()}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(hashtag.hashtag, index);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={generateHashtags}
              disabled={isGenerating}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Generate More
            </Button>
          </div>
        )}

        {/* Selected Hashtags Preview */}
        {selectedHashtags.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Selected Hashtags:</h4>
            <div className="flex flex-wrap gap-1">
              {selectedHashtags.map((hashtag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-200"
                  onClick={() => toggleHashtagSelection(hashtag)}
                >
                  {hashtag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 