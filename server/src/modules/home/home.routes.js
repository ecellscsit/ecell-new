import { Router } from 'express';
import { asyncH } from '../../middleware/error.js';
import { getSettings } from '../settings/settings.routes.js';
import Event from '../events/event.model.js';
import Startup from '../startups/startup.model.js';
import Photo from '../gallery/photo.model.js';
import TeamMember from '../team/member.model.js';
import User from '../users/user.model.js';
import Post from '../blog/post.model.js';
import Initiative from '../initiatives/initiative.model.js';
import Notification from '../notifications/notification.model.js';

const r = Router();
r.get('/', asyncH(async (req, res) => {
  const settings = await getSettings();
  const now = new Date();
  // next 3 upcoming events, filled with latest past ones if fewer than 3
  let events = await Event.find({ published: true, startDate: { $gte: now } }).sort('startDate').limit(3);
  if (events.length < 3) {
    const past = await Event.find({ published: true, startDate: { $lt: now } }).sort('-startDate').limit(3 - events.length);
    events = [...events, ...past];
  }
  const [startups, heroImages, gallery, president, vicePresident, members, eventCount, startupCount, posts, initiatives, announcements] = await Promise.all([
    Startup.find({ showOnHome: true }).limit(4),
    Photo.find({ showInHero: true }).sort('-createdAt').limit(5),
    Photo.find({ showOnHome: true }).sort('-createdAt').limit(8),
    settings.president && TeamMember.findById(settings.president),
    settings.vicePresident && TeamMember.findById(settings.vicePresident),
    User.countDocuments({ role: 'member' }),
    Event.countDocuments({ published: true }),
    Startup.countDocuments(),
    Post.countDocuments({ published: true }),
    Initiative.find().sort({ order: 1, createdAt: 1 }).limit(6),
    Notification.find({ hidden: false, type: 'announcement' }).sort({ pinned: -1, createdAt: -1 }).limit(4).select('-readBy'),
  ]);
  res.json({ settings, events, startups, heroImages, gallery, president, vicePresident,
    stats: { members, events: eventCount, startups: startupCount, posts }, initiatives, announcements });
}));
export default r;
