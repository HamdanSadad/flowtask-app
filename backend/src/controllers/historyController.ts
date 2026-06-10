import { Request, Response } from 'express';
import prisma from '../prismaClient';

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    
    // Optional filters could be implemented here via req.query
    const { type, startDate, endDate } = req.query;

    let whereClause: any = { user_id: userId };

    if (type) {
      whereClause.type = String(type);
    }
    
    if (startDate || endDate) {
      whereClause.timestamp = {};
      if (startDate) whereClause.timestamp.gte = new Date(String(startDate));
      if (endDate) whereClause.timestamp.lte = new Date(String(endDate));
    }

    const history = await prisma.activityHistory.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      include: {
        task: {
          select: { title: true }
        }
      }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    const id = req.params.id as string;

    const existingHistory = await prisma.activityHistory.findUnique({ where: { id } });
    if (!existingHistory || existingHistory.user_id !== userId) {
      res.status(404).json({ error: 'History record not found' });
      return;
    }

    await prisma.activityHistory.delete({ where: { id } });
    res.status(200).json({ message: 'History record deleted' });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = (req as any).user;
    await prisma.activityHistory.deleteMany({ where: { user_id: userId } });
    res.status(200).json({ message: 'History cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
