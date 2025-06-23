"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });
    if (res && res.error) setError("Invalid credentials");
    else if (res && res.ok) window.location.href = "/dashboard";
  }

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
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md hover:shadow-lg text-base"
            aria-label="Sign in with GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors duration-200 shadow-md mb-3"
            aria-label="Sign in with Google"
          >
            <img src="/google.svg" alt="Google" className="h-5 w-5" />
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#1877F3] text-white rounded-lg font-semibold hover:bg-[#145db2] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md hover:shadow-lg text-base"
            aria-label="Sign in with Facebook"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            Sign in with Facebook
          </button>
          <button
            type="button"
            onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-md hover:shadow-lg text-base"
            aria-label="Sign in with Apple"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07 0-1.14.93-2.07 2.07-2.07 1.14 0 2.07.93 2.07 2.07zm4.7 6.13c-.13-.13-.27-.25-.41-.36-.14-.11-.29-.21-.44-.3-.15-.09-.31-.17-.47-.24-.16-.07-.33-.13-.5-.18-.17-.05-.34-.09-.52-.12-.18-.03-.36-.05-.54-.05-.18 0-.36.02-.54.05-.18.03-.35.07-.52.12-.17.05-.34.11-.5.18-.16.07-.32.15-.47.24-.15.09-.3.19-.44.3-.14.11-.28.23-.41.36-.13.13-.25.27-.36.41-.11.14-.21.29-.3.44-.09.15-.17.31-.24.47-.07.16-.13.33-.18.5-.05.17-.09.34-.12.52-.03.18-.05.36-.05.54 0 .18.02.36.05.54.03.18.07.35.12.52.05.17.11.34.18.5.07.16.15.32.24.47.09.15.19.3.3.44.11.14.23.28.36.41.13.13.27.25.41.36.14.11.29.21.44.3.15.09.31.17.47.24.16.07.33.13.5.18.17.05.34.09.52.12.18.03.36.05.54.05.18 0 .36-.02.54-.05.18-.03.35-.07.52-.12.17-.05.34-.11.5-.18.16-.07.32-.15.47-.24.15-.09.3-.19.44-.3.14-.11.28-.23.41-.36.13-.13.25-.27.36-.41.11-.14.21-.29.3-.44.09-.15.17-.31.24-.47.07-.16.13-.33.18-.5.05-.17.09-.34.12-.52.03-.18.05-.36.05-.54 0-.18-.02-.36-.05-.54-.03-.18-.07-.35-.12-.52-.05-.17-.11-.34-.18-.5-.07-.16-.15-.32-.24-.47-.09-.15-.19-.3-.3-.44-.11-.14-.23-.28-.36-.41zm-4.7 15.44c-2.13 0-4.13-.82-5.64-2.32-1.51-1.5-2.32-3.51-2.32-5.64 0-2.13.82-4.13 2.32-5.64 1.5-1.51 3.51-2.32 5.64-2.32 2.13 0 4.13.82 5.64 2.32 1.51 1.5 2.32 3.51 2.32 5.64 0 2.13-.82 4.13-2.32 5.64-1.5 1.51-3.51 2.32-5.64 2.32z"/></svg>
            Sign in with Apple
          </button>
        </div>
        {/* Credentials Sign In Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 mt-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button type="submit" className="w-full py-2 px-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">
            Sign in with Email
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to our <a href="#" className="underline hover:text-blue-500">Terms of Service</a> and <a href="#" className="underline hover:text-blue-500">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
} 