"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") || "";

  let errorMessage = "An unexpected error occurred";
  let errorDescription = "Please try again or contact support if the problem persists.";

  // Handle specific NextAuth error types
  if (error === "Configuration") {
    errorMessage = "Server Configuration Error";
    errorDescription = "There is a problem with the server configuration. Please contact the administrator.";
  } else if (error === "AccessDenied") {
    errorMessage = "Access Denied";
    errorDescription = "You do not have permission to sign in.";
  } else if (error === "Verification") {
    errorMessage = "Verification Error";
    errorDescription = "The verification link may have expired or already been used.";
  } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
    errorMessage = "OAuth Sign-in Error";
    errorDescription = "There was a problem with the OAuth sign-in process. Please try again.";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{errorMessage}</h2>
          <p className="mt-2 text-sm text-gray-600">{errorDescription}</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <Link
              href="/signin"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to Sign In
            </Link>
          </div>
          <div className="text-center">
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-500">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}