import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PostsPage() {
  const posts = [
    {
      id: 1,
      title: 'Getting Started with Social Media Marketing',
      status: 'Published',
      date: '2024-03-20',
    },
    {
      id: 2,
      title: '10 Tips for Growing Your Online Presence',
      status: 'Draft',
      date: '2024-03-21',
    },
    {
      id: 3,
      title: 'The Future of Digital Marketing',
      status: 'Scheduled',
      date: '2024-03-22',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
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
                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">{post.title}</td>
                  <td className="p-4 align-middle">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${post.status === 'Published' ? 'bg-green-100 text-green-800' :
                        post.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-blue-100 text-blue-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{post.date}</td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                      <Button variant="destructive" size="sm">Delete</Button>
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