import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return res.status(200).json(roles);
  } catch (error: any) {
    return res.status(500).json({ message: 'Gagal mengambil data master role' });
  }
};