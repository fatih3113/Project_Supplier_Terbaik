import { Router } from 'express';
import { getAssessments, createAssessment, updateAssessment, deleteAssessment } from '../Controllers/assessmentController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission'; // <-- Tambah ini

const router = Router();

// Proteksi semua route assessment dengan middleware auth
router.use(authenticateToken);

router.get('/', checkPermission('spk.calculate'), getAssessments);
router.post('/', checkPermission('spk.calculate'), createAssessment);
router.put('/:id', checkPermission('spk.calculate'), updateAssessment);
router.delete('/:id', checkPermission('spk.calculate'), deleteAssessment);

export default router;