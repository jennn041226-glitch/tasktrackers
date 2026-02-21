import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取所有任务（树形结构）
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { order: 'asc' },
      include: {
        children: true,
        histories: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    // 构建树形结构
    const buildTree = (tasks: any[], parentId: string | null = null): any[] => {
      return tasks
        .filter((task) => task.parentId === parentId)
        .map((task) => ({
          ...task,
          children: buildTree(tasks, task.id),
        }))
    }

    const taskTree = buildTree(tasks)
    return NextResponse.json(taskTree)
  } catch (error) {
    console.error('GET tasks error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// 创建新任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, tags, parentId, order } = body

    const task = await prisma.task.create({
      data: {
        title,
        description: description || '',
        priority: priority || 'medium',
        tags: tags || '',
        parentId: parentId || null,
        order: order || 0,
      },
    })

    // 创建历史记录
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        action: 'created',
        newValue: title,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('POST task error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
