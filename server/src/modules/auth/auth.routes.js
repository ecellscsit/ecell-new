import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import * as c from './auth.controller.js';

const r = Router();
r.post('/register', c.register);
r.get('/verify/:token', c.verifyEmail);
r.post('/login', c.login);
r.get('/me', protect, c.me);
r.post('/forgot-password', c.forgotPassword);
r.post('/reset-password/:token', c.resetPassword);
r.post('/change-password', protect, c.changePassword);
export default r;
