import { Router } from 'express';
import { login, register, forgotPassword } from '../Controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;