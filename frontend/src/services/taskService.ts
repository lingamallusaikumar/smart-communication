import { api } from '@/lib/api';

export interface TaskData {
  id?: string;
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string;
}

export const taskService = {
  getTasks: async (): Promise<TaskData[]> => {
    const res = await api.get('/tasks');
    return res.data;
  },

  createTask: async (task: Partial<TaskData>): Promise<TaskData> => {
    const res = await api.post('/tasks', task);
    return res.data;
  },

  updateTaskStatus: async (taskId: string, status: string): Promise<TaskData> => {
    const res = await api.patch(`/tasks/${taskId}/status`, { status });
    return res.data;
  },
};
