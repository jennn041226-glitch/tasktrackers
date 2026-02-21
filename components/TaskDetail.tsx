'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { calculateProgress, getPriorityColor, parseTags } from '@/lib/task-utils'
import { Trash2, Plus, Tag, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskDetailProps {
  task: Task
  onTaskUpdate: () => void
}

export function TaskDetail({ task, onTaskUpdate }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [newTag, setNewTag] = useState('')
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const actualProgress = calculateProgress(task)
  const tags = parseTags(task.tags)

  const handleSave = async () => {
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTask),
      })
      setIsEditing(false)
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个任务吗？')) return
    try {
      await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const handleProgressChange = async (value: number[]) => {
    const progress = value[0]
    const completedAt = progress === 100 ? new Date().toISOString() : null

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress, completedAt }),
      })
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return
    const currentTags = parseTags(editedTask.tags)
    if (currentTags.includes(newTag.trim())) return
    const updatedTags = [...currentTags, newTag.trim()].join(',')
    setEditedTask({ ...editedTask, tags: updatedTags })
    setNewTag('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = parseTags(editedTask.tags)
    const updatedTags = currentTags.filter((t) => t !== tagToRemove).join(',')
    setEditedTask({ ...editedTask, tags: updatedTags })
  }

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newSubtaskTitle,
          parentId: task.id,
          priority: 'medium',
        }),
      })
      setNewSubtaskTitle('')
      onTaskUpdate()
    } catch (error) {
      console.error('Failed to add subtask:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              className="text-lg font-semibold"
            />
          ) : (
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>创建于 {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.completedAt && (
              <>
                <span className="mx-1">•</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  完成于 {new Date(task.completedAt).toLocaleDateString()}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                取消
              </Button>
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                编辑
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">进度</span>
          <span className={cn(
            'text-sm font-semibold',
            actualProgress === 100 ? 'text-green-600' : 'text-blue-600'
          )}>
            {actualProgress}%
          </span>
        </div>
        <Slider
          value={[task.children && task.children.length > 0 ? actualProgress : task.progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={5}
          disabled={task.children && task.children.length > 0}
        />
        {task.children && task.children.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            有子任务时进度自动计算
          </p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">优先级</label>
        {isEditing ? (
          <Select
            value={editedTask.priority}
            onValueChange={(value: 'high' | 'medium' | 'low') =>
              setEditedTask({ ...editedTask, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">高</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="low">低</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', getPriorityColor(task.priority))} />
            <span className="text-gray-700">
              {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">描述</label>
        {isEditing ? (
          <Textarea
            value={editedTask.description || ''}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            placeholder="添加任务描述..."
            rows={3}
          />
        ) : (
          <p className="text-gray-600">
            {task.description || '暂无描述'}
          </p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">标签</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
              {isEditing && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="添加标签"
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button variant="outline" size="sm" onClick={handleAddTag}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Add Subtask */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">添加子任务</label>
        <div className="flex gap-2">
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="输入子任务名称"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
          />
          <Button onClick={handleAddSubtask}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Recent History */}
      {task.histories && task.histories.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">最近更新</label>
          <div className="space-y-2">
            {task.histories.slice(0, 5).map((history) => (
              <div key={history.id} className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{getActionText(history.action)}</span>
                {history.oldValue && history.newValue && (
                  <span className="text-gray-500">
                    {history.oldValue}% → {history.newValue}%
                  </span>
                )}
                <span className="text-gray-400 ml-auto">
                  {new Date(history.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

import { CheckCircle } from 'lucide-react'

function getActionText(action: string): string {
  const map: Record<string, string> = {
    created: '创建',
    progress_updated: '更新进度',
    completed: '完成',
  }
  return map[action] || action
}
