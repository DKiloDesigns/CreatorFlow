import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../../components/ui/button'

export default function SchedulePage() {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const scheduledPosts = [
    {
      id: 1,
      title: 'The Future of Digital Marketing',
      date: '2024-03-22 10:00 AM',
      platform: 'Twitter',
    },
    {
      id: 2,
      title: 'Social Media Strategy Guide',
      date: '2024-03-23 2:00 PM',
      platform: 'LinkedIn',
    },
    {
      id: 3,
      title: 'Content Creation Tips',
      date: '2024-03-24 11:30 AM',
      platform: 'Instagram',
    },
  ]

  function handleDelete(postId: number) {
    if (window.confirm('Are you sure you want to delete this scheduled post? This action cannot be undone.')) {
      setDeletingId(postId);
      setTimeout(() => {
        // Simulate async delete
        setDeletingId(null);
        // TODO REMOVED: Remove post from state or refetch. Implement if/when post deletion is added.
      }, 1200);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <Button asChild>
          <Link href="/posts/new">Create Post</Link>
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Platform</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledPosts.map((post) => (
                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{post.title}</td>
                  <td className="p-4 align-middle">{post.date}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${post.platform === 'Twitter' ? 'bg-blue-100 text-blue-800' :
                          post.platform === 'LinkedIn' ? 'bg-blue-900 text-white' :
                          'bg-pink-100 text-pink-800'}`}
                      aria-label={`Platform: ${post.platform}`}
                    >
                      {post.platform}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild aria-label="Edit scheduled post">
                        <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label="Delete scheduled post"
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
                        className="focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        {deletingId === post.id ? (
                          <svg className="animate-spin h-4 w-4 mr-1 inline" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                        ) : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 