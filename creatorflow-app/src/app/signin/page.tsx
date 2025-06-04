"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  // For NextAuth v4, we need to use client-side signIn
  const handleSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative bg-white dark:bg-gray-900 shadow-2xl rounded-3xl px-8 py-8 w-full max-w-md flex flex-col items-center justify-center text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-extrabold text-white drop-shadow">CF</span>
          </div>
        </div>
        {/* Heading */}
        <h1 className="text-2xl font-extrabold mb-1 text-gray-900 dark:text-white">Welcome to CreatorFlow</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300 text-base">Manage your social media like a pro</p>
        {/* Sign In Form */}
        <div className="w-full">
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md hover:shadow-lg text-base"
            aria-label="Sign in with GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
        </div>
        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to our <a href="#" className="underline hover:text-blue-500">Terms of Service</a> and <a href="#" className="underline hover:text-blue-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
} 