'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types/task'
import { TaskList } from '@/components/TaskList'
import { TaskDetail } from '@/components/TaskDetail'
import { AddTaskDialog } from '@/components/AddTaskDialog'
import { Button } from '@/components/ui/button'
import { Plus, Layout, History } from 'lucide-react'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [view, setView] = useState<'tasks' | 'history'>('tasks')

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">TaskTracker</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'tasks' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('tasks')}
            >
              <Layout className="w-4 h-4 mr-2" />
              任务
            </Button>
            <Button
              variant={view === 'history' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('history')}
            >
              <History className="w-4 h-4 mr-2" />
              历史
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              新建任务
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === 'tasks' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-sm font-medium text-gray-500 mb-4">任务列表</h2>
              <TaskList
                tasks={tasks}
                onTasksChange={setTasks}
                onSelectTask={setSelectedTask}
                selectedTaskId={selectedTask?.id}
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {selectedTask ? (
                <TaskDetail
                  task={selectedTask}
                  onTaskUpdate={fetchTasks}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Layout className="w-12 h-12 mb-4" />
                  <p>选择一个任务查看详情</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <HistoryView tasks={tasks} />
        )}
      </main>

      <AddTaskDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onTaskAdded={fetchTasks}
        tasks={tasks}
      />
    </div>
  )
}

function HistoryView({ tasks }: { tasks: Task[] }) {
  const allHistories = tasks
    .flatMap((t) => t.histories.map((h) => ({ ...h, taskTitle: t.title })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">任务历史记录</h2>
      {allHistories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无历史记录</p>
      ) : (
        <div className="space-y-3">
          {allHistories.map((history) => (
            <div
              key={history.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{history.taskTitle}</p>
                <p className="text-sm text-gray-500">
                  {getActionText(history.action)}
                  {history.oldValue && history.newValue && (
                    <span>
                      {' '}
                      从 {history.oldValue}% 到 {history.newValue}%
                    </span>
                  )}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {new Date(history.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getActionText(action: string): string {
  const map: Record<string, string> = {
    created: '创建任务',
    progress_updated: '更新进度',
    completed: '完成任务',
  }
  return map[action] || action
}
