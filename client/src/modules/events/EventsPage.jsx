import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EventCard from '../../components/common/EventCard.jsx';
import { getEvents } from './eventsApi.js';

const TABS = ['upcoming', 'ongoing', 'past'];
const CATEGORIES = ['', 'Workshop', 'Hackathon', 'Talk', 'Competition', 'General'];

export default function EventsPage() {
  const [tab, setTab] = useState('upcoming');
  const [category, setCategory] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => { getEvents({ status: tab, category }).then(setEvents); }, [tab, category]);

  return (
    <>
      <PageHeader title="Events" />
      <div className="container section">
        <div className="tabs">
          {TABS.map((t) => <button key={t} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All categories'}</option>)}
          </select>
        </div>
        <div className="grid-3">{events.map((e) => <EventCard key={e._id} event={e} />)}</div>
        {!events.length && <p className="muted">No {tab} events.</p>}
      </div>
    </>
  );
}
