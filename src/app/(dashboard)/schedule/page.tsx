import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SchedulePage() {
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
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${post.platform === 'Twitter' ? 'bg-blue-100 text-blue-800' :
                        post.platform === 'LinkedIn' ? 'bg-blue-900 text-white' :
                        'bg-pink-100 text-pink-800'}`}>
                      {post.platform}
                    </span>
                  </td>
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