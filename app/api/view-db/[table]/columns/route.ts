import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, isValidTable } from '@/lib/db-manager'
import type { DbType } from '@/lib/db-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await params
    if (!isValidTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    const prisma = getPrismaClient(db)

    const result = await prisma.$queryRaw<
      { column_name: string; data_type: string }[]
    >`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = ${table}
      ORDER BY ordinal_position
    `

    await prisma.$disconnect()
    return NextResponse.json({ columns: result.map((r) => r.column_name) })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
