import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../Controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Jalur di sini diubah menjadi '/' agar saat digabung menjadi '/api/users'
router.get('/', authenticateToken, getAllUsers);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;