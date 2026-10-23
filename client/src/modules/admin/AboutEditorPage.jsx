import { useEffect, useState } from 'react';
import http, { errMsg } from '../../api/http.js';
import { useSettings } from '../../context/SettingsContext.jsx';

// timeline is typed as lines:  2019 | E-Cell founded
const toLines = (tl = []) => tl.map((t) => `${t.year} | ${t.text}`).join('\n');
const fromLines = (s) => s.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
  const [year, ...rest] = l.split('|'); return { year: year.trim(), text: rest.join('|').trim() };
});

export default function AboutEditorPage() {
  const { setSettings } = useSettings();
  const [a, setA] = useState(null);
  const [timeline, setTimeline] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => { http.get('/settings').then((r) => { setA(r.data.about || {}); setTimeline(toLines(r.data.about?.timeline)); }); }, []);
  if (!a) return null;
  const set = (k) => (e) => setA({ ...a, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    try {
      const about = { ...a, timeline: fromLines(timeline) };
      const { data } = await http.put('/settings', { about });
      setSettings(data); setMsg('Saved ✅');
    } catch (er) { setMsg(errMsg(er)); }
  };
  return (
    <form className="form" onSubmit={save}>
      <h1>About Page</h1>
      <label><span>Intro paragraph (About us)</span><textarea rows="4" value={a.intro || ''} onChange={set('intro')} /></label>
      <label><span>About DAVV</span><textarea rows="3" value={a.davv || ''} onChange={set('davv')} /></label>
      <label><span>About SCSIT</span><textarea rows="3" value={a.scsit || ''} onChange={set('scsit')} /></label>
      <label><span>Vision</span><textarea rows="3" value={a.vision || ''} onChange={set('vision')} /></label>
      <label><span>Mission</span><textarea rows="3" value={a.mission || ''} onChange={set('mission')} /></label>
      <label><span>Objectives (one per line)</span>
        <textarea rows="4" value={(a.objectives || []).join('\n')} onChange={(e) => setA({ ...a, objectives: e.target.value.split('\n') })} /></label>
      <label><span>Journey / timeline (one per line, format: year | text)</span>
        <textarea rows="5" value={timeline} onChange={(e) => setTimeline(e.target.value)} /></label>
      <label><span>Message from faculty coordinator / HOD</span><textarea rows="4" value={a.facultyMessage || ''} onChange={set('facultyMessage')} /></label>
      <button className="btn btn-primary">Save</button>{msg && <p>{msg}</p>}
    </form>
  );
}
