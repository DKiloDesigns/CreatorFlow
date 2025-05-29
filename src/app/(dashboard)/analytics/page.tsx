import React from 'react'

export default function AnalyticsPage() {
  const metrics = {
    totalPosts: 24,
    totalViews: 12500,
    totalEngagements: 850,
    averageEngagementRate: '6.8%',
  }

  const platformMetrics = [
    {
      platform: 'Twitter',
      posts: 10,
      views: 5000,
      engagements: 400,
      engagementRate: '8%',
    },
    {
      platform: 'LinkedIn',
      posts: 8,
      views: 4500,
      engagements: 300,
      engagementRate: '6.7%',
    },
    {
      platform: 'Instagram',
      posts: 6,
      views: 3000,
      engagements: 150,
      engagementRate: '5%',
    },
  ]

  const topPosts = [
    {
      title: 'Getting Started with Social Media Marketing',
      platform: 'Twitter',
      views: 2500,
      engagements: 200,
      engagementRate: '8%',
    },
    {
      title: '10 Tips for Growing Your Online Presence',
      platform: 'LinkedIn',
      views: 2000,
      engagements: 150,
      engagementRate: '7.5%',
    },
    {
      title: 'Content Creation Tips',
      platform: 'Instagram',
      views: 1500,
      engagements: 100,
      engagementRate: '6.7%',
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Posts</div>
          <div className="mt-2 text-2xl font-bold">{metrics.totalPosts}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Views</div>
          <div className="mt-2 text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Total Engagements</div>
          <div className="mt-2 text-2xl font-bold">{metrics.totalEngagements.toLocaleString()}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">Avg. Engagement Rate</div>
          <div className="mt-2 text-2xl font-bold">{metrics.averageEngagementRate}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Platform Performance</h2>
        <div className="rounded-lg border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Platform</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Posts</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Views</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Engagements</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {platformMetrics.map((metric) => (
                  <tr key={metric.platform} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${metric.platform === 'Twitter' ? 'bg-blue-100 text-blue-800' :
                          metric.platform === 'LinkedIn' ? 'bg-blue-900 text-white' :
                          'bg-pink-100 text-pink-800'}`}>
                        {metric.platform}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{metric.posts}</td>
                    <td className="p-4 align-middle">{metric.views.toLocaleString()}</td>
                    <td className="p-4 align-middle">{metric.engagements.toLocaleString()}</td>
                    <td className="p-4 align-middle">{metric.engagementRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Top Performing Posts</h2>
        <div className="rounded-lg border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Title</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Platform</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Views</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Engagements</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post) => (
                  <tr key={post.title} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{post.title}</td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${post.platform === 'Twitter' ? 'bg-blue-100 text-blue-800' :
                          post.platform === 'LinkedIn' ? 'bg-blue-900 text-white' :
                          'bg-pink-100 text-pink-800'}`}>
                        {post.platform}
                      </span>
                    </td>
                    <td className="p-4 align-middle">{post.views.toLocaleString()}</td>
                    <td className="p-4 align-middle">{post.engagements.toLocaleString()}</td>
                    <td className="p-4 align-middle">{post.engagementRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 