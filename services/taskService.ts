import { supabase } from '@/lib/supabase'
import type { Task } from '@/types'

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Task[]
}
