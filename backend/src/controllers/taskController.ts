import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const tasks = await prisma.task.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { title, description, priority, status, deadline, start_date, labels, project_id } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    // Security validation
    const safeRegex = /^[a-zA-Z0-9\s.,!?\-_()]+$/;
    if (!safeRegex.test(title)) {
      res.status(400).json({ error: 'Task title contains invalid characters.' });
      return;
    }
    if (description && !safeRegex.test(description)) {
      res.status(400).json({ error: 'Task description contains invalid characters.' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || 'MEDIUM',
        status: status || 'BACKLOG',
        deadline: deadline ? new Date(deadline) : null,
        start_date: start_date ? new Date(start_date) : null,
        labels: Array.isArray(labels) ? labels : [],
        project_id: project_id || null,
        user_id: userId,
      },
    });

    // Log activity
    await prisma.activityHistory.create({
      data: {
        user_id: userId,
        task_id: task.id,
        type: 'created',
        detail: `Created task: ${title}`,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const id = req.params.id as string;
    const { title, description, status, priority, deadline, start_date, labels, project_id } = req.body;

    // Security validation
    const safeRegex = /^[a-zA-Z0-9\s.,!?\-_()]+$/;
    if (title && !safeRegex.test(title)) {
      res.status(400).json({ error: 'Task title contains invalid characters.' });
      return;
    }
    if (description && !safeRegex.test(description)) {
      res.status(400).json({ error: 'Task description contains invalid characters.' });
      return;
    }

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.user_id !== userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    const updateData: any = { title, description, priority };
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date) : null;
    if (labels !== undefined) updateData.labels = Array.isArray(labels) ? labels : [];
    if (project_id !== undefined) updateData.project_id = project_id || null;
    
    let statusChanged = false;
    if (status && status !== existingTask.status) {
      updateData.status = status;
      statusChanged = true;
      if (status === 'DONE') updateData.completed_at = new Date();
      else updateData.completed_at = null;
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    await prisma.activityHistory.create({
      data: {
        user_id: userId,
        task_id: task.id,
        type: statusChanged ? 'status_changed' : 'updated',
        detail: statusChanged ? `Changed status to ${status}` : `Updated task: ${task.title}`,
      },
    });

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const id = req.params.id as string;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask || existingTask.user_id !== userId) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    await prisma.task.delete({ where: { id } });

    // Log activity
    await prisma.activityHistory.create({
      data: {
        user_id: userId,
        type: 'deleted',
        detail: `Deleted task: ${existingTask.title}`,
      },
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
