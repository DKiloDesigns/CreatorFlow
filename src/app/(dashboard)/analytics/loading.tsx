import React from 'react'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="mt-2 h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
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
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4 align-middle">
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="rounded-lg border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </th>
                  <th className="h-12 px-4 text-left align-middle">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
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
                      <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    </td>
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