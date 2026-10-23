import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import * as c from './registrations.controller.js';

const r = Router();
r.get('/mine', protect, c.myRegistrations);
r.post('/:eventId', protect, c.registerForEvent);
r.delete('/:eventId', protect, c.cancelRegistration);
r.get('/event/:eventId', protect, adminOnly, c.eventRegistrations);
r.get('/event/:eventId/csv', protect, adminOnly, c.exportCsv);
export default r;
