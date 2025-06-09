import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const prisma = new PrismaClient();

const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

const propertySchema = z.object({
  image: z.string(),
  propertyType: z.enum(['CONDOMINIUM', 'REAL_ESTATE', 'HOUSE', 'APARTMENT']),
  purchase: z.enum(['RENT', 'SALE']),
  price: z.number(),
  status: z.string(),
  description: z.string(),
  contactDetail: z.string(),
  video: z.string().optional(),
});

export const createProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = propertySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }

    const property = await prisma.propertyDetail.create({
      data: {
        ...parsed.data,
        // adminId: user.id,
      },
    });

    res.status(201).json(property);
  } catch (err) {
    console.error('Create error:', err);
    next(err);
  }
};

export const updateProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await prisma.propertyDetail.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // if (existing.adminId !== user.id) {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }

    const parsed = propertySchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: parsed.error.flatten().fieldErrors });
    }

    const updated = await prisma.propertyDetail.update({
      where: { id },
      data: parsed.data,
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error('Update error:', err);
    next(err);
  }
};

export const deleteProperty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const existing = await prisma.propertyDetail.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // if (existing.adminId !== user.id) {
    //   return res.status(403).json({ error: 'Forbidden' });
    // }

    await prisma.propertyDetail.delete({ where: { id } });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    next(err);
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await prisma.propertyDetail.findUnique({
      where: { id: Number(id) },
    });
    if (!property) return res.status(404).json({ error: 'Not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [properties, total] = await Promise.all([
      prisma.propertyDetail.findMany({
        skip,
        take: limit,
      }),
      prisma.propertyDetail.count(),
    ]);

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      properties,
    });
  } catch (err: any) {
    console.error('Fetch all error:', err);
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
};
