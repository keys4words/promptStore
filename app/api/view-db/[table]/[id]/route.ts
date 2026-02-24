import { NextRequest, NextResponse } from 'next/server'
import { getPrismaClient, isValidTable, getModelName } from '@/lib/db-manager'
import type { DbType } from '@/lib/db-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  try {
    const { table, id } = await params
    if (!isValidTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    const prisma = getPrismaClient(db)
    const modelName = getModelName(table)
    const model = (prisma as unknown as Record<string, unknown>)[modelName] as { findUnique: (opts: object) => Promise<unknown> }
    if (!model?.findUnique) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const row = await model.findUnique({ where: { id } } as object)
    await prisma.$disconnect()
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(JSON.parse(JSON.stringify(row)))
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  try {
    const { table, id } = await params
    if (!isValidTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    const body = await request.json()
    delete body.id

    const prisma = getPrismaClient(db)
    const modelName = getModelName(table)
    const model = (prisma as unknown as Record<string, unknown>)[modelName] as { update: (opts: object) => Promise<unknown> }
    if (!model?.update) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    const updated = await model.update({ where: { id }, data: body } as object)
    await prisma.$disconnect()
    return NextResponse.json(JSON.parse(JSON.stringify(updated)))
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ table: string; id: string }> }
) {
  try {
    const { table, id } = await params
    if (!isValidTable(table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 })
    }

    const db = (request.nextUrl.searchParams.get('db') || 'local') as DbType
    const prisma = getPrismaClient(db)
    const modelName = getModelName(table)
    const model = (prisma as unknown as Record<string, unknown>)[modelName] as { delete: (opts: object) => Promise<unknown> }
    if (!model?.delete) {
      await prisma.$disconnect()
      return NextResponse.json({ error: 'Table not found' }, { status: 404 })
    }

    await model.delete({ where: { id } } as object)
    await prisma.$disconnect()
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
