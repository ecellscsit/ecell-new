import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { crudFactory } from '../../utils/crudFactory.js';
import Startup from './startup.model.js';

const c = crudFactory(Startup);
const r = Router();
r.get('/', c.list);
r.post('/', protect, adminOnly, c.create);
r.put('/:id', protect, adminOnly, c.update);
r.delete('/:id', protect, adminOnly, c.remove);
export default r;
