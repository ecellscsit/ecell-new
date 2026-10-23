import User from './user.model.js';
import { asyncH } from '../../middleware/error.js';

const SAFE = '-password -verifyToken -resetToken -resetExpires';

export const updateMe = asyncH(async (req, res) => {
  const allowed = ['name', 'enrollmentNo', 'course', 'year', 'phone', 'interests', 'prefs'];
  allowed.forEach((k) => req.body[k] !== undefined && (req.user[k] = req.body[k]));
  await req.user.save();
  res.json(req.user);
});

// ----- admin -----
export const listUsers = asyncH(async (req, res) => {
  const q = req.query.q ? { $or: [{ name: new RegExp(req.query.q, 'i') }, { email: new RegExp(req.query.q, 'i') }] } : {};
  res.json(await User.find(q).select(SAFE).sort({ createdAt: -1 }));
});
export const toggleBlock = asyncH(async (req, res) => {
  const u = await User.findById(req.params.id);
  u.blocked = !u.blocked; await u.save();
  res.json({ blocked: u.blocked });
});
export const removeUser = asyncH(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
export const exportUsersCsv = asyncH(async (req, res) => {
  const users = await User.find().select(SAFE);
  const rows = users.map((u) => [u.name, u.email, u.phone, u.course, u.year, u.prefs.events, u.prefs.blogs]
    .map((v) => `"${v ?? ''}"`).join(','));
  res.header('Content-Type', 'text/csv');
  res.attachment('members.csv').send(['Name,Email,Phone,Course,Year,Events emails,Blog emails', ...rows].join('\n'));
});
