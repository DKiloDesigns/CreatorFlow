import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash2, Copy } from 'lucide-react';

interface Post {
  id: string;
  contentText?: string;
  status: string;
  platforms: string[];
  scheduledAt?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentTableProps {
  posts: Post[];
  loading: boolean;
  error: any;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onDuplicate: (post: Post) => void;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-200 text-gray-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  PUBLISHING: 'bg-yellow-100 text-yellow-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
};

export default function ContentTable({ posts, loading, error, onEdit, onDelete, onDuplicate }: ContentTableProps) {
  if (loading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error loading posts.</div>;
  if (!posts || posts.length === 0) return <div className="py-8 text-center text-muted-foreground">No content found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Content</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Platforms</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Scheduled / Published</th>
            <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t hover:bg-gray-50">
              <td className="px-2 sm:px-4 py-3">
                <div className="max-w-xs sm:max-w-md">
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {post.contentText || 'No content'}
                  </p>
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[post.status] || 'bg-gray-100 text-gray-700'}`}>
                  {post.status}
                </span>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {platform}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="text-xs text-gray-600">
                  {post.scheduledAt && (
                    <div>Scheduled: {new Date(post.scheduledAt).toLocaleDateString()}</div>
                  )}
                  {post.publishedAt && (
                    <div>Published: {new Date(post.publishedAt).toLocaleDateString()}</div>
                  )}
                </div>
              </td>
              <td className="px-2 sm:px-4 py-3">
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(post)}
                    className="h-8 w-8 sm:h-8 sm:w-auto p-0 sm:px-2 sm:py-1 min-w-[44px] min-h-[44px]"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicate(post)}
                    className="h-8 w-8 sm:h-8 sm:w-auto p-0 sm:px-2 sm:py-1 min-w-[44px] min-h-[44px]"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Duplicate</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(post)}
                    className="h-8 w-8 sm:h-8 sm:w-auto p-0 sm:px-2 sm:py-1 min-w-[44px] min-h-[44px] text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-1">Delete</span>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 