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
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Content</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Platforms</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Scheduled / Published</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 max-w-xs truncate">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{post.contentText || <span className="italic text-gray-400">(No content)</span>}</span>
                </div>
              </td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[post.status] || 'bg-gray-100 text-gray-700'}`}>{post.status}</span>
              </td>
              <td className="px-4 py-2">
                {post.platforms && post.platforms.length > 0 ? (
                  <div className="flex gap-1 flex-wrap">
                    {post.platforms.map((p) => (
                      <span key={p} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{p}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-2 text-xs">
                {post.scheduledAt ? (
                  <div>
                    <span className="block text-blue-700">Scheduled</span>
                    <span>{new Date(post.scheduledAt).toLocaleString()}</span>
                  </div>
                ) : post.publishedAt ? (
                  <div>
                    <span className="block text-green-700">Published</span>
                    <span>{new Date(post.publishedAt).toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(post)} title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDuplicate(post)} title="Duplicate">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(post)} title="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
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