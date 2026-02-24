/**
 * Server-side auth utilities
 * Use getServerSession for checking auth in Server Components/pages
 */
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function auth() {
  return getServerSession(authOptions)
}
