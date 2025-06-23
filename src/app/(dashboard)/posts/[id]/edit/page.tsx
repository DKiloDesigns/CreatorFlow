import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-200 text-gray-800';
  if (status === 'published') color = 'bg-green-100 text-green-800';
  else if (status === 'scheduled') color = 'bg-blue-100 text-blue-800';
  else if (status === 'publishing') color = 'bg-yellow-100 text-yellow-800';
  else if (status === 'failed') color = 'bg-red-100 text-red-800';
  return (
    <span className={`inline-block rounded px-2 py-1 text-xs font-semibold ${color}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
  );
}

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  // This would normally fetch the post data from an API
  const post = {
    id: parseInt(params.id),
    title: 'Getting Started with Social Media Marketing',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    status: 'published', // could be 'scheduled', 'publishing', 'failed', etc.
    errorMessage: '', // e.g. 'Failed to publish to Twitter'
    scheduledAt: '2025-06-10T12:00:00Z',
    publishedAt: '2025-06-10T12:01:00Z',
    failedAt: '',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Button variant="outline" asChild>
          <Link href="/posts">Cancel</Link>
        </Button>
      </div>

      <div className="rounded-lg border p-6 space-y-4">
        {/* Status and error display */}
        <div className="flex items-center gap-4">
          <StatusBadge status={post.status} />
          {post.status === 'scheduled' && post.scheduledAt && (
            <span className="text-xs text-blue-700">Scheduled for: {new Date(post.scheduledAt).toLocaleString()}</span>
          )}
          {post.status === 'published' && post.publishedAt && (
            <span className="text-xs text-green-700">Published at: {new Date(post.publishedAt).toLocaleString()}</span>
          )}
          {post.status === 'failed' && post.failedAt && (
            <span className="text-xs text-red-700">Failed at: {new Date(post.failedAt).toLocaleString()}</span>
          )}
        </div>
        {post.errorMessage && (
          <div className="rounded bg-red-100 text-red-800 px-3 py-2 text-xs font-medium mt-2">
            Error: {post.errorMessage}
          </div>
        )}

        <form className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full rounded-md border px-3 py-2"
              defaultValue={post.title}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              rows={10}
              className="w-full rounded-md border px-3 py-2"
              defaultValue={post.content}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              className="w-full rounded-md border px-3 py-2"
              defaultValue={post.status}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="publishing">Publishing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/posts">Cancel</Link>
            </Button>
            <Button type="submit">Update Post</Button>
          </div>
        </form>
      </div>
    </div>
  )
} 