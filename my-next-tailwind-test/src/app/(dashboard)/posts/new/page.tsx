import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [contentText, setContentText] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [platforms, setPlatforms] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const router = useRouter();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) setMediaUrl(data.url);
      else alert('Upload failed');
    } catch (e) {
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  }

  function handlePlatformChange(platform: string) {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentText,
          status,
          platforms: selectedPlatforms,
          scheduledAt: scheduledAt || undefined,
          mediaUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      router.push('/dashboard/posts');
    } catch (e) {
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <Link href="/dashboard/posts" className="text-sm text-gray-500">Cancel</Link>
      </div>

      <div className="rounded-lg border p-6">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              rows={6}
              className="w-full rounded-md border px-3 py-2"
              placeholder="Write your post content here..."
              value={contentText}
              onChange={e => setContentText(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-md border px-3 py-2"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="scheduledAt" className="text-sm font-medium">Scheduled Time</label>
            <input
              id="scheduledAt"
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Platforms</label>
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'TikTok'].map(platform => (
                <label key={platform} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={platform}
                    checked={selectedPlatforms.includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                  />
                  {platform}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="media" className="text-sm font-medium">Media (image/video)</label>
            <input id="media" type="file" accept="image/*,video/*" onChange={handleFileChange} disabled={uploading} />
            {uploading && <div className="text-xs text-gray-500">Uploading...</div>}
            {mediaUrl && (
              <div className="mt-2">
                {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={mediaUrl} controls className="max-h-48 rounded" />
                ) : (
                  <img src={mediaUrl} alt="Media preview" className="max-h-48 rounded" />
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/dashboard/posts" className="text-sm text-gray-500">Cancel</Link>
            <button type="submit" disabled={loading} className="text-sm text-gray-500">
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 