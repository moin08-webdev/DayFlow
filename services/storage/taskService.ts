import { Task } from '../../constants/types';
import { storageClient } from './asyncStorageClient';

const TASKS_STORAGE_KEY = '@dayflow_tasks';

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review quarterly cloud infrastructure bill',
    description: 'Check AWS/GCP cost spikes and unused instances',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    category: 'Finance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Prepare slides for DayFlow architecture showcase',
    description: 'Highlight native animations, offline storage, and responsive layout',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    category: 'Work',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Book dental checkup appointment',
    description: 'Call clinic for Saturday morning slot',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    category: 'Health',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Buy organic groceries and fresh produce',
    description: 'Avocados, almond milk, greens and fruits',
    completed: false,
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Personal',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Organize desk workspace and cable management',
    description: 'Clean surface and set up wireless charging dock',
    completed: true,
    priority: 'low',
    completedAt: new Date().toISOString(),
    category: 'Home',
    createdAt: new Date().toISOString(),
  },
];

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const tasks = await storageClient.get<Task[] | null>(TASKS_STORAGE_KEY, null);
    if (!tasks || tasks.length === 0) {
      await storageClient.set(TASKS_STORAGE_KEY, DEFAULT_TASKS);
      return DEFAULT_TASKS;
    }
    return tasks;
  },

  async addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>): Promise<Task[]> {
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTask, ...tasks];
    await storageClient.set(TASKS_STORAGE_KEY, updated);
    return updated;
  },

  async toggleTask(id: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    await storageClient.set(TASKS_STORAGE_KEY, updated);
    return updated;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task[]> {
    const tasks = await this.getTasks();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    await storageClient.set(TASKS_STORAGE_KEY, updated);
    return updated;
  },

  async deleteTask(id: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    const updated = tasks.filter((t) => t.id !== id);
    await storageClient.set(TASKS_STORAGE_KEY, updated);
    return updated;
  },

  async clearCompleted(): Promise<Task[]> {
    const tasks = await this.getTasks();
    const updated = tasks.filter((t) => !t.completed);
    await storageClient.set(TASKS_STORAGE_KEY, updated);
    return updated;
  },
};
