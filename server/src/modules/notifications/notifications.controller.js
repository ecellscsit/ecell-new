import Notification from './notification.model.js';
import { notifyMembers } from '../../utils/notifyMembers.js';
import { asyncH } from '../../middleware/error.js';

// public list for the bell. Visitors' read-state lives in localStorage (client side).
export const listForBell = asyncH(async (req, res) => {
  const now = new Date();
  const items = await Notification.find({
    hidden: false, $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  }).sort({ pinned: -1, createdAt: -1 }).limit(10).lean();

  const uid = req.user?._id?.toString();
  res.json(items.map((n) => ({
    ...n,
    read: uid ? n.readBy.some((id) => id.toString() === uid) : false,
    readBy: undefined,
  })));
});
export const markAllRead = asyncH(async (req, res) => {
  await Notification.updateMany({}, { $addToSet: { readBy: req.user._id } });
  res.json({ message: 'ok' });
});

// ----- admin -----
export const adminList = asyncH(async (req, res) => res.json(await Notification.find().select('-readBy').sort({ createdAt: -1 })));
export const create = asyncH(async (req, res) => {
  const { sendEmail, ...data } = req.body;
  const n = await Notification.create({ ...data, sendEmail: !!sendEmail });
  if (sendEmail) notifyMembers({ kind: 'announcement', title: n.title, body: n.body || '', link: n.link || '/', createBell: false });
  res.status(201).json(n);
});
export const update = asyncH(async (req, res) => res.json(await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true })));
export const remove = asyncH(async (req, res) => { await Notification.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });
