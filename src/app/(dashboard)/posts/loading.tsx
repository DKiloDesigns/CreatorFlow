import React from 'react'

export default function PostsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="rounded-lg border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="border-b">
                <th className="h-12 px-4 text-left align-middle">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="h-12 px-4 text-left align-middle">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="h-12 px-4 text-left align-middle">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </th>
                <th className="h-12 px-4 text-left align-middle">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b">
                  <td className="p-4 align-middle">
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
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