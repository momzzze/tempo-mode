import { api } from './client';

export interface Task {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  estimatedPomodoros: number;
  completedPomodoros: number;
  rewardPoints: number;
  streakDays: number;
  status: 'active' | 'completed' | 'archived' | 'deleted';
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  estimatedPomodoros?: number;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  estimatedPomodoros?: number;
  completedPomodoros?: number;
  status?: 'active' | 'completed' | 'archived' | 'deleted';
  dueDate?: string;
}

// Get all tasks
export async function getTasks(): Promise<Task[]> {
  const response = await api.get<{ tasks: Task[] }>('/api/tasks');
  return response.tasks;
}

// Create a new task
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await api.post<{ task: Task }>('/api/tasks', input);
  return response.task;
}

// Update a task
export async function updateTask(
  taskId: number,
  input: UpdateTaskInput
): Promise<Task> {
  const response = await api.put<{ task: Task }>(`/api/tasks/${taskId}`, input);
  return response.task;
}

// Set active task
export async function setActiveTask(taskId: number): Promise<Task> {
  const response = await api.post<{ task: Task }>(
    `/api/tasks/${taskId}/active`,
    {}
  );
  return response.task;
}

// Complete a task
export async function completeTask(taskId: number): Promise<Task> {
  const response = await api.post<{ task: Task }>(
    `/api/tasks/${taskId}/complete`,
    {}
  );
  return response.task;
}

// Delete a task
export async function deleteTask(taskId: number): Promise<void> {
  await api.delete<{ success: boolean }>(`/api/tasks/${taskId}`);
}

// Increment pomodoro count
export async function incrementPomodoro(taskId: number): Promise<Task> {
  const response = await api.post<{ task: Task }>(
    `/api/tasks/${taskId}/pomodoro`,
    {}
  );
  return response.task;
}
