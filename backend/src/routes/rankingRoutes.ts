import { Router } from 'express';
import { getRanking } from '../Controllers/rankingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Proteksi route ranking dengan middleware auth
router.use(authenticateToken);

router.get('/', getRanking);

export default router;