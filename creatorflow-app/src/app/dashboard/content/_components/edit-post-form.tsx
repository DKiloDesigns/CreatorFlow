import React, { useState } from 'react';
import { 
  Button,
  TextField,
  Typography
} from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/mui-checkbox';

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
        <Typography component="label" htmlFor="contentText">Content</Typography>
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
                onChange={() => handlePlatformToggle(platform)}
              />
              <Typography component="label" htmlFor={platform} className="text-sm capitalize">
                {platform}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Typography component="label" htmlFor="status">Status</Typography>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select 
            value={formData.status} 
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            label="Status"
          >
            {STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {formData.status === 'SCHEDULED' && (
        <div>
          <Typography component="label" htmlFor="scheduledAt">Scheduled Date</Typography>
          <TextField
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
            required
            fullWidth
          />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
} 