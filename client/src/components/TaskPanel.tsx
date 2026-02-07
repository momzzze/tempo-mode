import { useEffect, useRef, useState } from 'react';
import {
  ListTodo,
  Plus,
  Trophy,
  Zap,
  Target,
  Check,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store';
import * as taskApi from '@/api/tasks';
import type { Task } from '@/api/tasks';
import './TaskPanel.css';

const PRIORITY_COLORS = {
  low: '#64748b',
  medium: '#f59e0b',
  high: '#f97316',
  urgent: '#ef4444',
};

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent!',
};

interface TaskPanelProps {
  onTaskComplete?: (task: Task) => void;
}

export function TaskPanel({ onTaskComplete }: TaskPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<
    'low' | 'medium' | 'high' | 'urgent'
  >('medium');
  const [selectedCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAppSelector((state) => state.user);

  // Fetch tasks on mount
  useEffect(() => {
    if (isOpen && auth.user?.id) {
      loadTasks();
    }
  }, [isOpen, auth.user?.id]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await taskApi.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTaskInput.trim() || !auth.user) return;

    try {
      const newTask = await taskApi.createTask({
        title: newTaskInput.trim(),
        priority: selectedPriority,
        category: selectedCategory,
        estimatedPomodoros: 1,
      });

      setTasks([...tasks, newTask]);
      setNewTaskInput('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleSetActive = async (task: Task) => {
    if (!auth.user) return;

    try {
      const updatedTask = await taskApi.setActiveTask(task.id);
      setTasks(
        tasks.map((t) => ({
          ...t,
          isActive: t.id === updatedTask.id,
        }))
      );
    } catch (error) {
      console.error('Failed to set active task:', error);
    }
  };

  const handleCompleteTask = async (task: Task) => {
    if (!auth.user) return;

    try {
      const completedTask = await taskApi.completeTask(task.id);
      setTasks(
        tasks.map((t) => (t.id === completedTask.id ? completedTask : t))
      );
      onTaskComplete?.(completedTask);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!auth.user) return;

    try {
      await taskApi.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const activeTasks = tasks.filter((t) => t.status === 'active');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const activeTask = activeTasks.find((t) => t.isActive);

  const totalRewardPoints = tasks.reduce((sum, t) => sum + t.rewardPoints, 0);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="stats-item__button"
        title="Tasks"
        type="button"
      >
        <ListTodo size={24} />
        {activeTask && <span className="task-badge">{activeTasks.length}</span>}
      </button>

      {isOpen && (
        <div className="task-panel task-panel__card">
          {/* Header with gamification */}
          <div className="task-panel__header">
            <div className="task-panel__title">
              <ListTodo size={20} />
              <span>Your Tasks</span>
            </div>
            {auth.user && (
              <div className="task-panel__rewards">
                <Trophy size={16} />
                <span>{totalRewardPoints} pts</span>
              </div>
            )}
          </div>

          {/* Active task highlight */}
          {activeTask && (
            <div className="task-panel__active-task">
              <div className="task-panel__active-indicator">
                <Zap size={16} />
                <span>Focus Mode</span>
              </div>
              <div className="task-panel__active-title">{activeTask.title}</div>
              <div className="task-panel__active-progress">
                <div className="task-panel__tomatoes">
                  {Array.from({ length: activeTask.estimatedPomodoros }).map(
                    (_, i) => (
                      <span
                        key={i}
                        className={`task-panel__tomato ${
                          i < activeTask.completedPomodoros ? 'completed' : ''
                        }`}
                      >
                        🍅
                      </span>
                    )
                  )}
                </div>
                <span className="task-panel__progress-text">
                  {activeTask.completedPomodoros}/
                  {activeTask.estimatedPomodoros} pomodoros
                </span>
              </div>
            </div>
          )}

          {/* Tasks list */}
          <div className="task-panel__content">
            {!auth.user ? (
              <div className="task-panel__empty">
                <p>Login to save and sync your tasks</p>
              </div>
            ) : isLoading ? (
              <div className="task-panel__loading">Loading tasks...</div>
            ) : activeTasks.length === 0 && completedTasks.length === 0 ? (
              <div className="task-panel__empty">
                <Target size={32} opacity={0.3} />
                <p>No tasks yet</p>
                <p className="task-panel__empty-subtitle">
                  Add your first task below!
                </p>
              </div>
            ) : (
              <div className="task-panel__list">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-panel__item ${
                      task.isActive ? 'task-panel__item--active' : ''
                    }`}
                    onClick={() => handleSetActive(task)}
                  >
                    <div
                      className="task-panel__priority-indicator"
                      style={{
                        backgroundColor: PRIORITY_COLORS[task.priority],
                      }}
                      title={PRIORITY_LABELS[task.priority]}
                    />
                    <div className="task-panel__item-content">
                      <div className="task-panel__item-text" title={task.title}>
                        {task.title}
                      </div>
                      {task.category !== 'general' && (
                        <span className="task-panel__category">
                          {task.category}
                        </span>
                      )}
                      <div className="task-panel__item-meta">
                        <span className="task-panel__pomodoros">
                          🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
                        </span>
                        {task.rewardPoints > 0 && (
                          <span className="task-panel__points">
                            +{task.rewardPoints} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="task-panel__item-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteTask(task);
                        }}
                        className="task-panel__action-button task-panel__action-complete"
                        title="Complete task"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="task-panel__action-button task-panel__action-delete"
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {completedTasks.length > 0 && (
                  <div className="task-panel__completed-section">
                    <div className="task-panel__completed-header">
                      <Check size={16} />
                      <span>Completed ({completedTasks.length})</span>
                    </div>
                    {completedTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="task-panel__item task-panel__item--completed"
                      >
                        <div className="task-panel__item-text completed">
                          {task.title}
                        </div>
                        {task.rewardPoints > 0 && (
                          <span className="task-panel__points">
                            +{task.rewardPoints} pts
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add new task */}
          {auth.user && (
            <div className="task-panel__footer">
              <div className="task-panel__input-row">
                <Input
                  ref={inputRef}
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What are you working on?"
                  className="task-panel__input"
                />
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as any)}
                  className="task-panel__priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <Button
                onClick={handleAddTask}
                className="task-panel__add"
                type="button"
              >
                <Plus size={16} />
                Add Task
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
