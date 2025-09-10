'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/mui-card';
import { Button } from '@/components/ui/mui-button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, Tab, Box } from '@mui/material';
import { Badge } from '@/components/ui/feedback/mui-badge';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { 
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
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AiSuggestModal from '@/app/dashboard/content/_components/ai-suggest-modal';
import { Typography, Box } from '@mui/material';

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
  const [activeTab, setActiveTab] = useState(0);
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

  const handleAiSave = (name: string, _text: string) => {
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
    } catch {
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {selectedPlatforms.map(platformId => {
          const platform = platforms.find(p => p.id === platformId);
          if (!platform) return null;

          return (
            <Card key={platformId} sx={{ border: '2px dashed', borderColor: 'divider' }}>
              <CardHeader sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography component="span" sx={{ fontSize: '1.125rem' }}>{platform.icon}</Typography>
                  <Typography component="span" sx={{ fontWeight: 500 }}>{platform.name}</Typography>
                  <Badge variant="outlined" sx={{ ml: 'auto' }}>
                    {content.length}/{platform.maxLength}
                  </Badge>
                </Box>
              </CardHeader>
              <CardContent>
                <Box 
                  sx={{ 
                    '& .prose': { 
                      fontSize: '0.875rem',
                      maxWidth: 'none'
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: formattedContent }}
                />
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  };

  return (
    <Card sx={{ ...(className && { className }) }}>
      <CardHeader>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Create Content</span>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
              {showPreview ? 'Hide Preview' : 'Preview'}
            </Button>
          </Box>
        </Typography>
        
        {/* Action Buttons - Right below the header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap', gap: 1, mt: 2 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openUploadModal'))}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              width: { xs: '100%', sm: 'auto' }, 
              minWidth: 44, 
              minHeight: 44 
            }}
          >
            <Upload style={{ width: 16, height: 16 }} />
            <Typography component="span" sx={{ color: 'text.primary', wordBreak: 'break-words' }}>Upload Media</Typography>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openCreateVideoModal'))}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              width: { xs: '100%', sm: 'auto' }, 
              minWidth: 44, 
              minHeight: 44 
            }}
          >
            <Video style={{ width: 16, height: 16 }} />
            <Typography component="span" sx={{ color: 'text.primary', wordBreak: 'break-words' }}>Create Video</Typography>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openUseTemplateModal'))}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              width: { xs: '100%', sm: 'auto' }, 
              minWidth: 44, 
              minHeight: 44 
            }}
          >
            <FileText style={{ width: 16, height: 16 }} />
            <Typography component="span" sx={{ color: 'text.primary', wordBreak: 'break-words' }}>Use Template</Typography>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.dispatchEvent(new CustomEvent('openBulkScheduleModal'))}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              width: { xs: '100%', sm: 'auto' }, 
              minWidth: 44, 
              minHeight: 44 
            }}
          >
            <Calendar style={{ width: 16, height: 16 }} />
            <Typography component="span" sx={{ color: 'text.primary', wordBreak: 'break-words' }}>Bulk Schedule</Typography>
          </Button>
        </Box>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Compose" />
          <Tab label="Schedule" />

          {activeTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            </Box>
          )}

          {activeTab === 1 && (
            <Box className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Scheduling feature coming soon!</p>
            </div>
            </Box>
          )}
        </Tabs>
      </CardContent>

      {/* AI Suggestion Modal */}
      {isClient && (
        <AlertDialog open={aiModalOpen} onClose={() => setAiModalOpen(false)}>
          <AiSuggestModal
            _open={aiModalOpen}
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