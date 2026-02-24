import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, isValidTable, getModelName } from '@/lib/db-manager'
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
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '10')))

    const prisma = getPrismaClient(db)
    const skip = (page - 1) * limit
    const modelName = getModelName(table)

    const model = (prisma as unknown as Record<string, unknown>)[modelName] as { findMany: (opts: object) => Promise<unknown[]>; count: () => Promise<number> }
    if (!model?.findMany) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const [rows, total] = await Promise.all([
      model.findMany({ take: limit, skip } as object),
      (model as { count: () => Promise<number> }).count(),
    ])

    await prisma.$disconnect()
    return NextResponse.json({
      rows: rows.map((r) => (r && typeof r === 'object' ? JSON.parse(JSON.stringify(r)) : r)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table } = await params
    if (!isValidTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    const body = await request.json()

    const prisma = getPrismaClient(db)
    const modelName = getModelName(table)
    const model = (prisma as unknown as Record<string, unknown>)[modelName] as { create: (opts: { data: object }) => Promise<unknown> }
    if (!model?.create) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const created = await model.create({ data: body })
    await prisma.$disconnect()
    return NextResponse.json(JSON.parse(JSON.stringify(created)))
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
