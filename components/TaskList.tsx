'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Task } from '@/types/task'
import { TaskItem } from './TaskItem'
import { flattenTasks } from '@/lib/task-utils'

interface TaskListProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onSelectTask: (task: Task) => void
  selectedTaskId?: string
}

export function TaskList({
  tasks,
  onTasksChange,
  onSelectTask,
  selectedTaskId,
}: TaskListProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const flatTasks = flattenTasks(tasks)
    const oldIndex = flatTasks.findIndex((t) => t.id === active.id)
    const newIndex = flatTasks.findIndex((t) => t.id === over.id)

    const newFlatTasks = arrayMove(flatTasks, oldIndex, newIndex)

    // 更新顺序并保留层级结构
    const updatedItems = newFlatTasks.map((task, index) => ({
      id: task.id,
      order: index,
      parentId: task.parentId,
    }))

    try {
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems }),
      })

      // 重新获取任务列表
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        onTasksChange(data)
      }
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
    }
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const renderTaskTree = (taskList: Task[], level: number = 0): JSX.Element[] => {
    return taskList.map((task) => {
      const isExpanded = expandedTasks.has(task.id)
      const hasChildren = task.children && task.children.length > 0

      return (
        <div key={task.id}>
          <TaskItem
            task={task}
            level={level}
            isExpanded={isExpanded}
            hasChildren={hasChildren}
            onToggleExpand={() => toggleExpand(task.id)}
            onSelect={() => onSelectTask(task)}
            isSelected={selectedTaskId === task.id}
          />
          {isExpanded && hasChildren && (
            <div>{renderTaskTree(task.children, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  const flatTasks = flattenTasks(tasks)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={flatTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>暂无任务，点击上方按钮创建</p>
            </div>
          ) : (
            renderTaskTree(tasks)
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
