import http from '../../api/http.js';

const LEVELS = [
  { value: 0, label: 'Faculty Mentor' }, { value: 1, label: 'President' }, { value: 2, label: 'Vice President' },
  { value: 3, label: 'Head' }, { value: 4, label: 'Team Lead' }, { value: 5, label: 'Member' },
];
const date = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '');
const yesNo = (v) => (v ? '✔' : '—');

export const eventsConfig = {
  title: 'Events', listUrl: '/events/admin/all', saveUrl: '/events',
  columns: [{ key: 'title', label: 'Title' }, { key: 'startDate', label: 'Date', render: (r) => date(r.startDate) },
    { key: 'status', label: 'Status' }, { key: 'registrationOpen', label: 'Reg open', render: (r) => yesNo(r.registrationOpen) }],
  fields: [
    { name: 'title', label: 'Title' }, { name: 'poster', label: 'Poster', type: 'image' },
    { name: 'category', label: 'Category', type: 'select', options: ['General', 'Workshop', 'Hackathon', 'Talk', 'Competition'].map((v) => ({ value: v, label: v })) },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'startDate', label: 'Start', type: 'datetime' }, { name: 'endDate', label: 'End', type: 'datetime' },
    { name: 'venue', label: 'Venue' }, { name: 'registrationDeadline', label: 'Registration deadline', type: 'datetime' },
    { name: 'rules', label: 'Rules', type: 'lines' }, { name: 'prizes', label: 'Prizes', type: 'lines' },
    { name: 'registrationOpen', label: 'Registration open', type: 'checkbox' },
    { name: 'published', label: 'Published', type: 'checkbox' },
    { name: 'externalLink', label: 'Event website link (optional)' },
    { name: 'winners', label: 'Winners (one per line, for past events)', type: 'lines' },
    { name: 'notifyMembers', label: 'Notify members (bell + email)', type: 'checkbox', createOnly: true },
  ],
  defaults: { published: true, registrationOpen: true, category: 'General' },
  rowActions: [{ label: 'CSV', run: (r) => http.get(`/registrations/event/${r._id}/csv`, { responseType: 'blob' }).then((res) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(res.data); a.download = `${r.slug}-registrations.csv`; a.click();
  }) }],
};

export const blogConfig = {
  title: 'Blog', listUrl: '/blog/admin/all', saveUrl: '/blog',
  columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'published', label: 'Published', render: (r) => yesNo(r.published) }],
  fields: [
    { name: 'title', label: 'Title' }, { name: 'cover', label: 'Cover image', type: 'image' },
    { name: 'category', label: 'Category' }, { name: 'author', label: 'Author' },
    { name: 'excerpt', label: 'Short excerpt', type: 'textarea' }, { name: 'content', label: 'Content', type: 'textarea' },
    { name: 'published', label: 'Publish now (untick = draft)', type: 'checkbox' },
    { name: 'notifyMembers', label: 'Notify members (bell + email)', type: 'checkbox', createOnly: true },
  ],
  defaults: { published: false, author: 'E-Cell SCSIT', category: 'News' },
};

export const teamConfig = {
  title: 'Team', listUrl: '/team', saveUrl: '/team',
  columns: [{ key: 'name', label: 'Name' }, { key: 'level', label: 'Level', render: (r) => LEVELS.find((l) => l.value === r.level)?.label },
    { key: 'department', label: 'Dept' }, { key: 'year', label: 'Year' }],
  fields: [
    { name: 'name', label: 'Name' }, { name: 'photo', label: 'Photo', type: 'image' }, { name: 'role', label: 'Role title' },
    { name: 'department', label: 'Department' }, { name: 'level', label: 'Level', type: 'select', options: LEVELS },
    { name: 'year', label: 'Team year (e.g. 2026-27)' }, { name: 'quote', label: 'Quote' },
    { name: 'linkedin', label: 'LinkedIn URL' }, { name: 'instagram', label: 'Instagram URL' },
    { name: 'order', label: 'Order inside level', type: 'number' },
  ],
  defaults: { level: 5, order: 0 },
  rowActions: [
    { label: '↑', run: (row, rows) => moveTeam(row, rows, -1) },
    { label: '↓', run: (row, rows) => moveTeam(row, rows, 1) },
  ],
};

// swap position with the neighbour in the same year + level, then save the new order
async function moveTeam(row, rows, dir) {
  const group = rows.filter((r) => r.year === row.year && r.level === row.level)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  const i = group.findIndex((r) => r._id === row._id);
  const j = i + dir;
  if (j < 0 || j >= group.length) return;
  [group[i], group[j]] = [group[j], group[i]];
  await http.put('/team/reorder', group.map((r, n) => ({ id: r._id, order: n })));
}

export const startupsConfig = {
  title: 'Startups', listUrl: '/startups', saveUrl: '/startups',
  columns: [{ key: 'name', label: 'Name' }, { key: 'founders', label: 'Founders' }, { key: 'showOnHome', label: 'On home', render: (r) => yesNo(r.showOnHome) }],
  fields: [
    { name: 'name', label: 'Name' }, { name: 'logo', label: 'Logo', type: 'image' }, { name: 'founders', label: 'Founders' },
    { name: 'domain', label: 'Domain' }, { name: 'description', label: 'One-line description' },
    { name: 'story', label: 'Story', type: 'textarea' }, { name: 'link', label: 'Website link' },
    { name: 'showOnHome', label: 'Show on home page', type: 'checkbox' },
  ],
};

export const galleryConfig = {
  title: 'Gallery', listUrl: '/gallery', saveUrl: '/gallery',
  columns: [{ key: 'url', label: 'Photo', render: (r) => <img src={r.url} alt="" className="thumb" /> }, { key: 'event', label: 'Event' },
    { key: 'year', label: 'Year' }, { key: 'showOnHome', label: 'Home', render: (r) => yesNo(r.showOnHome) }, { key: 'showInHero', label: 'Hero', render: (r) => yesNo(r.showInHero) }],
  fields: [
    { name: 'url', label: 'Photo', type: 'image' }, { name: 'caption', label: 'Caption' }, { name: 'event', label: 'Event' }, { name: 'year', label: 'Year' },
    { name: 'showOnHome', label: 'Show in home mini gallery', type: 'checkbox' }, { name: 'showInHero', label: 'Show in hero slideshow', type: 'checkbox' },
  ],
  // TODO: multi-photo upload using POST /api/upload/many + POST /api/gallery/bulk
};

export const notificationsConfig = {
  title: 'Notifications', listUrl: '/notifications/admin/all', saveUrl: '/notifications',
  columns: [{ key: 'title', label: 'Title' }, { key: 'type', label: 'Type' }, { key: 'pinned', label: 'Pinned', render: (r) => yesNo(r.pinned) }, { key: 'hidden', label: 'Hidden', render: (r) => yesNo(r.hidden) }],
  fields: [
    { name: 'title', label: 'Title' }, { name: 'body', label: 'One-line text' }, { name: 'link', label: 'Link (e.g. /events/my-event)' },
    { name: 'type', label: 'Type', type: 'select', options: ['announcement', 'event', 'blog'].map((v) => ({ value: v, label: v })) },
    { name: 'expiresAt', label: 'Expires at', type: 'datetime' },
    { name: 'pinned', label: 'Pin on top', type: 'checkbox' }, { name: 'hidden', label: 'Hide', type: 'checkbox' },
    { name: 'sendEmail', label: 'Also send by email', type: 'checkbox', createOnly: true },
  ],
  defaults: { type: 'announcement' },
};

export const initiativesConfig = {
  title: 'Initiatives', listUrl: '/initiatives', saveUrl: '/initiatives',
  columns: [{ key: 'icon', label: 'Icon' }, { key: 'title', label: 'Title' }, { key: 'order', label: 'Order' }],
  fields: [
    { name: 'icon', label: 'Icon (an emoji, e.g. 🚀)' }, { name: 'title', label: 'Title' },
    { name: 'description', label: 'Short description', type: 'textarea' }, { name: 'link', label: 'Link (optional)' },
    { name: 'order', label: 'Order (1 = first)', type: 'number' },
  ],
  defaults: { icon: '💡', order: 0 },
};
