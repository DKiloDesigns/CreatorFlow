"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your content performance
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Posts
              </p>
              <h2 className="text-3xl font-bold">12</h2>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Scheduled
              </p>
              <h2 className="text-3xl font-bold">4</h2>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Published
              </p>
              <h2 className="text-3xl font-bold">8</h2>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Engagement
              </p>
              <h2 className="text-3xl font-bold">89%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="rounded-lg border">
          <div className="p-4">
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Post published</p>
                    <p className="text-sm text-muted-foreground">
                      Your post "Getting Started with Social Media Marketing" was published.
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">2h ago</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 