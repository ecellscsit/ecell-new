import slugify from 'slugify';
import Event from './event.model.js';
import { notifyMembers } from '../../utils/notifyMembers.js';
import { asyncH } from '../../middleware/error.js';

export const listEvents = asyncH(async (req, res) => {
  const { status, category, limit } = req.query;
  const now = new Date();
  const filter = { published: true };
  if (category) filter.category = category;
  if (status === 'upcoming') filter.startDate = { $gt: now };
  let q = Event.find(filter).sort(status === 'past' ? { startDate: -1 } : { startDate: 1 });
  if (limit) q = q.limit(Number(limit));
  let events = await q;
  if (status === 'ongoing') events = events.filter((e) => e.status === 'ongoing');
  if (status === 'past') events = events.filter((e) => e.status === 'past');
  res.json(events);
});

export const getEvent = asyncH(async (req, res) => {
  const ev = await Event.findOne({ slug: req.params.slug });
  ev ? res.json(ev) : res.status(404).json({ message: 'Event not found' });
});

// admin: includes drafts
export const adminList = asyncH(async (req, res) => res.json(await Event.find().sort({ startDate: -1 })));

export const createEvent = asyncH(async (req, res) => {
  const { notifyMembers: notify, ...data } = req.body;
  data.slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  const ev = await Event.create(data);
  if (notify && ev.published) {
    notifyMembers({
      kind: 'event', title: `New event: ${ev.title}`, link: `/events/${ev.slug}`, image: ev.poster,
      body: `${ev.title} is happening on ${ev.startDate.toDateString()} at ${ev.venue || 'SCSIT'}. Registrations are open!`,
    });
  }
  res.status(201).json(ev);
});

export const updateEvent = asyncH(async (req, res) => {
  const { notifyMembers: _ignore, ...data } = req.body;
  res.json(await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }));
});
export const deleteEvent = asyncH(async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
