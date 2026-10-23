import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http, { errMsg } from '../../api/http.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { myRegistrations } from '../events/eventsApi.js';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', course: user.course || '', year: user.year || '', prefs: user.prefs });
  const [regs, setRegs] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => { myRegistrations().then(setRegs); }, []);

  const pref = (k) => (e) => setF({ ...f, prefs: { ...f.prefs, [k]: e.target.checked } });
  const save = async (e) => {
    e.preventDefault();
    try { const r = await http.put('/users/me', f); setUser(r.data); setMsg('Saved ✅'); } catch (err) { setMsg(errMsg(err)); }
  };

  return (
    <div className="container section narrow">
      <h1>My Profile</h1>
      <form onSubmit={save} className="form">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Name" />
        <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="Phone" />
        <input value={f.course} onChange={(e) => setF({ ...f, course: e.target.value })} placeholder="Course" />
        <input value={f.year} onChange={(e) => setF({ ...f, year: e.target.value })} placeholder="Year" />
        <h3>Email preferences</h3>
        <label><input type="checkbox" checked={f.prefs.events} onChange={pref('events')} /> New events</label>
        <label><input type="checkbox" checked={f.prefs.blogs} onChange={pref('blogs')} /> New blogs</label>
        <label><input type="checkbox" checked={f.prefs.announcements} onChange={pref('announcements')} /> Announcements</label>
        <button className="btn btn-primary">Save</button>{msg && <p>{msg}</p>}
      </form>
      <h3>My event registrations</h3>
      <ul>{regs.map((r) => <li key={r._id}><Link to={`/events/${r.event.slug}`}>{r.event.title}</Link></li>)}</ul>
    </div>
  );
}
