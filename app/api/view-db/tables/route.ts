import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, isValidTable } from '@/lib/db-manager'
import type { DbType } from '@/lib/db-manager'

export async function GET(request: NextRequest) {
  try {
    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    if (db !== 'local' && db !== 'prod') {
      return NextResponse.json({ error: 'Invalid db param' }, { status: 400 })
    }

    const prisma = getPrismaClient(db)

    const result = await prisma.$queryRaw<
      { table_name: string }[]
    >`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name`

    const tables = result
      .map((r) => r.table_name)
      .filter((name) => isValidTable(name))

    await prisma.$disconnect()
    return NextResponse.json({ tables })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
