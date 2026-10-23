import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect, adminOnly } from '../../middleware/auth.js';
import { asyncH } from '../../middleware/error.js';
import { sendEmail } from '../../utils/sendEmail.js';
import Message from './message.model.js';

const r = Router();
r.post('/', rateLimit({ windowMs: 60 * 60 * 1000, max: 10 }), asyncH(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const msg = await Message.create({ name, email, subject, message });
  if (process.env.ECELL_INBOX) {   // optional: also forward to the E-Cell inbox
    sendEmail({ to: process.env.ECELL_INBOX, subject: `[Contact] ${subject || 'New message'}`,
      html: `<p><b>${name}</b> (${email})</p><p>${message}</p>` }).catch(console.error);
  }
  res.status(201).json({ message: 'Thanks! We will get back to you.', id: msg._id });
}));
r.get('/', protect, adminOnly, asyncH(async (req, res) => res.json(await Message.find().sort({ createdAt: -1 }))));
r.patch('/:id/done', protect, adminOnly, asyncH(async (req, res) =>
  res.json(await Message.findByIdAndUpdate(req.params.id, { done: req.body.done ?? true }, { new: true }))));
r.delete('/:id', protect, adminOnly, asyncH(async (req, res) => { await Message.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }));
export default r;
