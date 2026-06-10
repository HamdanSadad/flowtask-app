import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getConfigs = async (req: Request, res: Response): Promise<void> => {
  try {
    const configs = await prisma.appConfig.findMany();
    const configMap: Record<string, any> = {};
    for (const conf of configs) {
      try {
        configMap[conf.key] = JSON.parse(conf.value);
      } catch (e) {
        configMap[conf.key] = conf.value; // fallback
      }
    }
    res.status(200).json(configMap);
  } catch (error) {
    console.error('Error fetching configs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateConfig = async (req: Request, res: Response): Promise<void> => {
  try {
    const key = req.params.key as string;
    const { value } = req.body;

    if (value === undefined) {
      res.status(400).json({ error: 'Value is required' });
      return;
    }

    const valueString = typeof value === 'string' ? value : JSON.stringify(value);

    const config = await prisma.appConfig.upsert({
      where: { key },
      update: { value: valueString },
      create: { key, value: valueString },
    });

    res.status(200).json({ message: 'Config updated successfully', config });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.status(200).json({ message: 'User role updated', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const currentUserId = (req as any).user.userId;

    if (id === currentUserId) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { name, email, role } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role && ['USER', 'ADMIN'].includes(role)) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, created_at: true }
    });

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

import bcrypt from 'bcryptjs';

export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { password_hash }
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

