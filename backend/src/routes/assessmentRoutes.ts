import { Router } from 'express';
import { getAssessments, createAssessment, updateAssessment, deleteAssessment } from '../Controllers/assessmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Proteksi semua route assessment dengan middleware auth
router.use(authenticateToken);

router.get('/', getAssessments);
router.post('/', createAssessment);
router.put('/:id', updateAssessment);
router.delete('/:id', deleteAssessment);

export default router;