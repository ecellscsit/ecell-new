import { Router } from 'express';
import { protect, adminOnly, optionalAuth } from '../../middleware/auth.js';
import * as c from './notifications.controller.js';

const r = Router();
r.get('/', optionalAuth, c.listForBell);
r.post('/read-all', protect, c.markAllRead);
r.get('/admin/all', protect, adminOnly, c.adminList);
r.post('/', protect, adminOnly, c.create);
r.put('/:id', protect, adminOnly, c.update);
r.delete('/:id', protect, adminOnly, c.remove);
export default r;
