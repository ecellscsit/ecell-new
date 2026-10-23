import { useEffect, useState } from 'react';
import http, { errMsg } from '../../api/http.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import { toLines, fromLines } from '../../utils/lines.js';

const STAT = ['value', 'suffix', 'label'];
const TEST = ['name', 'team', 'text'];

// Everything on the home page that is plain text. (Featured startups, hero photos and the
// mini gallery are ticked inside the Startups and Gallery sections.)
export default function HomeSettingsPage() {
  const { setSettings } = useSettings();
  const [s, setS] = useState(null);
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState('');
  const [tests, setTests] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    http.get('/settings').then((r) => { setS(r.data); setStats(toLines(r.data.stats, STAT)); setTests(toLines(r.data.testimonials, TEST)); });
    http.get('/team').then((r) => setTeam(r.data));
  }, []);
  if (!s) return null;

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await http.put('/settings', {
        hero: s.hero, tagline: s.tagline, hod: s.hod, sponsors: (s.sponsors || []).filter(Boolean),
        stats: fromLines(stats, STAT).map((x) => ({ ...x, value: Number(x.value) || 0 })),
        testimonials: fromLines(tests, TEST),
        president: s.president || null, vicePresident: s.vicePresident || null,
      });
      setSettings(data); setMsg('Saved ✅');
    } catch (err) { setMsg(errMsg(err)); }
  };
  const hero = (k) => (e) => setS({ ...s, hero: { ...s.hero, [k]: e.target.value } });
  const hod = (k) => (e) => setS({ ...s, hod: { ...s.hod, [k]: e.target.value } });
  const pick = (k) => (
    <select value={s[k] || ''} onChange={(e) => setS({ ...s, [k]: e.target.value })}>
      <option value="">none</option>{team.map((m) => <option key={m._id} value={m._id}>{m.name} ({m.role}, {m.year})</option>)}
    </select>);

  return (
    <form className="form" onSubmit={save}>
      <h1>Home Page</h1>
      <h3>Hero</h3>
      <label><span>Headline</span><input value={s.hero?.headline || ''} onChange={hero('headline')} /></label>
      <label><span>Description</span><textarea rows="3" value={s.hero?.description || ''} onChange={hero('description')} /></label>
      <label><span>Highlight line (green dot text)</span><input value={s.hero?.highlight || ''} onChange={hero('highlight')} /></label>

      <h3>Counters (one per line: number | suffix | label)</h3>
      <textarea rows="4" value={stats} onChange={(e) => setStats(e.target.value)} placeholder="1300 | + | Students Impacted" />

      <h3>Message from HOD</h3>
      <label><span>Name</span><input value={s.hod?.name || ''} onChange={hod('name')} /></label>
      <label><span>Title</span><input value={s.hod?.title || ''} onChange={hod('title')} /></label>
      <label><span>Message</span><textarea rows="4" value={s.hod?.message || ''} onChange={hod('message')} /></label>

      <h3>Leadership section</h3>
      <label><span>Tagline</span><input value={s.tagline || ''} onChange={(e) => setS({ ...s, tagline: e.target.value })} /></label>
      <label><span>First person (e.g. Founder)</span>{pick('president')}</label>
      <label><span>Second person (e.g. Co-Founder)</span>{pick('vicePresident')}</label>

      <h3>Partners &amp; sponsors (one per line)</h3>
      <textarea rows="4" value={(s.sponsors || []).join('\n')} onChange={(e) => setS({ ...s, sponsors: e.target.value.split('\n') })} />

      <h3>Testimonials (one per line: name | team | quote)</h3>
      <textarea rows="5" value={tests} onChange={(e) => setTests(e.target.value)} />

      <button className="btn btn-primary">Save</button>{msg && <p>{msg}</p>}
    </form>
  );
}
