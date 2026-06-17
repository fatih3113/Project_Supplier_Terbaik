import { Router } from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../Controllers/supplierController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Proteksi semua route supplier dengan middleware auth
router.use(authenticateToken);

router.get('/', getSuppliers);
router.post('/', createSupplier);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;