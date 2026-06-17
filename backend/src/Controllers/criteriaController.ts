import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getCriteria = async (req: Request, res: Response) => {
  const data = await prisma.criteria.findMany();
  res.json(data);
};

export const createCriteria = async (req: Request, res: Response) => {
  try {
    const { nama_kriteria, bobot, jenis } = req.body;
    const newCriteria = await prisma.criteria.create({
      data: { nama_kriteria, bobot: Number(bobot), jenis }
    });
    res.status(201).json(newCriteria);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_kriteria, bobot, jenis } = req.body;
    const updated = await prisma.criteria.update({
      where: { id: Number(id) },
      data: { nama_kriteria, bobot: Number(bobot), jenis }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCriteria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.criteria.delete({ where: { id: Number(id) } });
    res.json({ message: 'Kriteria berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};