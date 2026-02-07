import {
  TaskModel,
  CreateTaskInput,
  UpdateTaskInput,
  Task,
  TaskSuggestion,
} from '../db/models/Task.js';
import logger from '../utils/logger.js';

export class TaskService {
  // Create a new task
  static async createTask(input: CreateTaskInput): Promise<Task> {
    logger.info(
      { userId: input.userId, title: input.title },
      'Creating new task'
    );
    const task = await TaskModel.create(input);

    // If this is the first task, make it active
    const userTasks = await TaskModel.findByUserId(input.userId);
    if (userTasks.length === 1) {
      await TaskModel.setActive(task.id, input.userId as string);
    }

    return task;
  }

  // Get all tasks for a user
  static async getUserTasks(userId: string): Promise<Task[]> {
    return await TaskModel.findByUserId(userId);
  }

  // Get a specific task
  static async getTask(taskId: number, userId: string): Promise<Task | null> {
    return await TaskModel.findById(taskId, userId);
  }

  // Update a task
  static async updateTask(
    taskId: number,
    userId: string,
    input: UpdateTaskInput
  ): Promise<Task | null> {
    logger.info({ taskId, userId }, 'Updating task');
    return await TaskModel.update(taskId, userId, input);
  }

  // Set active task
  static async setActiveTask(
    taskId: number,
    userId: string
  ): Promise<Task | null> {
    logger.info({ taskId, userId }, 'Setting active task');
    return await TaskModel.setActive(taskId, userId);
  }

  // Complete a task
  static async completeTask(
    taskId: number,
    userId: string
  ): Promise<Task | null> {
    logger.info({ taskId, userId }, 'Completing task');
    return await TaskModel.complete(taskId, userId);
  }

  // Delete a task
  static async deleteTask(taskId: number, userId: string): Promise<boolean> {
    logger.info({ taskId, userId }, 'Deleting task');
    return await TaskModel.delete(taskId, userId);
  }

  // Increment pomodoro count for a task
  static async incrementPomodoro(
    taskId: number,
    userId: string
  ): Promise<Task | null> {
    logger.info({ taskId, userId }, 'Incrementing pomodoro count');
    return await TaskModel.incrementPomodoro(taskId, userId);
  }
}
