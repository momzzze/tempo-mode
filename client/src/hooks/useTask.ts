import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tempo-mode-tasks';

type TaskState = {
  tasks: string[];
  activeIndex: number;
};

const loadTaskState = (): TaskState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { tasks: [], activeIndex: 0 };
    const parsed = JSON.parse(saved) as TaskState;
    return {
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      activeIndex:
        typeof parsed.activeIndex === 'number' ? parsed.activeIndex : 0,
    };
  } catch {
    return { tasks: [], activeIndex: 0 };
  }
};

export function useTask() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loaded = loadTaskState();
    setTasks(loaded.tasks);
    setActiveIndex(Math.min(loaded.activeIndex, loaded.tasks.length - 1));
  }, []);

  useEffect(() => {
    const state: TaskState = { tasks, activeIndex };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [tasks, activeIndex]);

  const addTask = (title: string) => {
    if (title.trim()) {
      setTasks([...tasks, title]);
    }
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    if (activeIndex >= newTasks.length) {
      setActiveIndex(Math.max(0, newTasks.length - 1));
    }
  };

  const updateTask = (index: number, title: string) => {
    const newTasks = [...tasks];
    newTasks[index] = title;
    setTasks(newTasks);
  };

  const activeTask = tasks[activeIndex] ?? '';

  return {
    tasks,
    activeTask,
    activeIndex,
    setActiveIndex,
    addTask,
    removeTask,
    updateTask,
  };
}
