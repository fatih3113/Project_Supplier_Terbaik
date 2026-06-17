import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

// READ ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, username: true, role: true },
      orderBy: { id: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, password, role } = req.body;
    if (!name || !username || !password) return res.status(400).json({ message: 'Data formulir tidak lengkap' });

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username/NIM sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, username, password: hashedPassword, role: role || 'Admin' }
    });

    res.status(201).json({ message: 'User berhasil dibuat', id: newUser.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER (Tanpa Ubah Password)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, role } = req.body;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { name, username, role }
    });

    res.json({ message: 'Data user berhasil diperbarui' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'User berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};