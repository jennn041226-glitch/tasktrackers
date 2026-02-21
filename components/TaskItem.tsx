'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types/task'
import { calculateProgress, getPriorityColor, parseTags, getTotalSubtaskCount, getCompletedSubtaskCount } from '@/lib/task-utils'
import { ChevronRight, ChevronDown, GripVertical, Circle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  level: number
  isExpanded: boolean
  hasChildren: boolean
  onToggleExpand: () => void
  onSelect: () => void
  isSelected: boolean
}

export function TaskItem({
  task,
  level,
  isExpanded,
  hasChildren,
  onToggleExpand,
  onSelect,
  isSelected,
}: TaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const actualProgress = calculateProgress(task)
  const tags = parseTags(task.tags)
  const totalSubtasks = getTotalSubtaskCount(task)
  const completedSubtasks = getCompletedSubtaskCount(task)
  const isCompleted = actualProgress === 100

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all',
        'hover:bg-gray-100',
        isSelected && 'bg-blue-50 hover:bg-blue-100 ring-1 ring-blue-200',
        isDragging && 'opacity-50 shadow-lg',
        level > 0 && 'ml-6 border-l-2 border-gray-200 pl-4'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Expand/Collapse */}
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
          className="p-1 hover:bg-gray-200 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
      ) : (
        <div className="w-6" />
      )}

      {/* Completion Status */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300" />
        )}
      </div>

      {/* Task Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium truncate',
            isCompleted && 'text-gray-500 line-through'
          )}>
            {task.title}
          </span>

          {/* Priority Badge */}
          <div className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            getPriorityColor(task.priority)
          )} />
        </div>

        {/* Progress Bar */}
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              )}
              style={{ width: `${actualProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-10 text-right">
            {actualProgress}%
          </span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex gap-1 flex-shrink-0">
          {tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
            >
              {tag}
            </span>
          ))}
          {tags.length > 2 && (
            <span className="px-1.5 py-0.5 text-xs text-gray-400">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Subtask Count */}
      {hasChildren && (
        <div className="text-xs text-gray-400 flex-shrink-0">
          {completedSubtasks}/{totalSubtasks}
        </div>
      )}
    </div>
  )
}
