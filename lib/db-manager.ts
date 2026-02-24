import { PrismaClient } from '@prisma/client'

export type DbType = 'local' | 'prod'

const VALID_TABLES = ['users', 'categories', 'tags', 'notes', 'prompts', 'votes'] as const
const TABLE_TO_MODEL: Record<string, string> = {
  users: 'user',
  categories: 'category',
  tags: 'tag',
  notes: 'note',
  prompts: 'prompt',
  votes: 'vote',
}

export function isValidTable(name: string): name is (typeof VALID_TABLES)[number] {
  return VALID_TABLES.includes(name as (typeof VALID_TABLES)[number])
}

export function getModelName(table: string): string {
  return TABLE_TO_MODEL[table] || table
}

export function getDbUrl(db: DbType): string {
  if (db === 'prod') {
    const url = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL_PROD or DATABASE_URL not set')
    return url
  }
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL not set')
  return url
}

export function getPrismaClient(db: DbType): PrismaClient {
  const url = getDbUrl(db)
  return new PrismaClient({
    datasources: { db: { url } },
  })
}
