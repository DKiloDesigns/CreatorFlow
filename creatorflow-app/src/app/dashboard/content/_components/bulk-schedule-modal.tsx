'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon,
  Clock,
  Upload,
  Plus,
  Trash2,
  Copy,
  Edit,
  Eye,
  Check,
  X,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Hash,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { format } from 'date-fns';

interface ScheduledPost {
  id: string;
  content: string;
  media: string[];
  platforms: string[];
  scheduledDate: Date;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  hashtags: string[];
  mentions: string[];
  location?: string;
  isRepost: boolean;
  repostInterval?: number;
  repostCount?: number;
}

interface BulkScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBulkScheduled?: (scheduleData: any) => void;
}

export function BulkScheduleModal({ open, onOpenChange, onBulkScheduled }: BulkScheduleModalProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [postingFrequency, setPostingFrequency] = useState('daily');
  const [postingTime, setPostingTime] = useState('09:00');
  const [isScheduling, setIsScheduling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' }
  ];

  const frequencies = [
    { value: 'hourly', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'custom', label: 'Custom Interval' }
  ];

  const samplePosts = [
    {
      id: '1',
      content: '🚀 Excited to share our latest product launch! Check out what we\'ve been working on behind the scenes. #ProductLaunch #Innovation',
      media: ['/api/media/sample1.jpg'],
      platforms: ['instagram', 'facebook'],
      scheduledDate: new Date(),
      scheduledTime: '09:00',
      status: 'draft' as const,
      hashtags: ['#ProductLaunch', '#Innovation', '#Tech'],
      mentions: ['@techcompany'],
      location: 'San Francisco, CA',
      isRepost: false
    },
    {
      id: '2',
      content: 'Behind the scenes: Our team working hard to bring you the best content! 💪 #BehindTheScenes #TeamWork #Creativity',
      media: ['/api/media/sample2.jpg'],
      platforms: ['instagram', 'twitter'],
      scheduledDate: new Date(),
      scheduledTime: '12:00',
      status: 'draft' as const,
      hashtags: ['#BehindTheScenes', '#TeamWork', '#Creativity'],
      mentions: [],
      isRepost: true,
      repostInterval: 7,
      repostCount: 3
    },
    {
      id: '3',
      content: 'Customer spotlight: "This product changed everything for our business!" - Sarah from @startupcompany #CustomerSuccess #Testimonial',
      media: [],
      platforms: ['linkedin', 'facebook'],
      scheduledDate: new Date(),
      scheduledTime: '15:00',
      status: 'draft' as const,
      hashtags: ['#CustomerSuccess', '#Testimonial', '#Business'],
      mentions: ['@startupcompany'],
      isRepost: false
    }
  ];

  const handleAddPost = () => {
    const newPost: ScheduledPost = {
      id: `post-${Date.now()}`,
      content: '',
      media: [],
      platforms: selectedPlatforms,
      scheduledDate: startDate || new Date(),
      scheduledTime: postingTime,
      status: 'draft',
      hashtags: [],
      mentions: [],
      isRepost: false
    };
    setPosts(prev => [...prev, newPost]);
  };

  const handleUpdatePost = (postId: string, updates: Partial<ScheduledPost>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    toast.success('Post removed from schedule');
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleLoadSamplePosts = () => {
    setPosts(samplePosts);
    setSelectedPlatforms(['instagram', 'facebook', 'twitter', 'linkedin']);
    toast.success('Sample posts loaded');
  };

  const handleBulkSchedule = async () => {
    if (posts.length === 0) {
      toast.error('Add at least one post to schedule');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Select at least one platform');
      return;
    }

    setIsScheduling(true);
    try {
      // Simulate bulk scheduling process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const scheduleData = {
        posts: posts.map(post => ({
          ...post,
          platforms: selectedPlatforms,
          scheduledDate: startDate,
          scheduledTime: postingTime
        })),
        platforms: selectedPlatforms,
        startDate,
        postingFrequency,
        postingTime,
        totalPosts: posts.length,
        scheduledAt: new Date().toISOString()
      };
      
      onBulkScheduled?.(scheduleData);
      toast.success(`Successfully scheduled ${posts.length} posts!`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to schedule posts');
    } finally {
      setIsScheduling(false);
    }
  };

  const generateSchedulePreview = () => {
    if (!startDate || posts.length === 0) return [];
    
    const preview = [];
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < Math.min(posts.length, 10); i++) {
      const post = posts[i];
      const scheduledDateTime = new Date(currentDate);
      scheduledDateTime.setHours(parseInt(postingTime.split(':')[0]), parseInt(postingTime.split(':')[1]));
      
      preview.push({
        ...post,
        scheduledDate: scheduledDateTime,
        platforms: selectedPlatforms
      });
      
      // Move to next date based on frequency
      if (postingFrequency === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (postingFrequency === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      }
    }
    
    return preview;
  };

  const schedulePreview = generateSchedulePreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bulk Schedule Content</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col lg:flex-row gap-6 h-[85vh]">
          {/* Left Panel - Posts and Settings */}
          <div className="flex-1 flex flex-col">
            {/* Step Navigation */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 1 ? <Check className="h-3 w-3" /> : '1'}
                </div>
                <span className="text-sm">Posts</span>
              </div>
              <div className="w-8 h-px bg-gray-300" />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 2 ? <Check className="h-3 w-3" /> : '2'}
                </div>
                <span className="text-sm">Schedule</span>
              </div>
              <div className="w-8 h-px bg-gray-300" />
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}>
                  3
                </div>
                <span className="text-sm">Review</span>
              </div>
            </div>

            {currentStep === 1 && (
              /* Step 1: Posts */
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Content Posts</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadSamplePosts}
                    >
                      Load Samples
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddPost}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Post
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {posts.map((post, index) => (
                    <div key={post.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-sm">Post {index + 1}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Content</Label>
                          <Textarea
                            value={post.content}
                            onChange={(e) => handleUpdatePost(post.id, { content: e.target.value })}
                            placeholder="Write your post content..."
                            className="text-sm"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">Hashtags</Label>
                            <Input
                              value={post.hashtags.join(' ')}
                              onChange={(e) => handleUpdatePost(post.id, { 
                                hashtags: e.target.value.split(' ').filter(tag => tag.startsWith('#'))
                              })}
                              placeholder="#hashtag1 #hashtag2"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Mentions</Label>
                            <Input
                              value={post.mentions.join(' ')}
                              onChange={(e) => handleUpdatePost(post.id, { 
                                mentions: e.target.value.split(' ').filter(mention => mention.startsWith('@'))
                              })}
                              placeholder="@username1 @username2"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={post.isRepost}
                              onCheckedChange={(checked) => 
                                handleUpdatePost(post.id, { isRepost: checked as boolean })
                              }
                            />
                            <Label className="text-xs">Repost</Label>
                          </div>
                          {post.isRepost && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={post.repostInterval || 7}
                                onChange={(e) => handleUpdatePost(post.id, { 
                                  repostInterval: parseInt(e.target.value) 
                                })}
                                className="w-16 text-sm"
                                min="1"
                              />
                              <span className="text-xs text-muted-foreground">days</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {posts.length > 0 && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      className="w-full"
                    >
                      Continue to Schedule
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              /* Step 2: Schedule Settings */
              <div className="flex-1 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Schedule Settings</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Posts
                  </Button>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Select Platforms</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {platforms.map(platform => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <div
                          key={platform.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handlePlatformToggle(platform.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${platform.color}`} />
                            <span className="text-sm font-medium">{platform.name}</span>
                            {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Posting Time</Label>
                    <Input
                      type="time"
                      value={postingTime}
                      onChange={(e) => setPostingTime(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Posting Frequency</Label>
                    <Select value={postingFrequency} onValueChange={setPostingFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencies.map(frequency => (
                          <SelectItem key={frequency.value} value={frequency.value}>
                            {frequency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Total Posts</Label>
                    <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {postingFrequency === 'daily' && `${posts.length} days`}
                      {postingFrequency === 'weekly' && `${posts.length * 7} days`}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => setCurrentStep(3)}
                    className="w-full"
                    disabled={selectedPlatforms.length === 0}
                  >
                    Review Schedule
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              /* Step 3: Review and Schedule */
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Review Schedule</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep(2)}
                    >
                      Back to Schedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? 'Hide' : 'Show'} Preview
                    </Button>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
                    <div className="text-xs text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedPlatforms.length}</div>
                    <div className="text-xs text-muted-foreground">Platforms</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {postingFrequency === 'daily' ? posts.length : posts.length * 7}
                    </div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {posts.length * selectedPlatforms.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Posts</div>
                  </div>
                </div>

                {/* Schedule Preview */}
                {showPreview && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Schedule Preview</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {schedulePreview.map((post, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {format(post.scheduledDate, 'MMM dd, yyyy')} at {postingTime}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {post.content.substring(0, 50)}...
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {post.platforms.map(platformId => {
                              const platform = platforms.find(p => p.id === platformId);
                              if (!platform) return null;
                              const Icon = platform.icon;
                              return (
                                <Icon key={platformId} className={`h-4 w-4 ${platform.color}`} />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button
                    onClick={handleBulkSchedule}
                    disabled={isScheduling}
                    className="w-full"
                  >
                    {isScheduling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Scheduling...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule All Posts
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 