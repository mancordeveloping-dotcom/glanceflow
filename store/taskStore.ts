import { create } from 'zustand'
import type { Task, TaskStore } from '@/types'

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  addTask: (task: Task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (id: string, updates: Partial<Task>) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  removeTask: (id: string) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  setTasks: (tasks: Task[]) => set({ tasks }),
}))
