import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, password, passwordConfirm } = req.body;
    
    // 1. Cek kelengkapan data
    if (!name || !username || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // 2. Validasi minimal panjang password (8 Karakter)
    if (password.trim().length < 8) {
      return res.status(400).json({ message: 'Password harus minimal 8 karakter!' });
    }

    // 3. Cek kesamaan password dan konfirmasinya
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Konfirmasi password tidak cocok' });
    }

    // Cek ketersediaan username
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Username sudah digunakan' });

    // Cari ID Role 'Admin' secara dinamis dari database untuk user baru
    const defaultRole = await prisma.role.findUnique({ where: { name: 'Admin' } });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Role default Admin belum diseed di database!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        name, 
        username, 
        password: hashedPassword, 
        roleId: defaultRole.id // Menggunakan Foreign Key roleId baru sesuai schema
      }
    });

    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username dan password wajib diisi' });

    // Cari user lengkap dengan role dan daftar permission yang terhubung lewat tabel RolePermission
    const user = await prisma.user.findUnique({ 
      where: { username },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Ekstrak nama-nama permission menjadi array string, contoh: ['user.create', 'kriteria.view']
    const permissionsArray = user.role.permissions.map(rp => rp.permission.name);

    // Masukkan token payload menyertakan role name dan hak akses permissions
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role.name,
        permissions: permissionsArray
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        username: user.username, 
        role: user.role.name 
      },
      permissions: permissionsArray // Kirim ke frontend agar disimpan ke Zustand
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: 'Username tidak ditemukan' });
    
    const defaultPassword = await bcrypt.hash('123456', 10);
    await prisma.user.update({
      where: { username },
      data: { password: defaultPassword }
    });

    res.json({ message: 'Password berhasil di-reset menjadi "123456"' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};