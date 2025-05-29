import React from 'react'

export default function EditPostLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="rounded-lg border p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            <div className="h-40 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex justify-end gap-4">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
} 