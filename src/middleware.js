import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|css|js)).*)',
    '/(api|trpc)(.*)',
  ],
}
