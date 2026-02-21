import { Task } from '@/types/task'

// 计算任务的实际进度（基于子任务）
export function calculateProgress(task: Task): number {
  if (!task.children || task.children.length === 0) {
    return task.progress
  }

  const totalProgress = task.children.reduce((sum, child) => {
    return sum + calculateProgress(child)
  }, 0)

  return Math.round(totalProgress / task.children.length)
}

// 获取所有子任务数量
export function getTotalSubtaskCount(task: Task): number {
  if (!task.children || task.children.length === 0) {
    return 0
  }

  let count = task.children.length
  for (const child of task.children) {
    count += getTotalSubtaskCount(child)
  }
  return count
}

// 获取已完成的子任务数量
export function getCompletedSubtaskCount(task: Task): number {
  if (!task.children || task.children.length === 0) {
    return task.progress === 100 ? 1 : 0
  }

  let count = 0
  for (const child of task.children) {
    if (child.children && child.children.length > 0) {
      count += getCompletedSubtaskCount(child)
    } else if (child.progress === 100) {
      count += 1
    }
  }
  return count
}

// 解析标签
export function parseTags(tagsString: string): string[] {
  if (!tagsString) return []
  return tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
}

// 获取优先级颜色
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

// 扁平化任务树
export function flattenTasks(tasks: Task[]): Task[] {
  const result: Task[] = []

  function traverse(task: Task) {
    result.push(task)
    if (task.children) {
      for (const child of task.children) {
        traverse(child)
      }
    }
  }

  for (const task of tasks) {
    traverse(task)
  }

  return result
}
