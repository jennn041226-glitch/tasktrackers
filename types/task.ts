export interface TaskHistory {
  id: string
  taskId: string
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  progress: number
  priority: 'high' | 'medium' | 'low'
  tags: string
  order: number
  createdAt: string
  updatedAt: string
  completedAt: string | null
  parentId: string | null
  children: Task[]
  histories: TaskHistory[]
}

export type TaskTree = Task
