import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { crudFactory } from '../../utils/crudFactory.js';
import Developer from './developer.model.js';

const c = crudFactory(Developer, { sort: { order: 1, createdAt: 1 } });
const r = Router();
r.get('/', c.list);
r.post('/', protect, adminOnly, c.create);
r.put('/:id', protect, adminOnly, c.update);
r.delete('/:id', protect, adminOnly, c.remove);
export default r;
