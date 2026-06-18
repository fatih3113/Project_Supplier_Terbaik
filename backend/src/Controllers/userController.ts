import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';

// READ ALL USERS (getUsers & getAllUsers kita samakan strukturnya)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        username: true, 
        roleId: true, // Ambil roleId untuk kebutuhan state di frontend
        role: {
          select: { name: true } // Ambil nama role dari relasi tabel master role
        }
      },
      orderBy: { id: 'desc' }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        username: true, 
        roleId: true,
        role: {
          select: { name: true }
        }
      },
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
    // Tangkap roleId berupa angka dari frontend, bukan teks string lagi
    const { name, username, password, roleId } = req.body;
    if (!name || !username || !password || !roleId) {
      return res.status(400).json({ message: 'Data formulir tidak lengkap' });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username/NIM sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { 
        name, 
        username, 
        password: hashedPassword, 
        roleId: Number(roleId) // Simpan sebagai angka ke foreign key roleId
      }
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
    const { name, username, roleId } = req.body; // Ganti role menjadi roleId

    if (!roleId) return res.status(400).json({ message: 'Role harus ditentukan' });

    await prisma.user.update({
      where: { id: Number(id) },
      data: { 
        name, 
        username, 
        roleId: Number(roleId) // Update relasi key baru
      }
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