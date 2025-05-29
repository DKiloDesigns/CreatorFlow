// creatorflow-app/src/middleware.ts
// Keep Node.js runtime explicit for now
export const runtime = 'nodejs'; 

// Directly export auth from the *middleware-specific* config
export { auth as middleware } from "@/auth.middleware";

// Keep the matcher config
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ]
}
