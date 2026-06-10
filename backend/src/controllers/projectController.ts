import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const projects = await prisma.project.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const { name, color, icon } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }

    // Security validation: Only letters, numbers, and spaces
    if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
      res.status(400).json({ error: 'Project name can only contain letters, numbers, and spaces.' });
      return;
    }

    const project = await prisma.project.create({
      data: {
        name,
        color: color || '#3B82F6', // Default blue
        icon: icon || null,
        user_id: userId,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const id = req.params.id as string;
    const { name, color, icon } = req.body;

    if (name && !/^[a-zA-Z0-9\s]+$/.test(name)) {
      res.status(400).json({ error: 'Project name can only contain letters, numbers, and spaces.' });
      return;
    }

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.user_id !== userId) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const project = await prisma.project.update({
      where: { id },
      data: { 
        ...(name && { name }), 
        ...(color && { color }),
        ...(icon !== undefined && { icon }) 
      },
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const id = req.params.id as string;

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject || existingProject.user_id !== userId) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    await prisma.project.delete({ where: { id } });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
