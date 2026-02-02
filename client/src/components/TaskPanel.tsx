import { useEffect, useRef, useState } from 'react';
import { ListTodo, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import './TaskPanel.css';

interface TaskPanelProps {
  tasks: string[];
  activeIndex: number;
  onAddTask: (title: string) => void;
  onRemoveTask: (index: number) => void;
  onSetActiveTask: (index: number) => void;
  showLabel?: boolean;
}

export function TaskPanel({
  tasks,
  activeIndex,
  onAddTask,
  onRemoveTask,
  onSetActiveTask,
  showLabel = true,
}: TaskPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTaskInput, setNewTaskInput] = useState('');
  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleAddTask = () => {
    if (newTaskInput.trim()) {
      onAddTask(newTaskInput);
      setNewTaskInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="stats-item__button"
        title="Tasks"
        type="button"
      >
        <ListTodo size={24} />
      </button>

      {isOpen && (
        <div className="task-panel task-panel__card">
          <div className="task-panel__title">Your Tasks</div>

          <div className="task-panel__content task-panel__list">
            {/* Tasks list */}
            {tasks.length > 0 && (
              <div className="task-panel__list-inner">
                {tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`task-panel__item ${
                      idx === activeIndex ? 'task-panel__item--active' : ''
                    }`}
                    onClick={() => onSetActiveTask(idx)}
                  >
                    <div className="task-panel__item-text" title={task}>
                      {task}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTask(idx);
                      }}
                      className="task-panel__remove"
                      type="button"
                      aria-label="Remove task"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tasks.length === 0 && (
              <p className="task-panel__empty">No tasks yet</p>
            )}
          </div>

          {/* Add new task input */}
          <div className="task-panel__footer">
            <Input
              ref={inputRef}
              value={newTaskInput}
              onChange={(e) => setNewTaskInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="task-panel__input"
            />
            <button
              onClick={handleAddTask}
              className="task-panel__add"
              type="button"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
