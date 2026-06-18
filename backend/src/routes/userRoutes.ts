import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../Controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

// Proteksi token untuk semua rute user
router.use(authenticateToken);

router.get('/', checkPermission('user.view'), getUsers);
router.post('/', checkPermission('user.create'), createUser);
router.put('/:id', checkPermission('user.edit'), updateUser);
router.delete('/:id', checkPermission('user.delete'), deleteUser);

export default router;