import { useState } from 'react';
import http, { errMsg } from '../../api/http.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';

const SOCIALS = [['instagram', 'Instagram'], ['linkedin', 'LinkedIn'], ['x', 'X'], ['youtube', 'YouTube'], ['scsit', 'SCSIT Instagram']];

// group help-desk rows by role
const groupByRole = (rows = []) => rows.reduce((m, r) => ((m[r.role] ||= []).push(r), m), {});

export default function ContactPage() {
  const { settings: s } = useSettings();
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' });
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try { const r = await http.post('/contact', f); setMsg('✅ ' + r.data.message); setF({ name: '', email: '', subject: '', message: '' }); }
    catch (err) { setMsg(errMsg(err)); }
  };
  const mapQuery = encodeURIComponent(s.address || 'SCSIT DAVV Indore');

  return (
    <>
      <PageHeader title="Contact Us" subtitle="Questions, ideas, sponsorships? Write to us." />
      <div className="container section contact-grid">
        <form onSubmit={submit} className="form">
          <input placeholder="Your name" value={f.name} onChange={set('name')} required />
          <input type="email" placeholder="Your email" value={f.email} onChange={set('email')} required />
          <input placeholder="Subject" value={f.subject} onChange={set('subject')} />
          <textarea rows="6" placeholder="Message" value={f.message} onChange={set('message')} required />
          <button className="btn btn-primary">Send message</button>
          {msg && <p>{msg}</p>}
        </form>

        <div>
          <div className="card"><div className="card-body">
            <h3>Reach us</h3>
            <p>📍 {s.address || 'SCSIT, DAVV, Indore'}</p>
            {s.email && <p>✉️ <a href={`mailto:${s.email}`}>{s.email}</a></p>}
            {s.phone && <p>📞 <a href={`tel:${s.phone}`}>{s.phone}</a></p>}
            <div className="socials">
              {SOCIALS.map(([k, l]) => s.social?.[k] && <a key={k} href={s.social[k]} target="_blank" rel="noreferrer">{l}</a>)}
            </div>
          </div></div>
          <iframe title="Map" className="map" loading="lazy" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} />
        </div>
      </div>

      {s.helpDesk?.length > 0 && (
        <div className="container section">
          <h2>Help Desk</h2>
          <div className="grid-3">
            {Object.entries(groupByRole(s.helpDesk)).map(([role, people]) => (
              <div key={role} className="card"><div className="card-body">
                <h3>{role}</h3>
                {people.map((p) => <p key={p.name}><b>{p.name}</b><br /><a href={`tel:${p.phone.replace(/\s/g, '')}`}>{p.phone}</a></p>)}
              </div></div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
