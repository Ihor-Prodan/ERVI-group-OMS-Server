import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', authCtrl.login);
router.post('/logout', authCtrl.logout);
router.post('/refresh', authCtrl.refresh); 
router.post('/change-password', requireAuth, authCtrl.changePassword);
router.get('/me', requireAuth, authCtrl.me);

export default router;
