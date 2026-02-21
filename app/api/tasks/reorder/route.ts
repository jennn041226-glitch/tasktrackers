import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 批量更新任务顺序
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body as { items: { id: string; order: number; parentId: string | null }[] }

    // 使用事务批量更新
    await prisma.$transaction(
      items.map((item) =>
        prisma.task.update({
          where: { id: item.id },
          data: {
            order: item.order,
            parentId: item.parentId,
          },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reorder tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to reorder tasks' },
      { status: 500 }
    )
  }
}
