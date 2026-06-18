import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  // ── 1. BUAT SEMUA PERMISSIONS ──────────────────────────────
  const allPermissions = [
    { name: 'user.view',            description: 'Lihat daftar user' },
    { name: 'user.create',          description: 'Tambah user baru' },
    { name: 'user.edit',            description: 'Edit data user' },
    { name: 'user.delete',          description: 'Hapus user' },
    { name: 'user.reset_password',  description: 'Reset password user' },
    { name: 'kriteria.view',        description: 'Lihat daftar kriteria' },
    { name: 'kriteria.create',      description: 'Tambah kriteria' },
    { name: 'kriteria.edit',        description: 'Edit kriteria' },
    { name: 'kriteria.delete',      description: 'Hapus kriteria' },
    { name: 'supplier.view',        description: 'Lihat daftar supplier' },
    { name: 'supplier.create',      description: 'Tambah supplier' },
    { name: 'supplier.edit',        description: 'Edit supplier' },
    { name: 'supplier.delete',      description: 'Hapus supplier' },
    { name: 'laporan.view',         description: 'Lihat laporan hasil SPK' },
    { name: 'spk.calculate',        description: 'Jalankan kalkulasi SPK' },
  ];

  for (const p of allPermissions) {
    await prisma.permission.upsert({
      where:  { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log('✅ Permissions selesai');

  // ── 2. BUAT ROLE SUPER ADMIN (semua permission) ────────────
  const superAdminRole = await prisma.role.upsert({
    where:  { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Akses penuh ke semua fitur' },
  });

  const allPerms = await prisma.permission.findMany();
  for (const perm of allPerms) {
    await prisma.rolePermission.upsert({
      where:  { roleId_permissionId: { roleId: superAdminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: perm.id },
    });
  }
  console.log('✅ Role Super Admin selesai');

  // ── 3. BUAT ROLE ADMIN ─────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where:  { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Akses operasional harian' },
  });

  const adminPermissions = [
    'kriteria.view', 'kriteria.create', 'kriteria.edit',
    'supplier.view', 'supplier.create', 'supplier.edit',
    'laporan.view',  'spk.calculate',
  ];
  for (const permName of adminPermissions) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.rolePermission.upsert({
        where:  { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: adminRole.id, permissionId: perm.id },
      });
    }
  }
  console.log('✅ Role Admin selesai');

  // ── 4. BUAT ROLE MANAJER (view only) ──────────────────────
  const manajerRole = await prisma.role.upsert({
    where:  { name: 'Manajer' },
    update: {},
    create: { name: 'Manajer', description: 'Hanya bisa melihat laporan' },
  });

  const manajerPermissions = ['kriteria.view', 'supplier.view', 'laporan.view'];
  for (const permName of manajerPermissions) {
    const perm = await prisma.permission.findUnique({ where: { name: permName } });
    if (perm) {
      await prisma.rolePermission.upsert({
        where:  { roleId_permissionId: { roleId: manajerRole.id, permissionId: perm.id } },
        update: {},
        create: { roleId: manajerRole.id, permissionId: perm.id },
      });
    }
  }
  console.log('✅ Role Manajer selesai');

  // ── 5. BUAT AKUN SUPER ADMIN AWAL ─────────────────────────
  const hashedPassword = await bcrypt.hash('superadmin123', 10);
  await prisma.user.upsert({
    where:  { username: 'superadmin' },
    update: {},
    create: {
      name:     'Super Administrator',
      username: 'superadmin',
      password: hashedPassword,
      roleId:   superAdminRole.id,
    },
  });
  console.log('✅ Akun superadmin selesai');
  console.log('');
  console.log('🎉 Seed RBAC selesai!');
  console.log('   Username : superadmin');
  console.log('   Password : superadmin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());