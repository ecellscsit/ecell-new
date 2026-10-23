import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import * as c from './events.controller.js';

const r = Router();
r.get('/', c.listEvents);
r.get('/admin/all', protect, adminOnly, c.adminList);
r.get('/:slug', c.getEvent);
r.post('/', protect, adminOnly, c.createEvent);
r.put('/:id', protect, adminOnly, c.updateEvent);
r.delete('/:id', protect, adminOnly, c.deleteEvent);
export default r;
