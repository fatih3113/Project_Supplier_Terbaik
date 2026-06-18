import { Router } from 'express';
import { getRanking } from '../Controllers/rankingController';
import { authenticateToken } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission'; // <-- Tambah ini

const router = Router();

// Proteksi route ranking dengan middleware auth
router.use(authenticateToken);

router.get('/', checkPermission('laporan.view'), getRanking);

export default router;