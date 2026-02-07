import { Router } from 'express';
import { TaskController } from '../../controllers/taskController.js';

const router = Router();

// All routes require authentication (will be added via middleware in index.ts)

// Get all tasks
router.get('/', TaskController.getTasks);

// Create a new task
router.post('/', TaskController.createTask);

// Update a task
router.put('/:id', TaskController.updateTask);

// Set active task
router.post('/:id/active', TaskController.setActiveTask);

// Complete a task
router.post('/:id/complete', TaskController.completeTask);

// Delete a task
router.delete('/:id', TaskController.deleteTask);

// Increment pomodoro count
router.post('/:id/pomodoro', TaskController.incrementPomodoro);

export default router;
