"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Content management state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
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

  // Calculate stats
  const totalPosts = posts.length;
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED").length;
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;
  // Engagement is a placeholder for now
  const engagement = "--";

  // Recent activity: show 3 most recent posts
  const recentActivity = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)
    .map((post) => ({
      title: post.status === "PUBLISHED" ? "Post published" : post.status === "SCHEDULED" ? "Post scheduled" : "Post updated",
      description: post.contentText ? post.contentText.slice(0, 60) + (post.contentText.length > 60 ? "..." : "") : "(No content)",
      time: new Date(post.createdAt).toLocaleString(),
    }));

  return (
    <div className="space-y-8 p-8 max-w-4xl mx-auto">
      {/* Welcome section */}
      <div className="flex items-center gap-4">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-12 h-12 rounded-full border"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 border">
            {user?.name ? user.name[0] : "?"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!</h1>
          <p className="text-muted-foreground">Here's an overview of your content performance</p>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Total Posts</p>
          <h2 className="text-3xl font-bold mt-2">{totalPosts}</h2>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Scheduled</p>
          <h2 className="text-3xl font-bold mt-2">{scheduledPosts}</h2>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Published</p>
          <h2 className="text-3xl font-bold mt-2">{publishedPosts}</h2>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm flex flex-col items-center">
          <p className="text-sm font-medium text-gray-500">Engagement</p>
          <h2 className="text-3xl font-bold mt-2">{engagement}</h2>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="p-4">
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 