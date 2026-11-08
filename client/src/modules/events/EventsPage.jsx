import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EventCard from '../../components/common/EventCard.jsx';
import { getEvents } from './eventsApi.js';

const TABS = ['all', 'upcoming', 'ongoing', 'past'];
const CATEGORIES = ['', 'Workshop', 'Hackathon', 'Talk', 'Competition', 'General'];
const GROUPS = [
  ['ongoing', 'Ongoing now'],
  ['upcoming', 'Upcoming'],
  ['past', 'Past events'],
];

const byStart = (a, b) => new Date(a.startDate) - new Date(b.startDate);

export default function EventsPage() {
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = tab === 'all' ? { category } : { status: tab, category };
    getEvents(params)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [tab, category]);

  // "All" tab: timeline ke hisab se groups
  const groups = GROUPS.map(([key, title]) => [
    key,
    title,
    events.filter((e) => e.status === key).sort(key === 'past' ? (a, b) => byStart(b, a) : byStart),
  ]).filter(([, , list]) => list.length);

  return (
    <>
      <PageHeader title="Events" />
      <div className="container section">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
        </div>

        {loading ? (
          <p className="muted">Loading…</p>
        ) : events.length === 0 ? (
          <p className="muted">No {tab === 'all' ? '' : `${tab} `}events.</p>
        ) : tab === 'all' ? (
          groups.map(([key, title, list]) => (
            <section key={key} className="events-group">
              <h2 className={`events-group-title ${key}`}>
                {title} <span className="events-count">{list.length}</span>
              </h2>
              <div className="grid-3">
                {list.map((e) => <EventCard key={e._id} event={e} />)}
              </div>
            </section>
          ))
        ) : (
          <div className="grid-3">{events.map((e) => <EventCard key={e._id} event={e} />)}</div>
        )}
      </div>
    </>
  );
}
