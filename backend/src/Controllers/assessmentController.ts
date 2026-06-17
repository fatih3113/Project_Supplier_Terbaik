import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getAssessments = async (req: Request, res: Response) => {
  const data = await prisma.assessment.findMany({
    include: { supplier: true, criteria: true }
  });
  res.json(data);
};

export const createAssessment = async (req: Request, res: Response) => {
  try {
    const { supplierId, criteriaId, nilai } = req.body;
    const upserted = await prisma.assessment.upsert({
      where: {
        supplierId_criteriaId: { supplierId: Number(supplierId), criteriaId: Number(criteriaId) }
      },
      update: { nilai: Number(nilai) },
      create: { supplierId: Number(supplierId), criteriaId: Number(criteriaId), nilai: Number(nilai) }
    });
    res.status(201).json(upserted);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nilai } = req.body;
    const updated = await prisma.assessment.update({
      where: { id: Number(id) },
      data: { nilai: Number(nilai) }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.assessment.delete({ where: { id: Number(id) } });
    res.json({ message: 'Penilaian dihapus' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};