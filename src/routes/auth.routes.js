import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authCtrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { verifyCsrf } from '../utils/csrf.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' },
});

const router = Router();

router.post('/login', loginLimiter, authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/refresh', authCtrl.refresh);
router.post('/change-password', requireAuth, verifyCsrf, authCtrl.changePassword);
router.get('/me', requireAuth, authCtrl.me);

export default router;
