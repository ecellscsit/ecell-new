import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import * as c from './users.controller.js';

const r = Router();
r.put('/me', protect, c.updateMe);
r.get('/', protect, adminOnly, c.listUsers);
r.get('/export/csv', protect, adminOnly, c.exportUsersCsv);
r.patch('/:id/block', protect, adminOnly, c.toggleBlock);
r.delete('/:id', protect, adminOnly, c.removeUser);
export default r;
