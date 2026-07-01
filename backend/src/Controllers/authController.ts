import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ── REGISTER ──────────────────────────────────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password, passwordConfirm, role } = req.body;

    // 1. Cek kelengkapan data
    if (!name || !username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    // 2. Validasi panjang password
    if (password.trim().length < 8) {
      return res.status(400).json({ message: 'Password harus minimal 8 karakter!' });
    }

    // 3. Cek kesamaan password
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'Konfirmasi password tidak cocok' });
    }

    // 4. Cek username sudah dipakai
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // 5. Cek email sudah dipakai
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    // 6. Cari role — default 'Admin Toko' sesuai seed database
    const roleName = role || 'Admin Toko';
    const foundRole = await prisma.role.findUnique({ where: { name: roleName } });
    if (!foundRole) {
      return res.status(500).json({ message: `Role '${roleName}' belum terdaftar di database!` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        roleId: foundRole.id,
      },
    });

    res.status(201).json({ message: 'Registrasi berhasil', userId: user.id });
  } catch (error: unknown) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;   // ← ganti username → email

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },                      // ← ganti username → email
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    const permissionsArray = user.role.permissions.map((rp) => rp.permission.name);

    const token = jwt.sign(
      {
        id:          user.id,
        email:       user.email,             // ← dari database, bukan req.body
        role:        user.role.name,
        permissions: permissionsArray,
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id:       user.id,
        name:     user.name,
        username: user.username,             // ← tetap kirim untuk ditampilkan di UI
        email:    user.email,               // ← dari database
        role:     user.role.name,
      },
      permissions: permissionsArray,
    });
  } catch (error: unknown) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};

// ── FORGOT PASSWORD ───────────────────────────────────────────────────────────
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Email tidak terdaftar di sistem' });
    }

    const defaultPassword = await bcrypt.hash('123456', 10);
    await prisma.user.update({
      where: { email },
      data: { password: defaultPassword },
    });

    res.json({ message: `Password akun "${user.username}" berhasil di-reset menjadi "123456"` });
  } catch (error: unknown) {
    const e = error as Error;
    res.status(500).json({ message: e.message });
  }
};