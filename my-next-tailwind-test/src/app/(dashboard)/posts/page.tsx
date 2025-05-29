import React, { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(posts => posts.filter(p => p.id !== id));
    } catch (e) {
      alert('Error deleting post');
    } finally {
      setDeletingId(null);
    }
  }

  // Platform icon map
  const PLATFORM_ICONS: Record<string, ReactNode> = {
    Instagram: <span title="Instagram" className="text-pink-500">📸</span>,
    Twitter: <span title="Twitter" className="text-blue-400">🐦</span>,
    TikTok: <span title="TikTok" className="text-black">🎵</span>,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/dashboard/posts/new" className="inline-block">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors">Create Post</button>
        </Link>
      </div>

      <div className="rounded-lg border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b bg-gray-50">
              <tr className="border-b transition-colors hover:bg-gray-100">
                <th className="h-12 px-4 text-left align-middle font-semibold">Media</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Title</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Platforms</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Scheduled</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Status</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Views</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Likes</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Comments</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Date</th>
                <th className="h-12 px-4 text-left align-middle font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="p-4 text-center">Loading...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={10} className="p-4 text-center">No posts found.</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b transition-colors hover:bg-gray-50 group">
                    <td className="p-4 align-middle">
                      {post.mediaUrl ? (
                        post.mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video src={post.mediaUrl} className="h-12 w-12 object-cover rounded shadow-sm" controls />
                        ) : (
                          <img src={post.mediaUrl} alt="Media" className="h-12 w-12 object-cover rounded shadow-sm" />
                        )
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="p-4 align-middle max-w-xs truncate">{post.contentText ? post.contentText.slice(0, 40) + (post.contentText.length > 40 ? '...' : '') : '(No content)'}</td>
                    <td className="p-4 align-middle">
                      {post.platforms && post.platforms.length > 0 ? (
                        <div className="flex gap-2">
                          {post.platforms.map((platform: string) => (
                            <span key={platform} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-xs font-medium">
                              {PLATFORM_ICONS[platform] || platform}
                              <span className="sr-only">{platform}</span>
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className="p-4 align-middle whitespace-nowrap">{post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : <span className="text-xs text-gray-400">—</span>}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          post.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-center">{typeof post.views === 'number' ? post.views : 0}</td>
                    <td className="p-4 align-middle text-center">{typeof post.likes === 'number' ? post.likes : 0}</td>
                    <td className="p-4 align-middle text-center">{typeof post.comments === 'number' ? post.comments : 0}</td>
                    <td className="p-4 align-middle whitespace-nowrap">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/posts/${post.id}/edit`} className="inline-block">
                          <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100 transition-colors">Edit</button>
                        </Link>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-1 text-sm transition-colors disabled:opacity-50"
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                        >
                          {deletingId === post.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 