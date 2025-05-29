import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    status: 'published',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Button variant="outline" asChild>
          <Link href="/posts">Cancel</Link>
        </Button>
      </div>

      <div className="rounded-lg border p-6">
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