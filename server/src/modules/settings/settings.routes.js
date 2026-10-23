import { Router } from 'express';
import { protect, adminOnly } from '../../middleware/auth.js';
import { asyncH } from '../../middleware/error.js';
import Settings from './settings.model.js';

export const getSettings = () => Settings.findOneAndUpdate({ key: 'site' }, {}, { upsert: true, new: true, setDefaultsOnInsert: true });

const r = Router();
r.get('/', asyncH(async (req, res) => res.json(await getSettings())));
r.put('/', protect, adminOnly, asyncH(async (req, res) =>
  res.json(await Settings.findOneAndUpdate({ key: 'site' }, req.body, { upsert: true, new: true }))));
export default r;
