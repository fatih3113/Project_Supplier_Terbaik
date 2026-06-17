import { Router } from 'express';
import { getCriteria, createCriteria, updateCriteria, deleteCriteria } from '../Controllers/criteriaController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Proteksi semua route kriteria dengan middleware auth
router.use(authenticateToken);

router.get('/', getCriteria);
router.post('/', createCriteria);
router.put('/:id', updateCriteria);
router.delete('/:id', deleteCriteria);

export default router;