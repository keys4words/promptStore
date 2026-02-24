/**
 * Middleware: protect /dashboard and /my-prompts
 * Redirects unauthenticated users to /login
 */
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/login' },
})

export const config = {
  matcher: ['/dashboard/:path*', '/my-prompts/:path*'],
}
