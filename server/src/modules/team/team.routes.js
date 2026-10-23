import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { crudFactory } from '../../utils/crudFactory.js';
import { asyncH } from '../../middleware/error.js';
import TeamMember from './member.model.js';

const c = crudFactory(TeamMember, { sort: { level: 1, order: 1, name: 1 }, filterFields: ['year'] });
const r = Router();
r.get('/years', asyncH(async (req, res) => res.json((await TeamMember.distinct('year', { year: { $ne: 'Founders' } })).sort().reverse())));
r.get('/', c.list);                                   // GET /api/team?year=2026-27
r.post('/', protect, adminOnly, c.create);
r.put('/reorder', protect, adminOnly, asyncH(async (req, res) => {   // body: [{id, order}]
  await Promise.all(req.body.map((i) => TeamMember.findByIdAndUpdate(i.id, { order: i.order })));
  res.json({ message: 'Reordered' });
}));
r.put('/:id', protect, adminOnly, c.update);
r.delete('/:id', protect, adminOnly, c.remove);
export default r;
