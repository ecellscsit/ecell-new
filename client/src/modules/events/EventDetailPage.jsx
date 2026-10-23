import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { errMsg } from '../../api/http.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getEvent, registerForEvent } from './eventsApi.js';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [ev, setEv] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { getEvent(slug).then(setEv).catch(() => setEv(false)); }, [slug]);
  if (ev === false) return <p className="container">Event not found.</p>;
  if (!ev) return <p className="container">Loading…</p>;

  const register = async () => {
    if (!user) return nav('/login', { state: { from: `/events/${slug}` } });   // login required
    try { await registerForEvent(ev._id); setMsg('✅ You are registered!'); } catch (e) { setMsg(errMsg(e)); }
  };

  return (
    <div className="container section event-detail">
      {ev.poster && <img src={ev.poster} alt={ev.title} className="poster" />}
      <span className={`badge badge-${ev.status}`}>{ev.status}</span>
      <h1>{ev.title}</h1>
      <p>{new Date(ev.startDate).toLocaleString('en-IN')} · {ev.venue}</p>
      <p style={{ whiteSpace: 'pre-line' }}>{ev.description}</p>

      {ev.schedule?.length > 0 && <><h3>Schedule</h3><ul>{ev.schedule.map((s, i) => <li key={i}><b>{s.time}</b> {s.title}</li>)}</ul></>}
      {ev.rules?.length > 0 && <><h3>Rules</h3><ul>{ev.rules.map((r, i) => <li key={i}>{r}</li>)}</ul></>}
      {ev.prizes?.length > 0 && <><h3>Prizes</h3><ul>{ev.prizes.map((r, i) => <li key={i}>{r}</li>)}</ul></>}

      {ev.winners?.length > 0 && <><h3>🏆 Winners</h3><ul>{ev.winners.map((r, i) => <li key={i}>{r}</li>)}</ul></>}
      {ev.speakers?.length > 0 && <><h3>Mentors &amp; speakers</h3><ul>{ev.speakers.map((s, i) => <li key={i}><b>{s.name}</b> · {s.role}</li>)}</ul></>}

      {ev.externalLink && <p><a href={ev.externalLink} target="_blank" rel="noreferrer" className="btn btn-outline">Visit event website →</a></p>}
      {ev.canRegister
        ? <button className="btn btn-primary" onClick={register}>Register</button>
        : <p className="muted">Registration closed.</p>}
      {msg && <p>{msg}</p>}

      {ev.status === 'past' && ev.photos?.length > 0 && (
        <><h3>Photos</h3><div className="mini-gallery">{ev.photos.map((p) => <img key={p} src={p} alt="" />)}</div></>
      )}
    </div>
  );
}
