import { Router } from 'express';
import { getRanking } from '../Controllers/rankingController';

const router = Router();

// megambil rangking supplier per bulan
router.get('/', getRanking);


export default router;