import { pool } from '../pool.js';
import { User } from './User.js';

export interface Task {
  id: number;
  userId: string;
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
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface TaskSuggestion {
  id: number;
  userId: string;
  suggestedTitle: string;
  suggestedCategory?: string;
  reason: string;
  confidenceScore: number;
  basedOn: string;
  isAccepted: boolean;
  isDismissed: boolean;
  createdAt: Date;
}

export interface CreateTaskInput {
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  estimatedPomodoros?: number;
  dueDate?: Date;
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
  dueDate?: Date;
}

export interface CreateTaskSuggestionInput {
  userId: string;
  suggestedTitle: string;
  suggestedCategory?: string;
  reason: string;
  confidenceScore: number;
  basedOn: string;
}

export class TaskModel {
  // Create a new task
  static async create(input: CreateTaskInput): Promise<Task> {
    const {
      userId,
      title,
      description,
      category = 'general',
      priority = 'medium',
      tags = [],
      estimatedPomodoros = 1,
      dueDate,
    } = input;

    const result = await pool.query<Task>(
      `INSERT INTO tasks (
        user_id, title, description, category, priority, tags,
        estimated_pomodoros, due_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        userId,
        title,
        description,
        category,
        priority,
        tags,
        estimatedPomodoros,
        dueDate,
      ]
    );

    return this.mapTask(result.rows[0]);
  }

  // Get all active tasks for a user
  static async findByUserId(userId: string): Promise<Task[]> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks 
       WHERE user_id = $1 AND status IN ('active', 'completed')
       ORDER BY is_active DESC, sort_order ASC, created_at DESC`,
      [userId]
    );

    return result.rows.map(this.mapTask);
  }

  // Create a task suggestion
  // Get a single task by ID
  static async findById(taskId: number, userId: string): Promise<Task | null> {
    const result = await pool.query<Task>(
      `SELECT * FROM tasks WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    return result.rows.length > 0 ? this.mapTask(result.rows[0]) : null;
  }

  // Update a task
  static async update(
    taskId: number,
    userId: string,
    input: UpdateTaskInput
  ): Promise<Task | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(input).forEach(([key, value]) => {
      if (value !== undefined) {
        const snakeKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        fields.push(`${snakeKey} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) return null;

    values.push(taskId, userId);
    const result = await pool.query<Task>(
      `UPDATE tasks SET ${fields.join(', ')}
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1}
       RETURNING *`,
      values
    );

    return result.rows.length > 0 ? this.mapTask(result.rows[0]) : null;
  }

  // Set active task (only one can be active at a time)
  static async setActive(taskId: number, userId: string): Promise<Task | null> {
    // First, deactivate all tasks for this user
    await pool.query(`UPDATE tasks SET is_active = false WHERE user_id = $1`, [
      userId,
    ]);

    // Then activate the selected task
    const result = await pool.query<Task>(
      `UPDATE tasks SET is_active = true 
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [taskId, userId]
    );

    return result.rows.length > 0 ? this.mapTask(result.rows[0]) : null;
  }

  // Complete a task
  static async complete(taskId: number, userId: string): Promise<Task | null> {
    const result = await pool.query<Task>(
      `UPDATE tasks 
       SET status = 'completed', completed_at = CURRENT_TIMESTAMP, is_active = false
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [taskId, userId]
    );

    return result.rows.length > 0 ? this.mapTask(result.rows[0]) : null;
  }

  // Delete a task (soft delete)
  static async delete(taskId: number, userId: string): Promise<boolean> {
    const result = await pool.query(
      `UPDATE tasks SET status = 'deleted', is_active = false
       WHERE id = $1 AND user_id = $2`,
      [taskId, userId]
    );

    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Increment completed pomodoros and reward points
  static async incrementPomodoro(
    taskId: number,
    userId: string
  ): Promise<Task | null> {
    const result = await pool.query<Task>(
      `UPDATE tasks 
       SET completed_pomodoros = completed_pomodoros + 1,
           reward_points = reward_points + 10
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [taskId, userId]
    );

    return result.rows.length > 0 ? this.mapTask(result.rows[0]) : null;
  }

  // Map database row to Task object
  private static mapTask(row: any): Task {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      category: row.category,
      priority: row.priority,
      tags: row.tags || [],
      estimatedPomodoros: row.estimated_pomodoros,
      completedPomodoros: row.completed_pomodoros,
      rewardPoints: row.reward_points,
      streakDays: row.streak_days,
      status: row.status,
      isActive: row.is_active,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      completedAt: row.completed_at,
      dueDate: row.due_date,
    };
  }

  // Map database row to TaskSuggestion object
  private static mapSuggestion(row: any): TaskSuggestion {
    return {
      id: row.id,
      userId: row.user_id,
      suggestedTitle: row.suggested_title,
      suggestedCategory: row.suggested_category,
      reason: row.reason,
      confidenceScore: parseFloat(row.confidence_score),
      basedOn: row.based_on,
      isAccepted: row.is_accepted,
      isDismissed: row.is_dismissed,
      createdAt: row.created_at,
    };
  }
}
