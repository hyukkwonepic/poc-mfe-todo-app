// taskStorage.ts

const STORAGE_KEY = 'tasks';

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

type TaskUpdates = Partial<Omit<Task, 'id' | 'createdAt'>>;

// Create: Add a new task
export function createTask(name: string, description: string): Task {
  const tasks = readTasks();
  const newTask: Task = {
    id: crypto.randomUUID(),
    name,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  saveTasks(tasks);
  return newTask;
}

// Read: Get all tasks
export function readTasks(): Task[] {
  const tasksJson = localStorage.getItem(STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
}

// Update: Modify an existing task
export function updateTask(id: string, updates: TaskUpdates): Task | null {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveTasks(tasks);
    return tasks[taskIndex];
  }
  return null;
}

// Delete: Remove a task
export function deleteTask(id: string): boolean {
  const tasks = readTasks();
  const updatedTasks = tasks.filter((task) => task.id !== id);
  saveTasks(updatedTasks);
  return updatedTasks.length < tasks.length;
}

// Helper function to save tasks to localStorage
function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// You can also export the STORAGE_KEY if needed elsewhere
export { STORAGE_KEY };

// Optionally, you can export the Task interface if it's needed in other files
export type { Task, TaskUpdates };
