import Registration from './registration.model.js';
import Event from '../events/event.model.js';
import { asyncH } from '../../middleware/error.js';

export const registerForEvent = asyncH(async (req, res) => {
  const ev = await Event.findById(req.params.eventId);
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  if (!ev.canRegister) return res.status(400).json({ message: 'Registration is closed' });
  try {
    const reg = await Registration.create({ event: ev._id, user: req.user._id, teamName: req.body.teamName });
    res.status(201).json(reg);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ message: 'You are already registered' });
    throw e;
  }
});
export const cancelRegistration = asyncH(async (req, res) => {
  await Registration.deleteOne({ event: req.params.eventId, user: req.user._id });
  res.json({ message: 'Cancelled' });
});
export const myRegistrations = asyncH(async (req, res) =>
  res.json(await Registration.find({ user: req.user._id }).populate('event', 'title slug startDate venue poster')));

// admin
export const eventRegistrations = asyncH(async (req, res) =>
  res.json(await Registration.find({ event: req.params.eventId }).populate('user', 'name email phone enrollmentNo course year')));

export const exportCsv = asyncH(async (req, res) => {
  const regs = await Registration.find({ event: req.params.eventId }).populate('user');
  const rows = regs.map((r) => [r.user.name, r.user.email, r.user.phone, r.user.enrollmentNo, r.user.course, r.user.year, r.teamName]
    .map((v) => `"${v ?? ''}"`).join(','));
  res.header('Content-Type', 'text/csv');
  res.attachment('registrations.csv').send(['Name,Email,Phone,Enrollment,Course,Year,Team', ...rows].join('\n'));
});
