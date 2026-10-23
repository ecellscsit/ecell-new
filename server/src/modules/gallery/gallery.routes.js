import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { crudFactory } from '../../utils/crudFactory.js';
import { asyncH } from '../../middleware/error.js';
import Photo from './photo.model.js';

const c = crudFactory(Photo, { filterFields: ['event', 'year'] });
const r = Router();
r.get('/', c.list);                                   // GET /api/gallery?event=&year=
r.post('/', protect, adminOnly, c.create);
r.post('/bulk', protect, adminOnly, asyncH(async (req, res) =>   // body: [{url, event, year, caption}]
  res.status(201).json(await Photo.insertMany(req.body))));
r.put('/:id', protect, adminOnly, c.update);
r.delete('/:id', protect, adminOnly, c.remove);
export default r;
