import { Router } from 'express';
import { getAllRoles } from '../Controllers/roleController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Hanya membutuhkan token login agar dropdown hak akses di frontend bisa memuat pilihan role
router.get('/', authenticateToken, getAllRoles);

export default router;