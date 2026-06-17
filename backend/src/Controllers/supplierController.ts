import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSuppliers = async (req: Request, res: Response) => {
  const data = await prisma.supplier.findMany();
  res.json(data);
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const { nama_supplier, alamat, telepon, email } = req.body;
    const newSupplier = await prisma.supplier.create({
      data: { nama_supplier, alamat, telepon, email }
    });
    res.status(201).json(newSupplier);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nama_supplier, alamat, telepon, email } = req.body;
    const updated = await prisma.supplier.update({
      where: { id_supplier: Number(id) },
      data: { nama_supplier, alamat, telepon, email }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({ where: { id_supplier: Number(id) } });
    res.json({ message: 'Supplier berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};