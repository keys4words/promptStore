/**
 * Extend NextAuth session types
 * session.user.id — stable userId for the logged-in user
 */
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
