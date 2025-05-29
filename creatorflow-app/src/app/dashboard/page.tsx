import { getSession } from "@/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getSession()
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Welcome back, {session?.user?.name}!
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Manage your content and social accounts from one place.</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Content Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Posts</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            <div className="mt-4">
              <Link
                href="/dashboard/content"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all posts →
              </Link>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Connected Accounts</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            <div className="mt-4">
              <Link
                href="/dashboard/accounts"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Manage accounts →
              </Link>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Premium Features</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
            <div className="mt-4">
              <Link
                href="/dashboard/billing"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Upgrade plan →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features CTA */}
      <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-indigo-800">Upgrade to Premium</h3>
            <div className="mt-2 text-sm text-indigo-700">
              <p>
                Get access to advanced analytics, AI-powered content suggestions, and priority support.
                <Link href="/dashboard/billing" className="font-medium underline text-indigo-700 hover:text-indigo-600">
                  Upgrade now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 