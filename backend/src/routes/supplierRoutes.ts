import { Router } from 'express';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../Controllers/supplierController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission'; // <-- Tambah ini

const router = Router();

// Proteksi semua route supplier dengan middleware auth
router.use(authenticateToken);

router.get('/', checkPermission('supplier.view'), getSuppliers);
router.post('/', checkPermission('supplier.create'), createSupplier);
router.put('/:id', checkPermission('supplier.edit'), updateSupplier);
router.delete('/:id', checkPermission('supplier.delete'), deleteSupplier);

export default router;