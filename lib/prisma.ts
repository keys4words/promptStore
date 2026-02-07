import 'dotenv/config'
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@prisma/client'
import ws from 'ws'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Enable WebSocket for Neon serverless driver in Node.js
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter })
