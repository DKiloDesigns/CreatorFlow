import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Post {
  id: string;
  contentText?: string;
  status: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
}

interface EditPostFormProps {
  post: Post;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PLATFORMS = ['twitter', 'instagram', 'youtube', 'tiktok'];
const STATUSES = ['DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED'];

export default function EditPostForm({ post, onSave, onCancel }: EditPostFormProps) {
  const [formData, setFormData] = useState({
    contentText: post.contentText || '',
    platforms: post.platforms || [],
    status: post.status,
    scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ''
  });

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      contentText: formData.contentText,
      platforms: formData.platforms,
      status: formData.status,
      scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt).toISOString() : null
    };

    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="contentText">Content</Label>
        <Textarea
          id="contentText"
          value={formData.contentText}
          onChange={(e) => setFormData(prev => ({ ...prev, contentText: e.target.value }))}
          placeholder="Enter your post content..."
          rows={4}
        />
      </div>

      <div>
        <Label>Platforms</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {PLATFORMS.map((platform) => (
            <div key={platform} className="flex items-center space-x-2">
              <Checkbox
                id={platform}
                checked={formData.platforms.includes(platform)}
                onCheckedChange={() => handlePlatformToggle(platform)}
              />
              <Label htmlFor={platform} className="text-sm capitalize">
                {platform}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.status === 'SCHEDULED' && (
        <div>
          <Label htmlFor="scheduledAt">Scheduled Date</Label>
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
            required
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
} 