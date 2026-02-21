import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新任务
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, progress, priority, tags, parentId, order, completedAt } = body

    // 获取旧任务数据用于历史记录
    const oldTask = await prisma.task.findUnique({ where: { id } })
    if (!oldTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: title !== undefined ? title : oldTask.title,
        description: description !== undefined ? description : oldTask.description,
        progress: progress !== undefined ? progress : oldTask.progress,
        priority: priority !== undefined ? priority : oldTask.priority,
        tags: tags !== undefined ? tags : oldTask.tags,
        parentId: parentId !== undefined ? parentId : oldTask.parentId,
        order: order !== undefined ? order : oldTask.order,
        completedAt: completedAt !== undefined ? completedAt : oldTask.completedAt,
      },
    })

    // 记录进度变更历史
    if (progress !== undefined && progress !== oldTask.progress) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          action: 'progress_updated',
          oldValue: String(oldTask.progress),
          newValue: String(progress),
        },
      })
    }

    // 记录完成历史
    if (completedAt && !oldTask.completedAt) {
      await prisma.taskHistory.create({
        data: {
          taskId: id,
          action: 'completed',
          newValue: title || oldTask.title,
        },
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('PUT task error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

// 删除任务
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE task error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
