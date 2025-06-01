import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Read all items
export const getItems = (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = prisma.item.findMany();
    res.json(items);
  } catch (error) {
    next(error);
  }
};
