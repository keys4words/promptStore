/**
 * NextAuth v4 configuration
 * Google OAuth + Prisma adapter, database sessions
 */
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        (session.user as { id: string }).id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  // AUTH_SECRET or NEXTAUTH_SECRET must be set in production (e.g. Vercel env vars)
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
}
