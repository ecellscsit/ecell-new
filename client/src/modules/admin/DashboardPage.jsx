import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../api/http.js';

export default function DashboardPage() {
  const [c, setC] = useState({});
  useEffect(() => {
    Promise.all([http.get('/users'), http.get('/events/admin/all'), http.get('/contact')]).then(([u, e, m]) =>
      setC({ members: u.data.length, events: e.data.length, messages: m.data.filter((x) => !x.done).length }));
    // TODO: add a /api/stats endpoint for registration counts
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid-4">
        {Object.entries(c).map(([k, v]) => <div key={k} className="card stat"><h2>{v}</h2><p>{k}</p></div>)}
      </div>
      <div className="btn-row">
        <Link to="/admin/events" className="btn btn-primary">Add Event</Link>
        <Link to="/admin/blog" className="btn btn-primary">Add Blog</Link>
        <Link to="/admin/notifications" className="btn btn-primary">Add Notification</Link>
      </div>
    </div>
  );
}
