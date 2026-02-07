import { Request, Response } from 'express';
import { TaskService } from '../services/taskService.js';
import logger from '../utils/logger.js';

export class TaskController {
  // Get all tasks for the authenticated user
  static async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      const tasks = await TaskService.getUserTasks(userId);
      res.json({ tasks });
    } catch (error) {
      logger.error({ error }, 'Error fetching tasks');
      res.status(500).json({ error: { message: 'Failed to fetch tasks' } });
    }
  }

  // Create a new task
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      const {
        title,
        description,
        category,
        priority,
        tags,
        estimatedPomodoros,
        dueDate,
      } = req.body;

      if (!title || title.trim().length === 0) {
        res.status(400).json({ error: { message: 'Title is required' } });
        return;
      }

      const task = await TaskService.createTask({
        userId,
        title: title.trim(),
        description,
        category,
        priority,
        tags,
        estimatedPomodoros,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });

      res.status(201).json({ task });
    } catch (error) {
      logger.error({ error }, 'Error creating task');
      res.status(500).json({ error: { message: 'Failed to create task' } });
    }
  }

  // Update a task
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;
      const taskId = parseInt(req.params.id, 10);

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ error: { message: 'Invalid task ID' } });
        return;
      }

      const updates = req.body;
      const task = await TaskService.updateTask(taskId, userId, updates);

      if (!task) {
        res.status(404).json({ error: { message: 'Task not found' } });
        return;
      }

      res.json({ task });
    } catch (error) {
      logger.error({ error }, 'Error updating task');
      res.status(500).json({ error: { message: 'Failed to update task' } });
    }
  }

  // Set active task
  static async setActiveTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;
      const taskId = parseInt(req.params.id, 10);

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ error: { message: 'Invalid task ID' } });
        return;
      }

      const task = await TaskService.setActiveTask(taskId, userId);

      if (!task) {
        res.status(404).json({ error: { message: 'Task not found' } });
        return;
      }

      res.json({ task });
    } catch (error) {
      logger.error({ error }, 'Error setting active task');
      res.status(500).json({ error: { message: 'Failed to set active task' } });
    }
  }

  // Complete a task
  static async completeTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;
      const taskId = parseInt(req.params.id, 10);

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ error: { message: 'Invalid task ID' } });
        return;
      }

      const task = await TaskService.completeTask(taskId, userId);

      if (!task) {
        res.status(404).json({ error: { message: 'Task not found' } });
        return;
      }

      res.json({ task });
    } catch (error) {
      logger.error({ error }, 'Error completing task');
      res.status(500).json({ error: { message: 'Failed to complete task' } });
    }
  }

  // Delete a task
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;
      const taskId = parseInt(req.params.id, 10);

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ error: { message: 'Invalid task ID' } });
        return;
      }

      const deleted = await TaskService.deleteTask(taskId, userId);

      if (!deleted) {
        res.status(404).json({ error: { message: 'Task not found' } });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      logger.error({ error }, 'Error deleting task');
      res.status(500).json({ error: { message: 'Failed to delete task' } });
    }
  }

  // Increment pomodoro count
  static async incrementPomodoro(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id as string;
      const taskId = parseInt(req.params.id, 10);

      if (!userId) {
        res.status(401).json({ error: { message: 'Unauthorized' } });
        return;
      }

      if (isNaN(taskId)) {
        res.status(400).json({ error: { message: 'Invalid task ID' } });
        return;
      }

      const task = await TaskService.incrementPomodoro(taskId, userId);

      if (!task) {
        res.status(404).json({ error: { message: 'Task not found' } });
        return;
      }

      res.json({ task });
    } catch (error) {
      logger.error({ error }, 'Error incrementing pomodoro');
      res
        .status(500)
        .json({ error: { message: 'Failed to increment pomodoro' } });
    }
  }
}
