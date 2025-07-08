'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { 
  Image, 
  Video, 
  Link, 
  Smile, 
  Calendar, 
  Send, 
  Eye,
  EyeOff,
  Hash,
  AtSign,
  Bold,
  Italic,
  List,
  Quote,
  Sparkles,
  Brain,
  Zap,
  Upload,
  FileText,
  Folder
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AiSuggestModal from '@/app/dashboard/content/_components/ai-suggest-modal';

interface Platform {
  id: string;
  name: string;
  icon: string;
  maxLength: number;
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsLinks: boolean;
  supportsHashtags: boolean;
  supportsMentions: boolean;
}

const platforms: Platform[] = [
  {
    id: 'twitter',
    name: 'Twitter',
    icon: '🐦',
    maxLength: 280,
    supportsImages: true,
    supportsVideos: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    maxLength: 3000,
    supportsImages: true,
    supportsVideos: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    maxLength: 2200,
    supportsImages: true,
    supportsVideos: true,
    supportsLinks: false,
    supportsHashtags: true,
    supportsMentions: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: '📘',
    maxLength: 63206,
    supportsImages: true,
    supportsVideos: true,
    supportsLinks: true,
    supportsHashtags: true,
    supportsMentions: true,
  },
];

interface EnhancedComposerProps {
  onSubmit?: (content: string, selectedPlatforms: string[]) => void;
  className?: string;
}

export function EnhancedComposer({ onSubmit, className }: EnhancedComposerProps) {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'captions' | 'hashtags'>('captions');
  const [isClient, setIsClient] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Client-side hydration check
  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentPlatform = platforms.find(p => selectedPlatforms.includes(p.id)) || platforms[0];
  const remainingChars = currentPlatform.maxLength - content.length;
  const isOverLimit = remainingChars < 0;

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + text.length, start + text.length);
      }
    }, 0);
  };

  const formatText = (format: 'bold' | 'italic' | 'list' | 'quote') => {
    const formats = {
      bold: '**text**',
      italic: '*text*',
      list: '- item',
      quote: '> quote'
    };
    
    insertText(formats[format]);
  };

  const addHashtag = () => {
    const hashtag = prompt('Enter hashtag:');
    if (hashtag) {
      insertText(`#${hashtag.replace(/\s+/g, '')} `);
    }
  };

  const addMention = () => {
    const mention = prompt('Enter username:');
    if (mention) {
      insertText(`@${mention.replace(/\s+/g, '')} `);
    }
  };

  const handleSubmit = () => {
    if (content.trim() && selectedPlatforms.length > 0 && !isOverLimit) {
      onSubmit?.(content, selectedPlatforms);
      setContent('');
    }
  };

  const handleAiSuggestion = (type: 'captions' | 'hashtags') => {
    setAiModalType(type);
    setAiModalOpen(true);
  };

  const handleAiInsert = (text: string) => {
    insertText(text);
    setAiModalOpen(false);
    toast.success('AI suggestion inserted!');
  };

  const handleAiSave = (name: string, text: string) => {
    // Save as template - you can implement this later
    toast.success(`Saved as template: ${name}`);
    setAiModalOpen(false);
  };

  const generateAiContent = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content first to get AI suggestions');
      return;
    }

    try {
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatforms[0] || 'twitter',
          industry: 'general',
          targetAudience: 'general'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          const suggestion = data.data[0];
          insertText(suggestion);
          toast.success('AI content generated!');
        } else {
          toast.error('No AI suggestions available');
        }
      } else {
        toast.error('Failed to generate AI content');
      }
    } catch (error) {
      toast.error('Failed to generate AI content');
    }
  };

  const renderPreview = () => {
    const formattedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/#(\w+)/g, '<span class="text-blue-500">#$1</span>')
      .replace(/@(\w+)/g, '<span class="text-blue-500">@$1</span>')
      .replace(/>\s*(.*)/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/-\s*(.*)/g, '<li>$1</li>');

    return (
      <div className="space-y-4">
        {selectedPlatforms.map(platformId => {
          const platform = platforms.find(p => p.id === platformId);
          if (!platform) return null;

          return (
            <Card key={platformId} className="border-2 border-dashed">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{platform.icon}</span>
                  <span className="font-medium">{platform.name}</span>
                  <Badge variant="outline" className="ml-auto">
                    {content.length}/{platform.maxLength}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create Content</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
          </div>
        </CardTitle>
        
        {/* Action Buttons - Right below the header */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openUploadModal'))}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Upload className="h-4 w-4" />
            <span className="text-black dark:text-white">Upload Media</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openCreateVideoModal'))}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Video className="h-4 w-4" />
            <span className="text-black dark:text-white">Create Video</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openUseTemplateModal'))}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <FileText className="h-4 w-4" />
            <span className="text-black dark:text-white">Use Template</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openBulkScheduleModal'))}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-black dark:text-white">Bulk Schedule</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openMediaLibraryModal'))}
            className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Folder className="h-4 w-4" />
            <span className="text-black dark:text-white">Media Library</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4">
            {/* Platform Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map(platform => (
                  <Button
                    key={platform.id}
                    variant={selectedPlatforms.includes(platform.id) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePlatformToggle(platform.id)}
                    className="flex items-center gap-2"
                  >
                    <span>{platform.icon}</span>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Content</label>
                <div className="flex items-center gap-1 text-xs">
                  <span className={cn(
                    isOverLimit ? 'text-red-500' : 'text-muted-foreground'
                  )}>
                    {remainingChars}
                  </span>
                  <span className="text-muted-foreground">characters left</span>
                </div>
              </div>

              {/* AI Magic Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateAiContent}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800"
                >
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-black dark:text-white">AI Content</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiSuggestion('captions')}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800"
                >
                  <Brain className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-black dark:text-white">AI Captions</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiSuggestion('hashtags')}
                  className="flex items-center gap-2 bg-white hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-800"
                >
                  <Zap className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-black dark:text-white">AI Hashtags</span>
                </Button>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex items-center gap-1 p-2 border rounded-md bg-muted/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('bold')}
                  className="h-8 w-8 p-0"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('italic')}
                  className="h-8 w-8 p-0"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText('quote')}
                  className="h-8 w-8 p-0"
                >
                  <Quote className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addHashtag}
                  className="h-8 w-8 p-0"
                >
                  <Hash className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addMention}
                  className="h-8 w-8 p-0"
                >
                  <AtSign className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Use AI buttons above for suggestions!"
                className={cn(
                  'min-h-[120px] resize-none',
                  isOverLimit && 'border-red-500 focus:border-red-500'
                )}
                maxLength={currentPlatform.maxLength}
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Preview</label>
                {renderPreview()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!content.trim() || selectedPlatforms.length === 0 || isOverLimit}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-100"
              >
                <Send className="h-4 w-4" />
                Post Now
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Scheduling feature coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* AI Suggestion Modal */}
      {isClient && (
        <AlertDialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
          <AiSuggestModal
            open={aiModalOpen}
            onOpenChange={setAiModalOpen}
            type={aiModalType}
            onInsert={handleAiInsert}
            onSave={handleAiSave}
          />
        </AlertDialog>
      )}
    </Card>
  );
} 