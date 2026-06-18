import { Router } from 'express';
import { 
  getCriteria, 
  createCriteria, 
  updateCriteria, 
  deleteCriteria 
} from '../Controllers/criteriaController';

// 1. Sesuaikan nama import middleware auth kamu (sesuai yang dipakai di baris 10)
import { authenticateToken } from '../middleware/authMiddleware'; 
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

// Proteksi token untuk semua rute di bawah ini
router.use(authenticateToken);

// 2. Pasang checkPermission sesuai nama di file seed.ts Claude kemarin
router.get('/', checkPermission('kriteria.view'), getCriteria);
router.post('/', checkPermission('kriteria.create'), createCriteria);
router.put('/:id', checkPermission('kriteria.edit'), updateCriteria);
router.delete('/:id', checkPermission('kriteria.delete'), deleteCriteria);

export default router;