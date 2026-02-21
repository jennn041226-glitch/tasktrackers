'use client'

import { useState } from 'react'
import { Task } from '@/types/task'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskAdded: () => void
  tasks: Task[]
}

export function AddTaskDialog({
  open,
  onOpenChange,
  onTaskAdded,
  tasks,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [parentId, setParentId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          parentId: parentId || null,
          order: tasks.length,
        }),
      })

      if (response.ok) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setParentId('')
        onOpenChange(false)
        onTaskAdded()
      }
    } catch (error) {
      console.error('Failed to create task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Flatten tasks for parent selection
  const flattenTasks = (taskList: Task[], level: number = 0): { id: string; title: string; level: number }[] => {
    const result: { id: string; title: string; level: number }[] = []
    for (const task of taskList) {
      result.push({ id: task.id, title: task.title, level })
      if (task.children && task.children.length > 0) {
        result.push(...flattenTasks(task.children, level + 1))
      }
    }
    return result
  }

  const flatTasks = flattenTasks(tasks)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>新建任务</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              任务名称 *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务名称"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加任务描述（可选）"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              优先级
            </label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as 'high' | 'medium' | 'low')
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
          </div>

          {flatTasks.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                父任务（可选）
              </label>
              <Select
                value={parentId}
                onValueChange={setParentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="作为顶级任务" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">作为顶级任务</SelectItem>
                  {flatTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {'　'.repeat(task.level)}{task.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? '创建中...' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
