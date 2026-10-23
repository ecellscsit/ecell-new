import User from '../modules/users/user.model.js';
import Notification from '../modules/notifications/notification.model.js';
import { sendBatch } from './sendEmail.js';

const CLIENT = () => process.env.CLIENT_URL;

// kind: 'event' | 'blog' | 'announcement'
export async function notifyMembers({ kind, title, body, link, image, email = true, createBell = true }) {
  if (createBell) await Notification.create({ type: kind, title, body, link, sendEmail: email });
  if (!email) return;

  const prefKey = kind === 'event' ? 'prefs.events' : kind === 'blog' ? 'prefs.blogs' : 'prefs.announcements';
  const users = await User.find({ emailVerified: true, blocked: false, [prefKey]: true }).select('email name');

  // fire and forget so the admin's request is not blocked
  sendBatch(users, (u) => ({
    subject: title,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px">
      ${image ? `<img src="${image}" style="width:100%;border-radius:8px"/>` : ''}
      <h2>${title}</h2><p>Hi ${u.name}, ${body}</p>
      <p><a href="${CLIENT()}${link}">Open</a></p>
      <hr/><small>Change email preferences or unsubscribe in your <a href="${CLIENT()}/profile">profile</a>.</small></div>`,
  })).catch(console.error);
}
