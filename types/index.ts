export type TaskStatus = 'pending' | 'in_progress' | 'done'
export type TaskType = 'task' | 'event' | 'reminder'

export interface Project {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'
export type TaskRecurrence = 'daily' | 'weekly' | 'monthly'

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  screenshot_url: string | null
  date: string | null
  time: string | null
  location: string | null
  type: TaskType
  project_id: string | null
  priority: TaskPriority | null
  recurrence: TaskRecurrence | null
  recurrence_paused: boolean | null
  share_token: string | null
  subtasks: Subtask[] | null
  created_at: string
  updated_at: string
}

export interface ParsedTask {
  title: string
  date: string | null
  time: string | null
  location: string | null
  type: TaskType
  priority?: TaskPriority | null
}

export interface TaskStore {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  setTasks: (tasks: Task[]) => void
}
